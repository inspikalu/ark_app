import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import CreateProposal from './Proposal';
import ApproveProposal from './Approve';
import RejectProposal from './Reject';

interface Proposal {
  id: string;
  title: string;
  description: string;
  status: 'Active' | 'Approved' | 'Rejected';
  type: 'Squads' | 'ARK';
}

const ProposalSection: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isSquadsModalOpen, setIsSquadsModalOpen] = useState(false);
  const [isArkModalOpen, setIsArkModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [multisigPda, setMultisigPda] = useState<PublicKey | null>(null);
  const { publicKey } = useWallet();
  const connection = new Connection("https://api.devnet.solana.com");

  useEffect(() => {
    // Fetch existing proposals here
    // This is a placeholder and should be replaced with actual fetching logic
    setProposals([
      { id: '1', title: 'Proposal 1', description: 'Description 1', status: 'Active', type: 'Squads' },
      { id: '2', title: 'Proposal 2', description: 'Description 2', status: 'Approved', type: 'ARK' },
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

  const handleApproveReject = (proposalId: string, action: 'Approve' | 'Reject') => {
    setProposals(prev => prev.map(p => 
      p.id === proposalId ? { ...p, status: action === 'Approve' ? 'Approved' : 'Rejected' } : p
    ));
    toast.success(`Proposal ${action}d successfully!`);
  };

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
            className="bg-white p-4 rounded-lg shadow"
            onClick={() => setSelectedProposal(proposal)}
          >
            <h3 className="text-lg font-semibold">{proposal.title}</h3>
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
              <CreateProposal multisigPda={multisigPda} />
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
              <p>ARK proposal creation form goes here</p>
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
                  <h3 className="text-xl font-bold">{selectedProposal.title}</h3>
                  <button onClick={() => setSelectedProposal(null)}>
                    <FiX size={24} />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-2">{selectedProposal.type}</p>
                <p className="text-sm text-gray-500 mb-4">{selectedProposal.description}</p>
                <p className={`text-sm mb-4 ${selectedProposal.status === 'Active' ? 'text-yellow-500' : selectedProposal.status === 'Approved' ? 'text-green-500' : 'text-red-500'}`}>
                  Status: {selectedProposal.status}
                </p>
                {selectedProposal.status === 'Active' && (
                  <div className="flex justify-between">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleApproveReject(selectedProposal.id, 'Approve')}
                      className="bg-green-500 text-white px-4 py-2 rounded mr-2 flex-1"
                    >
                      Approve
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleApproveReject(selectedProposal.id, 'Reject')}
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
  
        {selectedProposal && selectedProposal.type === 'Squads' && selectedProposal.status === 'Active' && (
          <div className="mt-4">
            <ApproveProposal multisigPda={multisigPda} />
            <RejectProposal multisigPda={multisigPda} />
          </div>
        )}
      </div>
    );
  };
  
  export default ProposalSection;