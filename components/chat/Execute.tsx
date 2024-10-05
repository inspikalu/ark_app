"use client"

import React, { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import * as multisig from "@sqds/multisig";
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

interface ExecuteVaultTransactionProps {
  multisigPda: PublicKey | null;
}

const ExecuteVaultTransaction: React.FC<ExecuteVaultTransactionProps> = ({ multisigPda }) => {
  const [transactionIndex, setTransactionIndex] = useState<string>('');
  const { publicKey, sendTransaction } = useWallet();
  const connection = new Connection("https://api.devnet.solana.com");

  const executeVaultTransaction = useCallback(async () => {
    if (!publicKey || !multisigPda) {
      toast.error('Please connect your wallet and create a multisig first');
      return;
    }

    const multisigInfo = await multisig.accounts.Multisig.fromAccountAddress(
        connection,
        multisigPda
      );
      console.log(multisigInfo);

    try {
    const currentTransactionIndex = BigInt(transactionIndex);

    const { instruction, lookupTableAccounts } = await multisig.instructions.vaultTransactionExecute({
        connection,
        multisigPda,
        transactionIndex: currentTransactionIndex,
        member: publicKey,
      });
      console.log(lookupTableAccounts);

      const transaction = new Transaction().add(instruction);
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      toast.success('Vault transaction executed successfully!');
    } catch (error) {
      toast.error('Error executing vault transaction');
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
      <h2 className="text-2xl font-semibold mb-4 text-teal-800">Execute Vault Transaction</h2>
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
        onClick={executeVaultTransaction}
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Execute Vault Transaction
      </motion.button>
    </motion.div>
  );
};

export default ExecuteVaultTransaction;