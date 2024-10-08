"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import * as multisig from "@sqds/multisig";
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import CreateProposal from './Proposal';

interface Proposal {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Approved' | 'Rejected';
  type: 'Squads' | 'ARK';
  transactionIndex: number;
}

const ProposalSection: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isSquadsModalOpen, setIsSquadsModalOpen] = useState(false);
  const [isArkModalOpen, setIsArkModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [multisigPda, setMultisigPda] = useState<PublicKey | null>(null);
  const { publicKey, sendTransaction } = useWallet();
  const connection = new Connection("https://api.devnet.solana.com");

  console.log(setMultisigPda);


  useEffect(() => {
    // Fetch existing proposals here
    // This is a placeholder and should be replaced with actual fetching logic
    setProposals([
      { id: '1', name: 'Contribute Funds', description: 'Contribution for transportation costs', status: 'Active', type: 'Squads', transactionIndex: 0 },
      { id: '2', name: 'Upgrade Landing Page', description: 'Design and Build a new landing page', status: 'Approved', type: 'ARK', transactionIndex: 1 },
    ]);

    // Fetch the multisig PDA if available
    // This is a placeholder and should be replaced with actual fetching logic
    if (publicKey) {
      // setMultisigPda(fetchedMultisigPda);
    }
  }, [publicKey]);

  const handleCreateProposal = (newProposal: Proposal) => {
    setProposals(prev => [...prev, newProposal]);
    setIsSquadsModalOpen(false);
    setIsArkModalOpen(false);
  };

  const handleApproveReject = useCallback(async (proposal: Proposal, action: 'Approve' | 'Reject') => {
    if (!publicKey || !multisigPda) {
      toast.error('Please connect your wallet and create a multisig first');
      return;
    }

    try {
      const multisigInfo = await multisig.accounts.Multisig.fromAccountAddress(
        connection,
        multisigPda
      );

      const currentTransactionIndex = BigInt(proposal.transactionIndex);

      if (currentTransactionIndex < BigInt(multisigInfo.staleTransactionIndex.toString())) {
        toast.error(`This proposal is stale and cannot be ${action.toLowerCase()}d`);
        return;
      }

      let ix;
      if (action === 'Approve') {
        ix = await multisig.instructions.proposalApprove({
          multisigPda,
          transactionIndex: currentTransactionIndex,
          member: publicKey,
        });
      } else {
        ix = await multisig.instructions.proposalReject({
          multisigPda,
          transactionIndex: currentTransactionIndex,
          member: publicKey,
        });
      }

      const transaction = new Transaction().add(ix);
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      
      setProposals(prev => prev.map(p => 
        p.id === proposal.id ? { ...p, status: action === 'Approve' ? 'Approved' : 'Rejected' } : p
      ));
      
      toast.success(`Proposal ${action.toLowerCase()}d successfully!`);
      setSelectedProposal(null);
    } catch (error) {
      toast.error(`Error ${action.toLowerCase()}ing proposal`);
      console.error('Error:', error instanceof Error ? error.message : String(error));
    }
  }, [publicKey, multisigPda, connection, sendTransaction]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Proposals</h2>
        <div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSquadsModalOpen(true)}
            className="bg-teal-500 text-white px-4 py-2 rounded mr-2"
          >
            Create Squads Proposal
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsArkModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create ARK Proposal
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {proposals.map((proposal, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-4 rounded-lg shadow cursor-pointer"
            onClick={() => setSelectedProposal(proposal)}
          >
            <h3 className="text-lg font-semibold">{proposal.name}</h3>
            <p className="text-sm text-gray-600">{proposal.type}</p>
            <p className="text-sm text-gray-500">{proposal.description}</p>
            <p className={`text-sm ${proposal.status === 'Active' ? 'text-yellow-500' : proposal.status === 'Approved' ? 'text-green-500' : 'text-red-500'}`}>
              {proposal.status}
            </p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
      {isSquadsModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <div className="bg-white p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Create Squads Proposal</h3>
                <button onClick={() => setIsSquadsModalOpen(false)}>
                  <FiX size={24} />
                </button>
              </div>
              <CreateProposal 
                multisigPda={multisigPda} 
                onProposalCreated={(newProposal) => handleCreateProposal({
                  ...newProposal,
                  id: String(proposals.length + 1),
                  status: 'Active',
                  type: 'Squads'
                })} 
              />
            </div>
          </motion.div>
        )}

        {isArkModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <div className="bg-white p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Create ARK Proposal</h3>
                <button onClick={() => setIsArkModalOpen(false)}>
                  <FiX size={24} />
                </button>
              </div>
              {/* Implement ARK proposal creation form here */}
              <p>Loading...</p>
            </div>
          </motion.div>
        )}

{selectedProposal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{selectedProposal.name}</h3>
                <button onClick={() => setSelectedProposal(null)}>
                  <FiX size={24} />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-2">{selectedProposal.type}</p>
              <p className="text-sm text-gray-500 mb-4">{selectedProposal.description}</p>
              <p className={`text-sm mb-4 ${selectedProposal.status === 'Active' ? 'text-yellow-500' : selectedProposal.status === 'Approved' ? 'text-green-500' : 'text-red-500'}`}>
                Status: {selectedProposal.status}
              </p>
              <p className="text-sm mb-4">Transaction Index: {selectedProposal.transactionIndex}</p>
              {selectedProposal.status === 'Active' && (
                <div className="flex justify-between">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleApproveReject(selectedProposal, 'Approve')}
                    className="bg-green-500 text-white px-4 py-2 rounded mr-2 flex-1"
                  >
                    Approve
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleApproveReject(selectedProposal, 'Reject')}
                    className="bg-red-500 text-white px-4 py-2 rounded flex-1"
                  >
                    Reject
                  </motion.button>
                </div>
              )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };
  
  export default ProposalSection;