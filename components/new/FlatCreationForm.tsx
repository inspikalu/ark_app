'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { AnchorProvider, Program, web3, BN } from '@coral-xyz/anchor';
import { FiCheck, FiX } from 'react-icons/fi';

// Import your IDL
import idl from '../../idl/flat_dao.json';

const PROGRAM_ID = new PublicKey('FNF2M3rVeAhQ28VTCNVYzfKTnX1ZcStGuDZ9geVzY38Q');

interface FlatDaoCreationFormProps {
  governanceType: 'flat-dao';
}

const FlatDaoCreationForm: React.FC<FlatDaoCreationFormProps> = ({ governanceType }) => {
  const [loading, setLoading] = useState(true);
  const [program, setProgram] = useState<Program | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const { connection } = useConnection();
  const wallet = useWallet();

  const [daoForm, setDaoForm] = useState({
    name: '',
    time: 'FiveSeconds',
    threshold: 50,
    minPollTokens: '',
    mintAddress: '',
  });

  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      const provider = new AnchorProvider(connection, wallet as any, {});
      const program = new Program(idl as any, provider);
      setProgram(program);
      setLoading(false);
    }
  }, [wallet.connected, wallet.publicKey, connection]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDaoForm(prev => ({ ...prev, [name]: value }));
  };

  const initializeAnalytics = async () => {
    if (!program || !wallet.publicKey) return;
    setLoading(true);
    setError(null);
    try {
      const [analyticsPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("analytics")],
        program.programId
      );
      
      const [authPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("auth"), analyticsPda.toBuffer()],
        program.programId
      );

      const tx = await program.methods.initAnalytics()
        .accounts({
          signer: wallet.publicKey,
          auth: authPda,
          analytics: analyticsPda,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();
      console.log("Analytics initialized. Transaction signature", tx);
      setSuccess("Analytics initialized successfully");
    } catch (err) {
      setError(`Failed to initialize analytics: ${err instanceof Error ? err.message : String(err)}`);
    }
    setLoading(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!program || !wallet.publicKey) return;
    setLoading(true);
    setError(null);

    try {
      const mint = new PublicKey(daoForm.mintAddress);
      const tx = await program.methods.daoCreate({
        time: { [daoForm.time]: {} },
        threshold: Number(daoForm.threshold),
        minPollTokens: new BN(daoForm.minPollTokens),
        name: daoForm.name,
      })
      .accounts({
        creator: wallet.publicKey,
        auth: PublicKey.findProgramAddressSync([Buffer.from("auth"), program.programId.toBuffer()], program.programId)[0],
        dao: PublicKey.findProgramAddressSync([Buffer.from("dao"), wallet.publicKey.toBuffer(), mint.toBuffer()], program.programId)[0],
        signerAta: PublicKey.findProgramAddressSync([wallet.publicKey.toBuffer(), new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA").toBuffer(), mint.toBuffer()], new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"))[0],
        mint: mint,
        vault: PublicKey.findProgramAddressSync([Buffer.from("vault"), wallet.publicKey.toBuffer(), mint.toBuffer()], program.programId)[0],
        analytics: PublicKey.findProgramAddressSync([Buffer.from("analytics")], program.programId)[0],
        tokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
        associatedTokenProgram: new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"),
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();
      console.log('Transaction successful:', tx);
      setSuccess("DAO created successfully");
      router.push(`/pao/${tx}`);
    } catch (error) {
      console.error('Error creating Flat DAO:', error);
      setError(`Error creating Flat DAO: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!wallet.connected) {
    return <div>Please connect your wallet to create a Flat DAO.</div>;
  }

  if (loading) {
    return <div>Initializing client...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black bg-opacity-50 p-6 rounded-lg space-y-6"
    >
      <motion.div 
        className="bg-white rounded-lg p-6 mb-8 text-gray-800"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mb-4"><FiCheck className="inline-block mr-2" /> Initialize Analytics</h2>
        <button
          onClick={initializeAnalytics}
          disabled={loading}
          className="w-full bg-teal-500 hover:bg-teal-400 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
        >
          {loading ? 'Initializing...' : <><FiCheck className="mr-2" /> Initialize Analytics</>}
        </button>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-6 text-gray-800"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold mb-4"><FiCheck className="inline-block mr-2" /> Create DAO</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 mb-2">DAO Name</label>
            <input type="text" id="name" name="name" required value={daoForm.name} onChange={handleInputChange} className="w-full bg-gray-100 text-gray-800 border border-gray-300 rounded py-2 px-3" />
          </div>
          <div>
            <label htmlFor="time" className="block text-gray-700 mb-2">Voting Period</label>
            <select id="time" name="time" required value={daoForm.time} onChange={handleInputChange} className="w-full bg-gray-100 text-gray-800 border border-gray-300 rounded py-2 px-3">
              <option value="FiveSeconds">5 Seconds (for testing)</option>
              <option value="TwentyFourHours">24 Hours</option>
              <option value="FourtyEightHours">48 Hours</option>
              <option value="OneWeek">One Week</option>
            </select>
          </div>
          <div>
            <label htmlFor="threshold" className="block text-gray-700 mb-2">Approval Threshold (%)</label>
            <input type="number" id="threshold" name="threshold" min="50" max="100" required value={daoForm.threshold} onChange={handleInputChange} className="w-full bg-gray-100 text-gray-800 border border-gray-300 rounded py-2 px-3" />
          </div>
          <div>
            <label htmlFor="minPollTokens" className="block text-gray-700 mb-2">Minimum Tokens to Start Poll</label>
            <input type="number" id="minPollTokens" name="minPollTokens" required value={daoForm.minPollTokens} onChange={handleInputChange} className="w-full bg-gray-100 text-gray-800 border border-gray-300 rounded py-2 px-3" />
          </div>
          <div>
            <label htmlFor="mintAddress" className="block text-gray-700 mb-2">Governance Token Mint Address</label>
            <input type="text" id="mintAddress" name="mintAddress" required value={daoForm.mintAddress} onChange={handleInputChange} className="w-full bg-gray-100 text-gray-800 border border-gray-300 rounded py-2 px-3" placeholder="Enter SPL token mint address" />
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 0.98 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-teal-500 hover:bg-teal-400 text-white font-bold py-2 px-4 rounded mt-6"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Flat DAO'}
        </motion.button>
      </motion.form>

      {error && (
        <motion.div 
          className="mt-4 p-4 bg-red-100 text-red-700 rounded flex items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FiX className="mr-2" /> {error}
        </motion.div>
      )}

      {success && (
        <motion.div 
          className="mt-4 p-4 bg-green-100 text-green-700 rounded flex items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FiCheck className="mr-2" /> {success}
        </motion.div>
      )}
    </motion.div>
  );
};

export default FlatDaoCreationForm;