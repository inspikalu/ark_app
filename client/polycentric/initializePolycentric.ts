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
  
  export interface InitializeGovernmentArgs {
    name: string;
    description: string;
    nft_config?: GovernanceTokenConfig;
    spl_config?: GovernanceTokenConfig;
    primary_governance_token: PrimaryGovernanceToken;
    initialize_sbt: boolean;
    nft_symbol: string;
    spl_symbol: string;
    collection_price: BN;
  }
  
  export interface GovernanceTokenConfig {
    token_type: { new: {} } | { existing: {} };
    token_mint: PublicKey;
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
      if (!this.wallet.publicKey) {
        throw new Error("Wallet public key is null. Please connect your wallet.");
      }
      return PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode('governance_pool'), this.wallet.publicKey.toBuffer()],
        this.program.programId
      );
    }

    private getAnalyticsPDA(): [PublicKey, number] {
      return PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode('analytics')],
        this.program.programId
      );
    }
  
    public async initializePolycentric(args: InitializeGovernmentArgs): Promise<string> {
      if (!this.wallet.publicKey) {
        throw new Error("Wallet public key is null. Please connect your wallet.");
      }
      const [governancePoolPDA] = this.getGovernancePoolPDA();
      const [analyticsPDA] = this.getAnalyticsPDA();
  
      try {
        // Define the base accounts structure
        const accounts: {
          governancePool: PublicKey;
          admin: PublicKey;
          analytics: PublicKey;
          nftMint?: PublicKey;
          splMint?: PublicKey;
          systemProgram: PublicKey;
          rent: PublicKey;
          clock: PublicKey;
        } = {
          governancePool: governancePoolPDA,
          analytics: analyticsPDA,
          admin: this.wallet.publicKey,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
          clock: SYSVAR_CLOCK_PUBKEY,
        };
  
        // Conditionally include optional accounts if they exist in the args
        if (args.nft_config?.token_mint) {
          accounts.nftMint = args.nft_config.token_mint;
        }
  
        if (args.spl_config?.token_mint) {
          accounts.splMint = args.spl_config.token_mint;
        }
  
        const tx = await this.program.methods
          .initializeGovernment(args)
          .accounts(accounts)
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