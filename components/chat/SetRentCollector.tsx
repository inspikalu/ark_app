"use client"

import React, { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import * as multisig from "@sqds/multisig";
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

interface SetRentCollectorProps {
  multisigPda: PublicKey | null;
}

const SetRentCollector: React.FC<SetRentCollectorProps> = ({ multisigPda }) => {
  const [newRentCollector, setNewRentCollector] = useState<string>('');
  const { publicKey, sendTransaction } = useWallet();
  const connection = new Connection("https://api.devnet.solana.com");

  const setRentCollector = useCallback(async () => {
    if (!publicKey || !multisigPda) {
      toast.error('Please connect your wallet and create a multisig first');
      return;
    }

    try {
      // Get deserialized multisig account info
      const multisigInfo = await multisig.accounts.Multisig.fromAccountAddress(
        connection,
        multisigPda
      );

      // Get the updated transaction index
      const currentTransactionIndex = Number(multisigInfo.transactionIndex);
      const newTransactionIndex = BigInt(currentTransactionIndex + 1);

      // Create a config transaction to set the rent collector
      const createConfigTxIx = await multisig.instructions.configTransactionCreate({
        multisigPda,
        transactionIndex: newTransactionIndex,
        creator: publicKey,
        actions: [{
          __kind: "SetRentCollector",
          newRentCollector: new PublicKey(newRentCollector),
        }],
      });

      // Create Proposal
      const createProposalIx = await multisig.instructions.proposalCreate({
        multisigPda,
        transactionIndex: newTransactionIndex,
        creator: publicKey,
      });

      // Approve Proposal
      const approveProposalIx = await multisig.instructions.proposalApprove({
        multisigPda,
        transactionIndex: newTransactionIndex,
        member: publicKey,
      });

      // Execute Config Transaction
      const executeConfigTxIx = await multisig.instructions.configTransactionExecute({
        multisigPda,
        transactionIndex: newTransactionIndex,
        member: publicKey,
      });

      // Combine all instructions into a single transaction
      const transaction = new Transaction().add(createConfigTxIx, createProposalIx, approveProposalIx, executeConfigTxIx);

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      toast.success('Rent collector set successfully!');
    } catch (error) {
      toast.error('Error setting rent collector');
      console.error('Error:', error instanceof Error ? error.message : String(error));
    }
  }, [publicKey, multisigPda, connection, sendTransaction, newRentCollector]);

  return (
    <motion.div
      className="mb-8 bg-white p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-4 text-teal-800">Set Rent Collector</h2>
      <motion.input
        type="text"
        placeholder="New Rent Collector Address"
        value={newRentCollector}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewRentCollector(e.target.value)}
        className="border border-teal-300 p-2 mr-2 rounded w-full mb-2"
        whileFocus={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      />
      <motion.button
        onClick={setRentCollector}
        className="bg-teal-600 text-white px-4 py-2 rounded w-full"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Set Rent Collector
      </motion.button>
    </motion.div>
  );
};

export default SetRentCollector;