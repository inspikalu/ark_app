'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { AnchorProvider, Program, web3, BN } from '@coral-xyz/anchor';
import { FiCheck, FiX } from 'react-icons/fi';

// Import your IDL
import idl from '../../idl/military_junta.json';

const PROGRAM_ID = new PublicKey('2fPj7RDkm4FJouSo6DE6vHbE5rjTvdZPnnxJUgFvYVm2');

interface MilJuntaCreationFormProps {
  governanceType: 'military-junta';
}

const MilJuntaCreationForm: React.FC<MilJuntaCreationFormProps> = ({ governanceType }) => {
  const [loading, setLoading] = useState(true);
  const [program, setProgram] = useState<Program | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [nftTokenType, setNftTokenType] = useState('new');
  const [splTokenType, setSplTokenType] = useState('new');
  const router = useRouter();
  const { connection } = useConnection();
  const wallet = useWallet();

  const [juntaForm, setJuntaForm] = useState({
    name: '',
    supply: '',
    symbol: '',
    support_threshold: '',
    collection_price: '',
    nft_symbol: '',
    spl_symbol: '',
    nft_supply: '',
    spl_supply: '',
    nftMintAddress: '',
    splMintAddress: '',
    primary_junta_token: 'NFT',
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
    setJuntaForm(prev => ({ ...prev, [name]: value }));
  };

  const initializeAndRegisterGovernment = async () => {
    if (!program || !wallet.publicKey) return;
    setLoading(true);
    setError(null);
    try {
      const [arkAnalyticsPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("ark_analytics")],
        program.programId
      );
      
      const [stateInfoPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("state_info")],
        program.programId
      );

      const tx = await program.methods.initializeAndRegisterGovernment(juntaForm.name)
        .accounts({
          creator: wallet.publicKey,
          arkAnalytics: arkAnalyticsPda,
          stateInfo: stateInfoPda,
          governmentProgram: program.programId,
          arkProgram: new PublicKey("48qaGS4sA7bqiXYE6SyzaFiAb7QNit1A7vdib7LXhW2V"),
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();
      console.log("Government initialized and registered. Transaction signature", tx);
      setSuccess("Government initialized and registered successfully");
    } catch (err) {
      console.error("Error in initializeAndRegisterGovernment:", err);
      setError(`Failed to initialize and register government: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!program || !wallet.publicKey) return;
    setLoading(true);
    setError(null);

    try {
      const nftConfig = nftTokenType === 'new'
        ? { tokenType: { new: {} }, tokenMint: PublicKey.default }
        : { tokenType: { existing: {} }, tokenMint: new PublicKey(juntaForm.nftMintAddress) };

      const splConfig = splTokenType === 'new'
        ? { tokenType: { new: {} }, tokenMint: PublicKey.default }
        : { tokenType: { existing: {} }, tokenMint: new PublicKey(juntaForm.splMintAddress) };

      const [juntaPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("junta"), Buffer.from(juntaForm.name)],
        program.programId
      );

      const tx = await program.methods.initializeMilJunta({
        name: juntaForm.name,
        supply: Number(juntaForm.supply),
        symbol: juntaForm.symbol,
        supportThreshold: Number(juntaForm.support_threshold),
        collectionPrice: new BN(juntaForm.collection_price),
        nftConfig,
        splConfig,
        nftSymbol: juntaForm.nft_symbol,
        splSymbol: juntaForm.spl_symbol,
        nftSupply: new BN(juntaForm.nft_supply),
        splSupply: new BN(juntaForm.spl_supply),
        primaryJuntaToken: { [juntaForm.primary_junta_token]: {} },
      })
      .accounts({
        junta: juntaPda,
        leader: wallet.publicKey,
        nftMint: nftConfig.tokenMint,
        splMint: splConfig.tokenMint,
        tokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
        associatedTokenProgram: new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"),
        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc();
      console.log('Transaction successful:', tx);
      setSuccess("Military Junta created successfully");
      router.push(`/pao/${tx}`);
    } catch (error) {
      console.error('Error creating Military Junta:', error);
      setError(`Error creating Military Junta: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!wallet.connected) {
    return <div>Please connect your wallet to create a Military Junta PAO.</div>;
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
        <h2 className="text-2xl font-semibold mb-4"><FiCheck className="inline-block mr-2" /> Initialize and Register Government</h2>
        <button
          onClick={initializeAndRegisterGovernment}
          disabled={loading}
          className="w-full bg-teal-500 hover:bg-teal-400 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
        >
          {loading ? 'Initializing...' : <><FiCheck className="mr-2" /> Initialize and Register Government</>}
        </button>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-6 text-gray-800"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold mb-4"><FiCheck className="inline-block mr-2" /> Create Military Junta</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
            <input type="text" id="name" name="name" required value={juntaForm.name} onChange={handleInputChange} className="w-full bg-gray-100 text-gray-800 border border-gray-300 rounded py-2 px-3" />
          </div>
          <div>
            <label htmlFor="supply" className="block text-gray-700 mb-2">Supply</label>
            <input type="number" id="supply" name="supply" required value={juntaForm.supply} onChange={handleInputChange} className="w-full bg-gray-100 text-gray-800 border border-gray-300 rounded py-2 px-3" />
          </div>
          <div>
            <label htmlFor="symbol" className="block text-gray-700 mb-2">Symbol</label>
            <input type="text" id="symbol" name="symbol" required value={juntaForm.symbol} onChange={handleInputChange} className="w-full bg-gray-100 text-gray-800 border border-gray-300 rounded py-2 px-3" />
          </div>
          <div>
            <label htmlFor="support_threshold" className="block text-gray-700 mb-2">Support Threshold</label>
            <input type="number" id="support_threshold" name="support_threshold" required value={juntaForm.support_threshold} onChange={handleInputChange} className="w-full bg-gray-100 text-gray-800 border border-gray-300 rounded py-2 px-3" />
          </div>
          <div>
            <label htmlFor="collection_price" className="block text-gray-700 mb-2">Collection Price</label>
            <input type="number" id="collection_price" name="collection_price" required value={juntaForm.collection_price} onChange={handleInputChange} className="w-full bg-gray-100 text-gray-800 border border-gray-300 rounded py-2 px-3" />
          </div>
          <div>
            <label htmlFor="nft_symbol" className="block text-gray-700 mb-2">NFT Symbol</label>
            <input type="text" id="nft_symbol" name="nft_symbol" required value={juntaForm.nft_symbol} onChange={handleInputChange} className="w-full bg-gray-100 text-gray-800 border border-gray-300 rounded py-2 px-3" />
          </div>
          <div>
            <label htmlFor="spl_symbol" className="block text-gray-700 mb-2">SPL Symbol</label>
            <input type="text" id="spl_symbol" name="spl_symbol" required value={juntaForm.spl_symbol} onChange={handleInputChange} className="w-full bg-gray-100 text-gray-800 border border-gray-300 rounded py-2 px-3" />
          </div>
          <div>
            <label htmlFor="nft_supply" className="block text-gray-700 mb-2">NFT Supply</label>
            <input type="number" id="nft_supply" name="nft_supply" required value={juntaForm.nft_supply} onChange={handleInputChange} className="w-full bg-gray-100 text-gray-800 border border-gray-300 rounded py-2 px-3" />
          </div>
          <div>
            <label htmlFor="spl_supply" className="block text-gray-700 mb-2">SPL Supply</label>
            <input type="number" id="spl_supply" name="spl_supply" required value={juntaForm.spl_supply} onChange={handleInputChange} className="w-full bg-gray-100 text-gray-800 border border-gray-300 rounded py-2 px-3" />
          </div>
          <div>
            <label htmlFor="nftTokenType" className="block text-gray-700 mb-2">NFT Token Type</label>
            <select 
              id="nftTokenType" 
              name="nftTokenType" 
              className="w-full bg-gray-100 text-gray-800 border border-gray-300 rounded py-2 px-3"
              value={nftTokenType}
              onChange={(e) => setNftTokenType(e.target.value)}
            >
              <option value="new">Create New NFT</option>
              <option value="existing">Use Existing NFT</option>
            </select>
          </div>
          {nftTokenType === 'existing' && (
            <div>
              <label htmlFor="nftMintAddress" className="block text-gray-700 mb-2">NFT Mint Address</label>
              <input 
                type="text" 
                id="nftMintAddress" 
                name="nftMintAddress" 
                value={juntaForm.nftMintAddress}
                onChange={handleInputChange}
                className="w-full bg-gray-100 text-gray-800 border border-gray-300 rounded py-2 px-3" 
                placeholder="Enter NFT mint address"
              />
            </div>
          )}
          <div>
            <label htmlFor="splTokenType" className="block text-gray-700 mb-2">SPL Token Type</label>
            <select 
              id="splTokenType" 
              name="splTokenType" 
              className="w-full bg-gray-100 text-gray-800 border border-gray-300 rounded py-2 px-3"
              value={splTokenType}
              onChange={(e) => setSplTokenType(e.target.value)}
            >
              <option value="new">Create New SPL Token</option>
              <option value="existing">Use Existing SPL Token</option>
            </select>
          </div>
          {splTokenType === 'existing' && (
            <div>
              <label htmlFor="splMintAddress" className="block text-gray-700 mb-2">SPL Token Mint Address</label>
              <input 
                type="text" 
                id="splMintAddress" 
                name="splMintAddress" 
                value={juntaForm.splMintAddress}
                onChange={handleInputChange}
                className="w-full bg-gray-100 text-gray-800 border border-gray-300 rounded py-2 px-3" 
                placeholder="Enter SPL token mint address"
              />
            </div>
          )}
          <div>
            <label htmlFor="primary_junta_token" className="block text-gray-700 mb-2">Primary Junta Token</label>
            <select 
              id="primary_junta_token" 
              name="primary_junta_token" 
              required 
              value={juntaForm.primary_junta_token}
              onChange={handleInputChange}
              className="w-full bg-gray-100 text-gray-800 border border-gray-300 rounded py-2 px-3"
            >
              <option value="NFT">NFT</option>
              <option value="SPL">SPL</option>
            </select>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 0.98 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-teal-500 hover:bg-teal-400 text-white font-bold py-2 px-4 rounded mt-6"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Military Junta'}
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

export default MilJuntaCreationForm;