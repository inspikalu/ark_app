"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
// import { FiUpload } from "react-icons/fi";
import DidYouKnowModal from "./DidYouKnowModal";
import { GovernanceType } from '../create/DashboardSearch';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { BN } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { AbsoluteMonarchyClient, InitializeAbsoluteMonarchyArgs, useAbsoluteMonarchyClient, TokenConfig } from '../../client/absolute/initializeAbsoluteMonarchy';
import { CustomWallet } from './CustomWallet';  

const PROGRAM_ID = new PublicKey('ADp9DgS9ZpsVDCXb4ysDjJoB1d8cL3CUmm4ErwVtqWzu');

interface PaoCreationFormProps {
  governanceType: GovernanceType;
}

const PaoCreationForm: React.FC<PaoCreationFormProps> = ({ governanceType }) => {
  const [loading, setLoading] = useState(true);
  const [, setShowModal] = useState(true);
  // State for different types (NFT, SPL, Decree)
  const [nftTokenType, setNftTokenType] = useState('new');
  const [splTokenType, setSplTokenType] = useState('new');
  // const [decreeType, setDecreeType] = useState<DecreeType>({ Law: {} });
  const [client, setClient] = useState<AbsoluteMonarchyClient | null>(null);
  const router = useRouter();
  const params = useParams();
  // Wallet and connection
  const { connection } = useConnection();
  const wallet = useWallet();

  // Check if wallet is connected before creating the client
  // if (!wallet.publicKey || !wallet.signTransaction) {
  //   console.log("Please connect your wallet.");
  //   return null; // Alternatively, you can show a message to connect the wallet
  // }
  // Pass wallet adapter into CustomWallet instead of a Keypair
  // const client = useAbsoluteMonarchyClient(connection, new CustomWallet(wallet), PROGRAM_ID);

  // useEffect(() => {
  //   if (wallet && wallet.publicKey) {
  //     // Wallet is connected; proceed with creating the client
  //     const newClient = useAbsoluteMonarchyClient(connection, new CustomWallet(wallet), PROGRAM_ID);
  //     setClient(newClient);
  //   } else {
  //     // Reset client if wallet is not connected
  //     setClient(null);
  //   }
  // }, [wallet, connection]); // Dependencies

    // Directly use the hook to get the client
    const absoluteMonarchyClient = useAbsoluteMonarchyClient(connection, new CustomWallet(wallet), PROGRAM_ID);

    // Effect to check if the client is available
    // useEffect(() => {
    //   if (wallet && wallet.publicKey) {
    //     // Wallet is connected; set the client
    //     setClient(absoluteMonarchyClient);
    //   } else {
    //     // Reset client if wallet is not connected
    //     setClient(null);
    //   }
    // }, [wallet, absoluteMonarchyClient]); // Use the derived client as a dependency
    const customWallet = new CustomWallet(wallet);
    const newClient = useAbsoluteMonarchyClient(connection, customWallet, PROGRAM_ID);
    useEffect(() => {
      if (wallet.connected && wallet.publicKey) {
        setClient(newClient);
        setLoading(false);
      } else {
        setClient(null);
      }
    }, [wallet.connected, wallet.publicKey, connection]);
  
    // ... rest of the component code ...
  
    if (!wallet.connected) {
      return <div>Please connect your wallet to create a PAO.</div>;
    }
  
    if (!client) {
      return <div>Initializing client...</div>;
    }

  // const provider = useMemo(() => {
  //   if (wallet.publicKey) {
  //     return new CustomAnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
  //   }
  //   return null;
  // }, [connection, wallet]);
  
  // // Use the custom provider to create the client
  // const client = useMemo(() => {
  //   if (provider) {
  //     return new Program(idl as AbsoluteMonarchy, provider);
  //   }
  //   return null;
  // }, [provider]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setLoading(false); 
  //     setShowModal(false);
  //   }, 7000);

  //   return () => clearTimeout(timer);
  // }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!client || !wallet.publicKey) {
      alert("Wallet not connected or client not initialized");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData(event.currentTarget);
      const primaryTokenType = formData.get('primaryKingdomToken') as 'NFT' | 'SPL';
      const nftConfig: TokenConfig | undefined = nftTokenType === 'new'
        ? { token_type: { new: {} }, custom_mint: PublicKey.default }
        : formData.get('nftMintAddress')
          ? { token_type: { existing: {} }, custom_mint: new PublicKey(formData.get('nftMintAddress') as string) }
          : undefined;

      const splConfig: TokenConfig | undefined = splTokenType === 'new'
        ? { token_type: { new: {} }, custom_mint: PublicKey.default }
        : formData.get('splMintAddress')
          ? { token_type: { existing: {} }, custom_mint: new PublicKey(formData.get('splMintAddress') as string) }
          : undefined;

      const args: InitializeAbsoluteMonarchyArgs = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        monarchName: formData.get('monarchName') as string,
        divineMandate: formData.get('divineMandate') as string,
        collectionPrice: new BN(formData.get('collectionPrice') as string),
        nftSupply: new BN(formData.get('nftSupply') as string),
        splSupply: new BN(formData.get('splSupply') as string),
        royalDecreeThreshold: new BN(formData.get('royalDecreeThreshold') as string),
        minLoyaltyAmount: new BN(formData.get('minLoyaltyAmount') as string),
        membershipTokensThreshold: new BN(formData.get('membershipTokensThreshold') as string),
        knighthoodPrice: new BN(formData.get('knighthoodPrice') as string),
        nftConfig: nftConfig,
        splConfig: splConfig,
        primaryKingdomToken: primaryTokenType === 'NFT' ? { NFT: {} } : { SPL: {} },
      };

      let tx: string;
      switch (governanceType) {
        case 'absolute-monarchy':
          tx = await client.initializeAbsoluteMonarchy(args);
          break;
        // Add cases for other governance types
        default:
          throw new Error(`Unsupported governance type: ${governanceType}`);
      }

      console.log('Transaction successful:', tx);
      router.push(`/pao/${tx}`);
    } catch (error) {
      console.error('Error creating PAO:', error);
      alert(`Error creating PAO: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-start pt-5 justify-center min-h-screen bg-gradient-to-r from-teal-700 to-teal-900">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-white text-2xl"
        >
          <DidYouKnowModal isLoading={loading} />
        </motion.div>
      </div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-black bg-opacity-50 p-6 rounded-lg space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-white mb-2">Name</label>
          <input type="text" id="name" name="name" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
        </div>
        <div>
          <label htmlFor="description" className="block text-white mb-2">Description</label>
          <textarea id="description" name="description" rows={4} required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3"></textarea>
        </div>
        <div>
          <label htmlFor="monarchName" className="block text-white mb-2">Monarch Name</label>
          <input type="text" id="monarchName" name="monarchName" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
        </div>
        <div>
          <label htmlFor="divineMandate" className="block text-white mb-2">Divine Mandate</label>
          <input type="text" id="divineMandate" name="divineMandate" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
        </div>
        <div>
          <label htmlFor="collectionPrice" className="block text-white mb-2">Collection Price</label>
          <input type="number" id="collectionPrice" name="collectionPrice" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
        </div>
        <div>
          <label htmlFor="nftSupply" className="block text-white mb-2">NFT Supply</label>
          <input type="number" id="nftSupply" name="nftSupply" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
        </div>
        <div>
          <label htmlFor="splSupply" className="block text-white mb-2">SPL Supply</label>
          <input type="number" id="splSupply" name="splSupply" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
        </div>
        <div>
          <label htmlFor="royalDecreeThreshold" className="block text-white mb-2">Royal Decree Threshold</label>
          <input type="number" id="royalDecreeThreshold" name="royalDecreeThreshold" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
        </div>
        <div>
          <label htmlFor="minLoyaltyAmount" className="block text-white mb-2">Min Loyalty Amount</label>
          <input type="number" id="minLoyaltyAmount" name="minLoyaltyAmount" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
        </div>
        <div>
          <label htmlFor="membershipTokensThreshold" className="block text-white mb-2">Membership Tokens Threshold</label>
          <input type="number" id="membershipTokensThreshold" name="membershipTokensThreshold" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
        </div>
        <div>
          <label htmlFor="knighthoodPrice" className="block text-white mb-2">Knighthood Price</label>
          <input type="number" id="knighthoodPrice" name="knighthoodPrice" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
        </div>
        {/* NFT Configuration */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">NFT Configuration</h3>
          <div>
            <label htmlFor="nftTokenType" className="block text-white mb-2">NFT Token Type</label>
            <select 
              id="nftTokenType" 
              name="nftTokenType" 
              className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3"
              value={nftTokenType}
              onChange={(e) => setNftTokenType(e.target.value)}
            >
              <option value="new">Create New NFT</option>
              <option value="existing">Use Existing NFT</option>
            </select>
          </div>
          {nftTokenType === 'existing' && (
            <div>
              <label htmlFor="nftMintAddress" className="block text-white mb-2">NFT Mint Address</label>
              <input 
                type="text" 
                id="nftMintAddress" 
                name="nftMintAddress" 
                className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" 
                placeholder="Enter NFT mint address"
              />
            </div>
          )}
        </div>

        {/* SPL Configuration */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">SPL Token Configuration</h3>
          <div>
            <label htmlFor="splTokenType" className="block text-white mb-2">SPL Token Type</label>
            <select 
              id="splTokenType" 
              name="splTokenType" 
              className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3"
              value={splTokenType}
              onChange={(e) => setSplTokenType(e.target.value)}
            >
              <option value="new">Create New SPL Token</option>
              <option value="existing">Use Existing SPL Token</option>
            </select>
          </div>
          {splTokenType === 'existing' && (
            <div>
              <label htmlFor="splMintAddress" className="block text-white mb-2">SPL Token Mint Address</label>
              <input 
                type="text" 
                id="splMintAddress" 
                name="splMintAddress" 
                className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" 
                placeholder="Enter SPL token mint address"
              />
            </div>
          )}
        </div>
        {/* <div>
          <label htmlFor="decreeType" className="block text-white mb-2">Decree Type</label>
          <select 
            id="decreeType" 
            name="decreeType" 
            className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3"
            value={Object.keys(decreeType)[0]}
            onChange={(e) => {
              const value = e.target.value as keyof DecreeType;
              setDecreeType({ [value]: {} } as DecreeType);
            }}
          >
            <option value="law">Law</option>
            <option value="economicPolicy">Economic Policy</option>
            <option value="militaryOrder">Military Order</option>
            <option value="royalProclamation">Royal Proclamation</option>
          </select>
        </div> */}
        <div>
          <label htmlFor="primaryKingdomToken" className="block text-white mb-2">Primary Kingdom Token</label>
          <select id="primaryKingdomToken" name="primaryKingdomToken" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3">
            <option value="nft">NFT</option>
            <option value="spl">SPL</option>
          </select>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 0.98 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="w-full bg-teal-500 hover:bg-teal-400 text-white font-bold py-2 px-4 rounded"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create PAO'}
      </motion.button>
    </motion.form>
  );
};

export default PaoCreationForm;
