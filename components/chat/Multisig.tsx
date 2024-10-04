"use client"

import React, { useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction, Keypair } from '@solana/web3.js';
import * as multisig from "@sqds/multisig";
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const { Permission, Permissions } = multisig.types;

interface CreateMultisigProps {
  onMultisigCreated: (multisigPda: PublicKey) => void;
}

const CreateMultisig: React.FC<CreateMultisigProps> = ({ onMultisigCreated }) => {
  const { publicKey, sendTransaction } = useWallet();
  const connection = new Connection("https://api.devnet.solana.com");

  const createMultisig = useCallback(async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      const createKey = Keypair.generate().publicKey;
      const [multisigPda] = multisig.getMultisigPda({ createKey });
      const [programConfigPda] = multisig.getProgramConfigPda({});

      const programConfig = await multisig.accounts.ProgramConfig.fromAccountAddress(
        connection,
        programConfigPda
      );

      const configTreasury = programConfig.treasury;

      const ix = await multisig.instructions.multisigCreateV2({
        createKey: createKey,
        creator: publicKey,
        multisigPda,
        configAuthority: null,
        timeLock: 0,
        members: [
          {
            key: publicKey,
            permissions: Permissions.all(),
          },
          {
            key: Keypair.generate().publicKey, // Placeholder for second member
            permissions: Permissions.fromPermissions([Permission.Vote]),
          },
        ],
        threshold: 2,
        treasury: configTreasury,
        rentCollector: null
      });

      const transaction = new Transaction().add(ix);
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      onMultisigCreated(multisigPda);
      toast.success('Multisig created successfully!');
    } catch (error) {
      toast.error('Error creating multisig');
      console.error('Error:', error instanceof Error ? error.message : String(error));
    }
  }, [publicKey, connection, sendTransaction, onMultisigCreated]);

  return (
    <motion.div
      className="mb-8 bg-white p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-4 text-teal-800">Create Multisig</h2>
      <motion.button
        onClick={createMultisig}
        className="bg-teal-600 text-white px-4 py-2 rounded"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Create Multisig
      </motion.button>
    </motion.div>
  );
};

export default CreateMultisig;