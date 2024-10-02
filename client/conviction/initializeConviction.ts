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
    BN,
    Idl,
    AnchorError,
  } from '@coral-xyz/anchor';
  import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
  import { CustomWallet } from '../../components/new/CustomWallet';
  
  import rawIdl from '../../idl/conviction.json';
import { useMemo } from 'react';
  
  interface CustomIdl extends Idl {
    address: string;
  }
  
  const idl: CustomIdl = rawIdl as CustomIdl;
  
  type ConvictionIDL = typeof idl;
  
  export interface InitializeGovernanceArgs {
    name: string;
    description: string;
    nft_symbol: string;
    spl_symbol: string;
    nft_supply: BN;
    spl_supply: BN;
    approval_threshold: BN;
    min_stake_amount: BN;
    collection_price: BN;
    nft_config?: TokenConfig;
    spl_config?: TokenConfig;
    primary_governance_token: PrimaryGovernanceToken;
  }
  
  export interface TokenConfig {
    tokenType: { new: {} } | { existing: {} };
    customMint: PublicKey;
  }
  
  type PrimaryGovernanceToken = { NFT: {} } | { SPL: {} };

  
  export class ConvictionClient {
    private program: Program<ConvictionIDL>;
  
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
  
    private getGovernancePDA(): [PublicKey, number] {
      if (!this.wallet.publicKey) {
        throw new Error("Wallet public key is null. Please connect your wallet.");
      }
      return PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode('governance'), this.wallet.publicKey.toBuffer()],
        this.program.programId
      );
    }
  
    public async initializeConviction(args: InitializeGovernanceArgs): Promise<string> {
      if (!this.wallet.publicKey) {
        throw new Error("Wallet public key is null. Please connect your wallet.");
      }
      const [governancePDA] = this.getGovernancePDA();
  
      try {
        // Define the base accounts structure
        const accounts: {
          authority: PublicKey;
          governance: PublicKey;
          nftMint?: PublicKey;
          splMint?: PublicKey;
          systemProgram: PublicKey;
          tokenProgram: PublicKey;
          rent: PublicKey;
        } = {
          authority: this.wallet.publicKey,
          governance: governancePDA,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
        };
  
        // Conditionally include optional accounts if they exist in the args
        if (args.nft_config?.customMint) {
          accounts.nftMint = args.nft_config.customMint;
        }
  
        if (args.spl_config?.customMint) {
          accounts.splMint = args.spl_config.customMint;
        }
  
        // Note: sbtMint is not included here as it wasn't in the original code
        // If you need to include it, you can add similar conditional logic
  
        const tx = await this.program.methods
          .newGovernance(args)
          .accounts(accounts)
          .rpc();
  
        return tx;
      } catch (error) {
        console.error("Detailed error:", error);
        if (error instanceof AnchorError) {
          throw new Error(`Anchor error initializing conviction governance: ${error.message}\nError Code: ${error}\nError Name: ${error.name}`);
        } else if (error instanceof Error) {
          throw new Error(`Error initializing conviction governance: ${error.message}`);
        } else {
          throw new Error(`Unknown error initializing conviction governance: ${String(error)}`);
        }
      }
    }
  }
  
  export function createConvictionClient(
    connection: Connection,
    wallet: CustomWallet,
    programId: PublicKey
  ): ConvictionClient {
    return new ConvictionClient(connection, wallet, programId);
  }
  
  export function useConvictionClient(
    connection: Connection,
    wallet: CustomWallet,
    programId: PublicKey
  ): ConvictionClient | null {
    return useMemo(() => {
      if (wallet && wallet.publicKey) {
        try {
          return new ConvictionClient(connection, wallet, programId);
        } catch (error) {
          console.error("Failed to create ConvictionClient:", error);
          return null;
        }
      }
      return null;
    }, [connection, wallet, programId]);
  }