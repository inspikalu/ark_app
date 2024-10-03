'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { FaWallet } from 'react-icons/fa6';
import { WalletContextState } from '@solana/wallet-adapter-react';

interface WalletDisplayProps {
  wallet: WalletContextState;
}

const WalletDisplay: React.FC<WalletDisplayProps> = ({ wallet }) => {
  const shortenAddress = (address: string | undefined): string => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex items-center bg-teal-100 rounded-full px-4 py-2"
    >
      <FaWallet className="mr-2" />
      {wallet.connected ? (
        <span className="text-sm font-medium">
          {shortenAddress(wallet.publicKey?.toString())}
        </span>
      ) : (
        <span className="text-sm font-medium">Not connected</span>
      )}
    </motion.div>
  );
};

export default WalletDisplay;