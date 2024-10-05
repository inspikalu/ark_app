"use client"

import React, { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction, Keypair } from '@solana/web3.js';
import * as multisig from "@sqds/multisig";
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { BN } from '@coral-xyz/anchor';

interface AddSpendingLimitProps {
  multisigPda: PublicKey | null;
}

const AddSpendingLimit: React.FC<AddSpendingLimitProps> = ({ multisigPda }) => {
  const [amount, setAmount] = useState<string>('');
  const [mintAddress, setMintAddress] = useState<string>('');
  const [period, setPeriod] = useState<multisig.types.Period>(multisig.types.Period.Day);
  const [destinationAddress, setDestinationAddress] = useState<string>('');
  const [vaultIndex, setVaultIndex] = useState<string>('0');
  const { publicKey, sendTransaction } = useWallet();
  const connection = new Connection("https://api.devnet.solana.com");

  console.log(setPeriod);


  const addSpendingLimit = useCallback(async () => {
    if (!publicKey || !multisigPda) {
      toast.error('Please connect your wallet and create a multisig first');
      return;
    }

    try {
      const spendingLimitCreateKey = Keypair.generate().publicKey;

      const [spendingLimitPda] = multisig.getSpendingLimitPda({
        multisigPda,
        createKey: spendingLimitCreateKey,
      });

      console.log(spendingLimitPda);


      // Get deserialized multisig account info
      const multisigInfo = await multisig.accounts.Multisig.fromAccountAddress(
        connection,
        multisigPda
      );

      // Get the updated transaction index
      const currentTransactionIndex = Number(multisigInfo.transactionIndex);
      const newTransactionIndex = BigInt(currentTransactionIndex + 1);

      // Create a config transaction to add the spending limit
      const createConfigTxIx = await multisig.instructions.configTransactionCreate({
        multisigPda,
        transactionIndex: newTransactionIndex,
        creator: publicKey,
        actions: [{
          __kind: "AddSpendingLimit",
          createKey: spendingLimitCreateKey,
          vaultIndex: parseInt(vaultIndex),
          mint: new PublicKey(mintAddress),
          amount: new BN(amount),
          members: [], // This means it applies to all members
          destinations: [new PublicKey(destinationAddress)],
          period: period,
        }],
      });

      // Create Proposal
      const createProposalIx = await multisig.instructions.proposalCreate({
        multisigPda,
        transactionIndex: newTransactionIndex,
        creator: publicKey,
      });

      // Approve Proposal
      const approveProposalIx = await multisig.instructions.proposalApprove({
        multisigPda,
        transactionIndex: newTransactionIndex,
        member: publicKey,
      });

      // Execute Config Transaction
      const executeConfigTxIx = await multisig.instructions.configTransactionExecute({
        multisigPda,
        transactionIndex: newTransactionIndex,
        member: publicKey,
      });

      // Combine all instructions into a single transaction
      const transaction = new Transaction().add(createConfigTxIx, createProposalIx, approveProposalIx, executeConfigTxIx);

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      toast.success('Spending limit added successfully!');
    } catch (error) {
      toast.error('Error adding spending limit');
      console.error('Error:', error instanceof Error ? error.message : String(error));
    }
  }, [publicKey, multisigPda, connection, sendTransaction, amount, mintAddress, destinationAddress, vaultIndex]);

  return (
    <motion.div
      className="mb-8 bg-white p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-4 text-teal-800">Add Spending Limit</h2>
      <motion.input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
        className="border border-teal-300 p-2 mr-2 rounded w-full mb-2"
        whileFocus={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      />
      <motion.input
        type="text"
        placeholder="Mint Address"
        value={mintAddress}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMintAddress(e.target.value)}
        className="border border-teal-300 p-2 mr-2 rounded w-full mb-2"
        whileFocus={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      />
      <motion.input
        type="text"
        placeholder="Destination Address"
        value={destinationAddress}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDestinationAddress(e.target.value)}
        className="border border-teal-300 p-2 mr-2 rounded w-full mb-2"
        whileFocus={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      />
      <motion.input
        type="number"
        placeholder="Vault Index"
        value={vaultIndex}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVaultIndex(e.target.value)}
        className="border border-teal-300 p-2 mr-2 rounded w-full mb-2"
        whileFocus={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      />
      <motion.button
        onClick={addSpendingLimit}
        className="bg-teal-600 text-white px-4 py-2 rounded w-full"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Add Spending Limit
      </motion.button>
    </motion.div>
  );
};

export default AddSpendingLimit;