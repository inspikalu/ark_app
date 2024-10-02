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
  import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
  import { CustomWallet } from '../../components/new/CustomWallet';
  
  import rawIdl from '../../idl/military_junta.json';
import { useMemo } from 'react';
  
  interface CustomIdl extends Idl {
    address: string;
  }
  
  const idl: CustomIdl = rawIdl as CustomIdl;
  
  type MilJuntaIDL = typeof idl;
  
  export interface InitializeJuntaArgs {
    name: string;
    supply: number;
    symbol: string;
    support_threshold: number;
    collection_price: BN;
    nft_config?: JuntaTokenConfig;
    spl_config?: JuntaTokenConfig;
    nft_symbol: string;
    spl_symbol: string;
    nft_supply: BN;
    spl_supply: BN;
    primary_junta_token: PrimaryJuntaToken;
  }
  
  export interface JuntaTokenConfig {
    token_type: { new: {} } | { existing: {} };
    token_mint: PublicKey;
  }
  
  type PrimaryJuntaToken = { NFT: {} } | { SPL: {} };
  
  export class MilJuntaClient {
    private program: Program<MilJuntaIDL>;
  
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
  
    private getJuntaPDA(name: string): [PublicKey, number] {
      return PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode('junta'), utils.bytes.utf8.encode(name)],
        this.program.programId
      );
    }
  
    public async initializeMilJunta(args: InitializeJuntaArgs): Promise<string> {
      if (!this.wallet.publicKey) {
        throw new Error("Wallet public key is null. Please connect your wallet.");
      }
      const [juntaPDA] = this.getJuntaPDA(args.name);
  
      try {
        // Define the base accounts structure
        const accounts: {
          junta: PublicKey;
          leader: PublicKey;
          nftMint?: PublicKey;
          splMint?: PublicKey;
          tokenProgram: PublicKey;
          associatedTokenProgram: PublicKey;
          systemProgram: PublicKey;
          rent: PublicKey;
        } = {
          junta: juntaPDA,
          leader: this.wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        };
  
        // Conditionally include optional accounts if they exist in the args
        if (args.nft_config?.token_mint) {
          accounts.nftMint = args.nft_config.token_mint;
        }
  
        if (args.spl_config?.token_mint) {
          accounts.splMint = args.spl_config.token_mint;
        }
  
        const tx = await this.program.methods
          .initializeMilJunta(args)
          .accounts(accounts)
          .rpc();
  
        return tx;
      } catch (error) {
        console.error("Detailed error:", error);
        if (error instanceof AnchorError) {
          throw new Error(`Anchor error initializing military junta: ${error.message}\nError Code: ${error}\nError Name: ${error.name}`);
        } else if (error instanceof Error) {
          throw new Error(`Error initializing military junta: ${error.message}`);
        } else {
          throw new Error(`Unknown error initializing military junta: ${String(error)}`);
        }
      }
    }
  }
  
  export function createMilJuntaClient(
    connection: Connection,
    wallet: CustomWallet,
    programId: PublicKey
  ): MilJuntaClient {
    return new MilJuntaClient(connection, wallet, programId);
  }
  
  export function useMilJuntaClient(
    connection: Connection,
    wallet: CustomWallet,
    programId: PublicKey
  ): MilJuntaClient | null {
    return useMemo(() => {
      if (wallet && wallet.publicKey) {
        try {
          return new MilJuntaClient(connection, wallet, programId);
        } catch (error) {
          console.error("Failed to create MilJuntaClient:", error);
          return null;
        }
      }
      return null;
    }, [connection, wallet, programId]);
  }