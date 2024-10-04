// "use client";
// import { PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";
// import { WalletContextState } from "@solana/wallet-adapter-react";

// export class CustomWallet {
//   constructor(private walletContextState: WalletContextState) {}

//   async getPublicKey(): Promise<PublicKey> {
//     if (!this.walletContextState.publicKey) {
//       throw new Error("Wallet is not connected");
//     }
//     return this.walletContextState.publicKey;
//   }

//   private async signSingleTransaction<T extends Transaction | VersionedTransaction>(tx: T): Promise<T> {
//     if (!this.walletContextState.signTransaction) {
//       throw new Error("signTransaction is not available in this wallet");
//     }
//     if (tx instanceof Transaction) {
//       return await this.walletContextState.signTransaction(tx) as T;
//     }
//     throw new Error("Versioned transactions are not currently supported");
//   }

//   async signTransaction<T extends Transaction | VersionedTransaction>(tx: T): Promise<T> {
//     return this.signSingleTransaction(tx);
//   }

//   async signAllTransactions<T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]> {
//     return Promise.all(txs.map(tx => this.signSingleTransaction(tx)));
//   }
// }

//Old code
'use client'
import { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';

export class CustomWallet {
    constructor(
      private walletContextState: WalletContextState
    ) {}
    get publicKey(): PublicKey | null {
      // Instead of throwing an error, return null if the wallet is not connected
      return this.walletContextState.publicKey || null;
    }
  
    // This method now supports both Transaction and VersionedTransaction
    async signTransaction<T extends Transaction | VersionedTransaction>(tx: T): Promise<T> {
      // Check if signTransaction is available in walletContextState
      if (!this.walletContextState.signTransaction) {
        throw new Error("signTransaction is not available in this wallet.");
      }
      if (tx instanceof Transaction) {
        // If it's a standard Transaction, pass it to the wallet adapter
        return this.walletContextState.signTransaction(tx) as Promise<T>;
      } else {
        // If it's a VersionedTransaction, throw an error (until supported)
        throw new Error("Versioned transactions are not supported by this wallet.");
      }
    }
  
    async signAllTransactions<T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]> {
  
      const signedTxs = await Promise.all(
        txs.map(async (tx) => {
        // Check if signTransaction is available in walletContextState
        if (!this.walletContextState.signTransaction) {
          throw new Error("signTransaction is not available in this wallet.");
        }
          if (tx instanceof Transaction) {
            // Handle standard Transactions
            return this.walletContextState.signTransaction(tx) as Promise<T>;
          } else {
            // Handle VersionedTransaction case (if needed in the future)
            throw new Error("Versioned transactions are not supported.");
          }
        })
      );
  
      return signedTxs;
    }
  }

// UNUSED CODE  
// Create a wrapper for the wallet that satisfies the Wallet interface


// class CustomAnchorProvider extends AnchorProvider {
//   constructor(
//     connection: Connection,
//     wallet: WalletContextState,
//     opts: web3.ConfirmOptions
//   ) {
//     super(connection, wallet as any, opts);
//   }

//   async sendAndConfirm(
//     tx: Transaction,
//     signers?: web3.Signer[],
//     opts?: SendOptions
//   ): Promise<string> {
//     if (signers && signers.length > 0) {
//       throw new Error("CustomAnchorProvider does not support additional signers");
//     }
    
//     const signedTx = await this.wallet.signTransaction!(tx);
//     const rawTransaction = signedTx.serialize();
    
//     const txid = await this.connection.sendRawTransaction(
//       rawTransaction,
//       this.opts
//     );
    
//     await this.connection.confirmTransaction(txid, this.opts.commitment);
    
//     return txid;
//   }
// }