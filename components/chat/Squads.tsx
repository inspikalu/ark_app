"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, SystemProgram, LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import CreateMultisig from './Multisig';
import CreateVaultTransaction from './VaultTransaction';
import CreateProposal from './Proposal';
import ApproveProposal from './Approve';
import RejectProposal from './Reject';
import CancelProposal from './Cancel';
import ExecuteVaultTransaction from './Execute';
import AddMember from './AddMember';
import RemoveMember from './RemoveMember';
import ChangeThreshold from './ChangeThreshold';
import SetTimelock from './SetTimelocks'
import AddSpendingLimit from './SpendingLimit';
import RemoveSpendingLimit from './RemoveSpendingLimit';
import SetRentCollector from './SetRentCollector';

interface Proposal {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Approved' | 'Rejected';
  type: 'Squads' | 'ARK';
  transactionIndex: number;
}

interface DataPoint {
  month: string;
  revenue: number;
}

const generateData = (): DataPoint[] => [...Array(12)].map((_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  revenue: Math.floor(Math.random() * 5000) + 1000
}));

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change }) => (
  <motion.div
    className="bg-white p-4 rounded-lg shadow-lg"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h3 className="text-teal-600 font-semibold mb-2">{title}</h3>
    <p className="text-2xl font-bold text-teal-800">{value}</p>
    <p className={`text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
      {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
    </p>
  </motion.div>
);

const Dashboard: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [data, setData] = useState<DataPoint[]>(generateData());
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [multisigPda, setMultisigPda] = useState<PublicKey | null>(null);
  const { publicKey, sendTransaction } = useWallet();
  const connection = new Connection("https://api.devnet.solana.com");

  console.log(setData);


  useEffect(() => {
    if (publicKey) {
      updateBalance();
    }
  }, [publicKey]);

  const updateBalance = useCallback(async () => {
    if (publicKey) {
      const balance = await connection.getBalance(publicKey);
      setBalance(balance / LAMPORTS_PER_SOL);
    }
  }, [publicKey, connection]);

  const handleProposalCreated = useCallback((newProposal: { name: string; description: string; transactionIndex: number }) => {
    setProposals(prev => [...prev, {
      ...newProposal,
      id: String(prev.length + 1),
      status: 'Active',
      type: 'Squads'
    }]);
  }, []);

  const handleSend = useCallback(async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet');
      return;
    }
    try {
      const recipientPubkey = new PublicKey(recipient);
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubkey,
          lamports: LAMPORTS_PER_SOL * parseFloat(amount),
        })
      );
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      toast.success('Transaction sent successfully!');
      updateBalance();
    } catch (error) {
      toast.error('Error sending transaction');
      console.error('Error:', error);
    }
  }, [publicKey, recipient, amount, connection, sendTransaction, updateBalance]);

  const handleMultisigCreated = useCallback((newMultisigPda: PublicKey) => {
    setMultisigPda(newMultisigPda);
  }, []);

  return (
    <motion.div
      className="p-8 bg-teal-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-4xl font-bold mb-8 text-teal-800"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
      >
        Treasury Dashboard
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard title="Balance" value={`${balance.toFixed(2)} SOL`} change={5} />
        <MetricCard title="Transactions" value="143" change={-2} />
        <MetricCard title="Active Users" value="1,234" change={10} />
      </div>
      <motion.div
        className="mb-8 bg-white p-6 rounded-lg shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-teal-800">Revenue Chart</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Bar dataKey="revenue" fill="#0d9488" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
      <motion.div
        className="mb-8 bg-white p-6 rounded-lg shadow-lg"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-teal-800">Send SOL</h2>
        <input
          type="text"
          placeholder="Recipient address"
          value={recipient}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRecipient(e.target.value)}
          className="border border-teal-300 p-2 mr-2 rounded"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
          className="border border-teal-300 p-2 mr-2 rounded"
        />
        <motion.button
          onClick={handleSend}
          className="bg-teal-600 text-white px-4 py-2 rounded"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Send
        </motion.button>
      </motion.div>
      <CreateMultisig onMultisigCreated={handleMultisigCreated} />
      <CreateVaultTransaction multisigPda={multisigPda} />
      <CreateProposal 
        multisigPda={multisigPda} 
        onProposalCreated={handleProposalCreated}
      />

    <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-teal-800">Proposals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {proposals.map((proposal) => (
            <motion.div
              key={proposal.id}
              className="bg-white p-4 rounded-lg shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold">{proposal.name}</h3>
              <p className="text-sm text-gray-600">{proposal.description}</p>
              <p className={`text-sm ${proposal.status === 'Active' ? 'text-yellow-500' : proposal.status === 'Approved' ? 'text-green-500' : 'text-red-500'}`}>
                {proposal.status}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ApproveProposal multisigPda={multisigPda} />
        <RejectProposal multisigPda={multisigPda} />
        <CancelProposal multisigPda={multisigPda} />
      </div>
      <ExecuteVaultTransaction multisigPda={multisigPda} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <AddMember multisigPda={multisigPda} />
        <RemoveMember multisigPda={multisigPda} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <ChangeThreshold multisigPda={multisigPda} />
        <SetTimelock multisigPda={multisigPda} />
        <SetRentCollector multisigPda={multisigPda} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <AddSpendingLimit multisigPda={multisigPda} />
        <RemoveSpendingLimit multisigPda={multisigPda} />
      </div>
    </motion.div>
  );
};

export default Dashboard;