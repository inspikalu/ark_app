import React, { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import * as multisig from "@sqds/multisig";
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

interface CreateProposalProps {
  multisigPda: PublicKey | null;
  onProposalCreated: (proposal: { name: string, description: string, transactionIndex: number }) => void;
}

const CreateProposal: React.FC<CreateProposalProps> = ({ multisigPda, onProposalCreated }) => {
  const { publicKey, sendTransaction } = useWallet();
  const connection = new Connection("https://api.devnet.solana.com");

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const createProposal = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
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
      onProposalCreated({ name, description, transactionIndex });
      toast.success('Proposal created successfully!');
    } catch (error) {
      toast.error('Error creating proposal');
      console.error('Error:', error instanceof Error ? error.message : String(error));
    }
  }, [publicKey, multisigPda, connection, sendTransaction, name, description, onProposalCreated]);

  return (
    <motion.div
      className="mb-8 bg-white p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-4 text-teal-800">Create Proposal</h2>
      <form onSubmit={createProposal}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Proposal Name"
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Proposal Description"
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <motion.button
          type="submit"
          className="bg-teal-600 text-white px-4 py-2 rounded w-full"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Create Proposal
        </motion.button>
      </form>
    </motion.div>
  );
};

export default CreateProposal;