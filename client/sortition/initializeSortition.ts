import {
    Connection,
    PublicKey,
    SystemProgram,
    SYSVAR_RENT_PUBKEY,
  } from '@solana/web3.js';
  import {
    AnchorProvider,
    Program,
    utils,
    Wallet,
    BN,
    Idl,
    AnchorError,
  } from '@coral-xyz/anchor';
  import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
  import { useMemo } from 'react';
  import { CustomWallet } from '../../components/new/CustomWallet'
  
  import rawIdl from '../../idl/sortition.json';
  
  // Define a custom IDL type that extends Anchor's Idl
  interface CustomIdl extends Idl {
    address: string;
    metadata: {
      name: string;
      version: string;
      spec: string;
      description: string;
    };
  }
  
  // Cast the imported IDL to the custom type
  const idl: CustomIdl = rawIdl as CustomIdl;
  
  type SortitionIDL = typeof idl;
  
  interface InitializeGovernmentArgs {
    name: string;
    description: string;
    assembly_size: number;
    regions: number[];
    age_groups: number[];
    other_demographic: number[];
    nft_config: { tokenType: { new: {} } | { existing: {} }; customMint: PublicKey | null } | null;
    spl_config: { tokenType: { new: {} } | { existing: {} }; customMint: PublicKey | null } | null;
    nft_symbol: string;
    spl_symbol: string;
    nft_supply: BN;
    spl_supply: BN;
    collection_price: BN;
    primary_governance_token: { nft: {} } | { spl: {} };
    initialize_sbt: boolean;
  }
  
  export class SortitionClient {
    private program: Program<SortitionIDL>;
  
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
  
    public async initializeSortitionGovernance(args: InitializeGovernmentArgs): Promise<string> {
      const [governancePoolPDA] = this.getGovernancePoolPDA();
  
      try {
        const tx = await this.program.methods
          .initializeSortitionGovernance(args)
          .accounts({
            governancePool: governancePoolPDA,
            admin: this.wallet.publicKey,
            nftMint: args.nft_config?.customMint || null,
            splMint: args.spl_config?.customMint || null,
            sbtMint: null,
            systemProgram: SystemProgram.programId,
            rent: SYSVAR_RENT_PUBKEY,
          })
          .rpc();
  
        return tx;
      } catch (error) {
        console.error("Detailed error:", error);
        if (error instanceof AnchorError) {
          throw new Error(`Anchor error initializing sortition governance: ${error.message}\nError Code: ${error}\nError Name: ${error.name}`);
        } else if (error instanceof Error) {
          throw new Error(`Error initializing sortition governance: ${error.message}`);
        } else {
          throw new Error(`Unknown error initializing sortition governance: ${String(error)}`);
        }
      }
    }
  
    // Add more methods for other instructions here...
  }
  
  export function createSortitionClient(
    connection: Connection,
    wallet: CustomWallet,
    programId: PublicKey
  ): SortitionClient {
    return new SortitionClient(connection, wallet, programId);
  }
  
  export function useSortitionClient(
    connection: Connection,
    wallet: CustomWallet,
    programId: PublicKey
  ): SortitionClient | null {
    return useMemo(() => {
      if (wallet && wallet.publicKey) {
        try {
          return new SortitionClient(connection, wallet, programId);
        } catch (error) {
          console.error("Failed to create SortitionClient:", error);
          return null;
        }
      }
      return null;
    }, [connection, wallet, programId]);
  }