import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import FuturisticLoadingAnimation from './Loading';

type GovernanceType = 'flat-dao' | 'polycentric' | 'sortition' | 'conviction' | 'absolute-monarchy' | 'military-junta' | 'sociocracy';

const governanceTypes: Record<GovernanceType, string> = {
  'flat-dao': 'Flat DAO',
  'polycentric': 'Polycentric Governance',
  'sortition': 'Sortition',
  'conviction': 'Conviction Voting',
  'absolute-monarchy': 'Absolute Monarchy',
  'military-junta': 'Military Junta',
  'sociocracy': 'Sociocracy'
};

export default function JoinDAO() {
  const router = useRouter();
  const { type, inviteId } = router.query;
  const [loading, setLoading] = useState(false);
  const wallet = useWallet();

  const handleJoin = async () => {
    if (!wallet.publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    if (!type || typeof type !== 'string' || !inviteId) {
      alert('Invalid invitation link');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/${type}/useInvite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invitePublicKey: inviteId,
          walletPublicKey: wallet.publicKey.toBase58(),
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Successfully joined!');
        router.push('/'); 
      } else {
        throw new Error(data.error || 'Failed to join');
      }
    } catch (error) {
      console.error('Error joining:', error);
      alert('Failed to join. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <FuturisticLoadingAnimation />;
  }

  const governanceType = typeof type === 'string' && type in governanceTypes
    ? governanceTypes[type as GovernanceType]
    : 'Unknown Governance Type';

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-teal-500 to-teal-700">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-lg"
      >
        <h1 className="text-2xl font-bold mb-4 text-teal-800">
          Join {governanceType}
        </h1>
        <p className="mb-4 text-gray-600">
          You are about to join a {governanceType.toLowerCase()} system.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleJoin}
          className="w-full bg-teal-500 text-white p-2 rounded hover:bg-teal-600 transition-colors"
        >
          Join
        </motion.button>
      </motion.div>
    </div>
  );
}