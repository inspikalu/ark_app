"use client"

import React, { useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import * as multisig from "@sqds/multisig";
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

interface CreateProposalProps {
  multisigPda: PublicKey | null;
}

const CreateProposal: React.FC<CreateProposalProps> = ({ multisigPda }) => {
  const { publicKey, sendTransaction } = useWallet();
  const connection = new Connection("https://api.devnet.solana.com");

  const createProposal = useCallback(async () => {
    if (!publicKey || !multisigPda) {
      toast.error('Please connect your wallet and create a multisig first');
      return;
    }

    try {
      const multisigInfo = await multisig.accounts.Multisig.fromAccountAddress(
        connection,
        multisigPda
      );

      const transactionIndex = Number(multisigInfo.transactionIndex);

      const ix = await multisig.instructions.proposalCreate({
        multisigPda,
        transactionIndex: BigInt(transactionIndex),
        creator: publicKey,
      });

      const transaction = new Transaction().add(ix);
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      toast.success('Proposal created successfully!');
    } catch (error) {
      toast.error('Error creating proposal');
      console.error('Error:', error instanceof Error ? error.message : String(error));
    }
  }, [publicKey, multisigPda, connection, sendTransaction]);

  return (
    <motion.div
      className="mb-8 bg-white p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-4 text-teal-800">Create Proposal</h2>
      <motion.button
        onClick={createProposal}
        className="bg-teal-600 text-white px-4 py-2 rounded w-full"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Create Proposal
      </motion.button>
    </motion.div>
  );
};

export default CreateProposal;