"use client"

import React, { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, SystemProgram, LAMPORTS_PER_SOL, Transaction, TransactionMessage } from '@solana/web3.js';
import * as multisig from "@sqds/multisig";
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

interface CreateVaultTransactionProps {
  multisigPda: PublicKey | null;
}

const CreateVaultTransaction: React.FC<CreateVaultTransactionProps> = ({ multisigPda }) => {
  const [vaultRecipient, setVaultRecipient] = useState<string>('');
  const [vaultAmount, setVaultAmount] = useState<string>('');
  const { publicKey, sendTransaction } = useWallet();
  const connection = new Connection("https://api.devnet.solana.com");

  const createVaultTransaction = useCallback(async () => {
    if (!publicKey || !multisigPda) {
      toast.error('Please connect your wallet and create a multisig first');
      return;
    }

    try {
      const [vaultPda] = multisig.getVaultPda({
        multisigPda,
        index: 0,
      });

      const multisigInfo = await multisig.accounts.Multisig.fromAccountAddress(
        connection,
        multisigPda
      );

      const currentTransactionIndex = Number(multisigInfo.transactionIndex);
      const newTransactionIndex = BigInt(currentTransactionIndex + 1);

      const to = new PublicKey(vaultRecipient);

      const transferInstruction = SystemProgram.transfer({
        fromPubkey: vaultPda,
        toPubkey: to,
        lamports: LAMPORTS_PER_SOL * parseFloat(vaultAmount),
      });

      const latestBlockhash = await connection.getLatestBlockhash();
      const messageV0 = new TransactionMessage({
        payerKey: vaultPda,
        recentBlockhash: latestBlockhash.blockhash,
        instructions: [transferInstruction],
      });

      const ix = await multisig.instructions.vaultTransactionCreate({
        multisigPda,
        transactionIndex: newTransactionIndex,
        creator: publicKey,
        vaultIndex: 0,
        ephemeralSigners: 0,
        transactionMessage: messageV0,
        memo: "Vault transfer"
      });

      const transaction = new Transaction().add(ix);
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      toast.success('Vault transaction created successfully!');
    } catch (error) {
      toast.error('Error creating vault transaction');
      console.error('Error:', error instanceof Error ? error.message : String(error));
    }
  }, [publicKey, multisigPda, connection, sendTransaction, vaultRecipient, vaultAmount]);

  return (
    <motion.div
      className="mb-8 bg-white p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-4 text-teal-800">Create Vault Transaction</h2>
      <motion.input
        type="text"
        placeholder="Vault Recipient address"
        value={vaultRecipient}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVaultRecipient(e.target.value)}
        className="border border-teal-300 p-2 mr-2 rounded w-full mb-2"
        whileFocus={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      />
      <motion.input
        type="number"
        placeholder="Vault Amount"
        value={vaultAmount}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVaultAmount(e.target.value)}
        className="border border-teal-300 p-2 mr-2 rounded w-full mb-2"
        whileFocus={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      />
      <motion.button
        onClick={createVaultTransaction}
        className="bg-teal-600 text-white px-4 py-2 rounded w-full"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Create Vault Transaction
      </motion.button>
    </motion.div>
  );
};

export default CreateVaultTransaction;