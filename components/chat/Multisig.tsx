'use client'

import React, { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import * as multisig from "@sqds/multisig";
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const { Permission, Permissions } = multisig.types;
console.log(Permission);

interface CreateMultisigProps {
  onMultisigCreated: (multisigPda: PublicKey, name: string) => void;
}

const CreateMultisig: React.FC<CreateMultisigProps> = ({ onMultisigCreated }) => {
  const { publicKey, sendTransaction } = useWallet();
  const connection = new Connection("https://api.devnet.solana.com");

  const [name, setName] = useState('');
  const [memberCount, setMemberCount] = useState(2);
  const [members, setMembers] = useState(['', '']);
  const [threshold, setThreshold] = useState(2);

  const createMultisig = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      const [multisigPda] = multisig.getMultisigPda({ createKey: publicKey });
      const [programConfigPda] = multisig.getProgramConfigPda({});

      const programConfig = await multisig.accounts.ProgramConfig.fromAccountAddress(
        connection,
        programConfigPda
      );

      const configTreasury = programConfig.treasury;

      const membersList = members.map(member => ({
        key: new PublicKey(member),
        permissions: Permissions.all(),
      }));

      const ix = await multisig.instructions.multisigCreateV2({
        createKey: publicKey,
        creator: publicKey,
        multisigPda,
        configAuthority: null,
        timeLock: 0,
        members: membersList,
        threshold,
        treasury: configTreasury,
        rentCollector: null
      });

      const transaction = new Transaction().add(ix);
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      onMultisigCreated(multisigPda, name);
      toast.success('Multisig created successfully!');
    } catch (error) {
      toast.error('Error creating multisig');
      console.error('Error:', error instanceof Error ? error.message : String(error));
    }
  }, [publicKey, connection, sendTransaction, onMultisigCreated, name, members, threshold]);

  const handleMemberChange = (index: number, value: string) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  return (
    <motion.div
      className="mb-8 bg-white p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-4 text-teal-800">Create Multisig</h2>
      <form onSubmit={createMultisig}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Multisig Name"
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="number"
          value={memberCount}
          onChange={(e) => {
            const count = parseInt(e.target.value);
            setMemberCount(count);
            setMembers(Array(count).fill(''));
          }}
          min="2"
          placeholder="Number of Members"
          className="w-full p-2 mb-4 border rounded"
          required
        />
        {members.map((member, index) => (
          <input
            key={index}
            type="text"
            value={member}
            onChange={(e) => handleMemberChange(index, e.target.value)}
            placeholder={`Member ${index + 1} Public Key`}
            className="w-full p-2 mb-4 border rounded"
            required
          />
        ))}
        <input
          type="number"
          value={threshold}
          onChange={(e) => setThreshold(parseInt(e.target.value))}
          min="1"
          max={memberCount}
          placeholder="Threshold"
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <motion.button
          type="submit"
          className="bg-teal-600 text-white px-4 py-2 rounded w-full"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Create Multisig
        </motion.button>
      </form>
    </motion.div>
  );
};

export default CreateMultisig;