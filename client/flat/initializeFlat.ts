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
  
  import rawIdl from '../../idl/flat_dao.json';
import { useMemo } from 'react';
  
  interface CustomIdl extends Idl {
    address: string;
  }
  
  const idl: CustomIdl = rawIdl as CustomIdl;
  
  type FlatDaoIDL = typeof idl;
  
  export interface DaoCreateArgs {
    time: Time;
    threshold: number;
    minPollTokens: BN;
    name: string;
  }
  
  export type Time = { FiveSeconds: {} } | { TwentyFourHours: {} } | { FourtyEightHours: {} } | { OneWeek: {} };
  
  export class FlatDaoClient {
    private program: Program<FlatDaoIDL>;
  
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
  
    private getDaoPDA(creator: PublicKey, mint: PublicKey): [PublicKey, number] {
      return PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode('dao'), creator.toBuffer(), mint.toBuffer()],
        this.program.programId
      );
    }
  
    private getVaultPDA(creator: PublicKey, mint: PublicKey): [PublicKey, number] {
      return PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode('vault'), creator.toBuffer(), mint.toBuffer()],
        this.program.programId
      );
    }
  
    private getAnalyticsPDA(): [PublicKey, number] {
      return PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode('analytics')],
        this.program.programId
      );
    }
  
    public async daoCreate(args: DaoCreateArgs, mint: PublicKey): Promise<string> {
      const [daoPDA] = this.getDaoPDA(this.wallet.publicKey!, mint);
      const [vaultPDA] = this.getVaultPDA(this.wallet.publicKey!, mint);
      const [analyticsPDA] = this.getAnalyticsPDA();
      const [authPDA] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode('auth'), analyticsPDA.toBuffer()],
        this.program.programId
      );
  
      try {
        const tx = await this.program.methods
          .daoCreate(args.time, args.threshold, args.minPollTokens, args.name)
          .accounts({
            creator: this.wallet.publicKey,
            auth: authPDA,
            dao: daoPDA,
            signerAta: await utils.token.associatedAddress({
              mint: mint,
              owner: this.wallet.publicKey
            }),
            mint: mint,
            vault: vaultPDA,
            analytics: analyticsPDA,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
  
        return tx;
      } catch (error) {
        console.error("Detailed error:", error);
        if (error instanceof AnchorError) {
          throw new Error(`Anchor error creating flat dao: ${error.message}\nError Code: ${error}\nError Name: ${error.name}`);
        } else if (error instanceof Error) {
          throw new Error(`Error creating flat dao: ${error.message}`);
        } else {
          throw new Error(`Unknown error creating flat dao: ${String(error)}`);
        }
      }
    }
  }
  
  export function createFlatDaoClient(
    connection: Connection,
    wallet: CustomWallet,
    programId: PublicKey
  ): FlatDaoClient {
    return new FlatDaoClient(connection, wallet, programId);
  }
  
  export function useFlatDaoClient(
    connection: Connection,
    wallet: CustomWallet,
    programId: PublicKey
  ): FlatDaoClient | null {
    return useMemo(() => {
      if (wallet && wallet.publicKey) {
        try {
          return new FlatDaoClient(connection, wallet, programId);
        } catch (error) {
          console.error("Failed to create FlatDaoClient:", error);
          return null;
        }
      }
      return null;
    }, [connection, wallet, programId]);
  }