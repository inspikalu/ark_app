"use client"

import React, { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import * as multisig from "@sqds/multisig";
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

interface ChangeThresholdProps {
  multisigPda: PublicKey | null;
}

const ChangeThreshold: React.FC<ChangeThresholdProps> = ({ multisigPda }) => {
  const [newThreshold, setNewThreshold] = useState<string>('');
  const { publicKey, sendTransaction } = useWallet();
  const connection = new Connection("https://api.devnet.solana.com");

  const changeThreshold = useCallback(async () => {
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

      // Create a config transaction, of type changeThreshold
      const createConfigTxIx = await multisig.instructions.configTransactionCreate({
        multisigPda,
        transactionIndex: newTransactionIndex,
        creator: publicKey,
        actions: [{
          __kind: "ChangeThreshold",
          newThreshold: parseInt(newThreshold)
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
      toast.success('Threshold changed successfully!');
    } catch (error) {
      toast.error('Error changing threshold');
      console.error('Error:', error instanceof Error ? error.message : String(error));
    }
  }, [publicKey, multisigPda, connection, sendTransaction, newThreshold]);

  return (
    <motion.div
      className="mb-8 bg-white p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-4 text-teal-800">Change Threshold</h2>
      <motion.input
        type="number"
        placeholder="New Threshold"
        value={newThreshold}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewThreshold(e.target.value)}
        className="border border-teal-300 p-2 mr-2 rounded w-full mb-2"
        whileFocus={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      />
      <motion.button
        onClick={changeThreshold}
        className="bg-teal-600 text-white px-4 py-2 rounded w-full"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Change Threshold
      </motion.button>
    </motion.div>
  );
};

export default ChangeThreshold;