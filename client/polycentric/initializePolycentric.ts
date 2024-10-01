import {
    Connection,
    PublicKey,
    SystemProgram,
    SYSVAR_RENT_PUBKEY,
    SYSVAR_CLOCK_PUBKEY,
  } from '@solana/web3.js';
  import {
    AnchorProvider,
    Program,
    utils,
    BN,
    Idl,
    AnchorError,
  } from '@coral-xyz/anchor';
  import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
  import { CustomWallet } from '../../components/new/CustomWallet';
  
  import rawIdl from '../../idl/polycentric.json';
import { useMemo } from 'react';
  
  interface CustomIdl extends Idl {
    address: string;
  }
  
  const idl: CustomIdl = rawIdl as CustomIdl;
  
  type PolycentricIDL = typeof idl;
  
  interface InitializeGovernmentArgs {
    name: string;
    description: string;
    nft_config: GovernanceTokenConfig | null;
    spl_config: GovernanceTokenConfig | null;
    primary_governance_token: PrimaryGovernanceToken;
    initialize_sbt: boolean;
    nft_symbol: string;
    spl_symbol: string;
    collection_price: BN;
  }
  
  interface GovernanceTokenConfig {
    token_type: { new: {} } | { existing: {} };
    token_mint: PublicKey | null;
  }
  
  type PrimaryGovernanceToken = { NFT: {} } | { SPL: {} };
  
  export class PolycentricClient {
    private program: Program<PolycentricIDL>;
  
    constructor(
      private connection: Connection,
      private wallet: CustomWallet,
      private programId: PublicKey
    ) {
      if (!wallet.publicKey) {
        throw new Error("Wallet is not connected. Please connect your wallet before initializing the client.");
      }
      const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
      this.program = new Program(idl, provider);
    }
  
    private getGovernancePoolPDA(): [PublicKey, number] {
      return PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode('governance_pool'), this.wallet.publicKey.toBuffer()],
        this.program.programId
      );
    }
  
    public async initializePolycentric(args: InitializeGovernmentArgs): Promise<string> {
      const [governancePoolPDA] = this.getGovernancePoolPDA();
  
      try {
        const tx = await this.program.methods
          .initializeGovernment(args)
          .accounts({
            governancePool: governancePoolPDA,
            admin: this.wallet.publicKey,
            analytics: null, // This will be created by the program
            nftMint: args.nft_config?.token_mint || null,
            splMint: args.spl_config?.token_mint || null,
            sbtMint: null, // This might need to be adjusted based on your specific requirements
            systemProgram: SystemProgram.programId,
            rent: SYSVAR_RENT_PUBKEY,
            clock: SYSVAR_CLOCK_PUBKEY,
          })
          .rpc();
  
        return tx;
      } catch (error) {
        console.error("Detailed error:", error);
        if (error instanceof AnchorError) {
          throw new Error(`Anchor error initializing polycentric governance: ${error.message}\nError Code: ${error}\nError Name: ${error.name}`);
        } else if (error instanceof Error) {
          throw new Error(`Error initializing polycentric governance: ${error.message}`);
        } else {
          throw new Error(`Unknown error initializing polycentric governance: ${String(error)}`);
        }
      }
    }
  }
  
  export function createPolycentricClient(
    connection: Connection,
    wallet: CustomWallet,
    programId: PublicKey
  ): PolycentricClient {
    return new PolycentricClient(connection, wallet, programId);
  }
  
  export function usePolycentricClient(
    connection: Connection,
    wallet: CustomWallet,
    programId: PublicKey
  ): PolycentricClient | null {
    return useMemo(() => {
      if (wallet && wallet.publicKey) {
        try {
          return new PolycentricClient(connection, wallet, programId);
        } catch (error) {
          console.error("Failed to create PolycentricClient:", error);
          return null;
        }
      }
      return null;
    }, [connection, wallet, programId]);
  }