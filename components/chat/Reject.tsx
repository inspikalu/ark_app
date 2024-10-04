"use client"

import React, { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import * as multisig from "@sqds/multisig";
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

interface RejectProposalProps {
  multisigPda: PublicKey | null;
}

const RejectProposal: React.FC<RejectProposalProps> = ({ multisigPda }) => {
  const [transactionIndex, setTransactionIndex] = useState<string>('');
  const { publicKey, sendTransaction } = useWallet();
  const connection = new Connection("https://api.devnet.solana.com");

  const rejectProposal = useCallback(async () => {
    if (!publicKey || !multisigPda) {
      toast.error('Please connect your wallet and create a multisig first');
      return;
    }

    try {
      const multisigInfo = await multisig.accounts.Multisig.fromAccountAddress(
        connection,
        multisigPda
      );

      const currentTransactionIndex = BigInt(transactionIndex);

      if (currentTransactionIndex < BigInt(multisigInfo.staleTransactionIndex.toString())) {
        toast.error('This proposal is stale and cannot be rejected');
        return;
      }

      const ix = await multisig.instructions.proposalReject({
        multisigPda,
        transactionIndex: currentTransactionIndex,
        member: publicKey,
      });

      const transaction = new Transaction().add(ix);
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      toast.success('Proposal rejected successfully!');
    } catch (error) {
      toast.error('Error rejecting proposal');
      console.error('Error:', error instanceof Error ? error.message : String(error));
    }
  }, [publicKey, multisigPda, connection, sendTransaction, transactionIndex]);

  return (
    <motion.div
      className="mb-8 bg-white p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-4 text-teal-800">Reject Proposal</h2>
      <motion.input
        type="number"
        placeholder="Transaction Index"
        value={transactionIndex}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTransactionIndex(e.target.value)}
        className="border border-teal-300 p-2 mr-2 rounded w-full mb-2"
        whileFocus={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      />
      <motion.button
        onClick={rejectProposal}
        className="bg-red-600 text-white px-4 py-2 rounded w-full"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Reject Proposal
      </motion.button>
    </motion.div>
  );
};

export default RejectProposal;