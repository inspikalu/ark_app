'use client'

import React, { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorProvider, Program, web3, Idl } from '@coral-xyz/anchor';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { FiCheck, FiX, FiList, FiUser, FiHash, FiMessageSquare, FiPackage } from 'react-icons/fi';

// Import your IDL
import idl from '../../idl/standard.json';

const programID = new PublicKey("7aQvq1fEiDXqK36H7mW8MSTGdnHn6XAHDd9pauZwZXGQ");

type StandardIDL = Idl & {
    accounts: {
      verificationResult: any; // Replace 'any' with the actual type if known
    };
  };
  
  const typedIdl = idl as StandardIDL;

interface VerifyArgs {
  claimInfo: {
    provider: string;
    parameters: string;
    contextAddress: string;
    contextMessage: string;
  };
  signedClaim: {
    claimData: {
      identifier: number[];
      owner: string;
      timestamp: number;
      epochIndex: number;
    };
    signatures: number[][];
  };
}

interface VerificationResult {
  publicKey: PublicKey;
  account: {
    provider: string;
    verifiedAt: number;
    isActive: boolean;
  };
}

const ReclaimVerificationUI: React.FC = () => {
  const wallet = useAnchorWallet();
  const [provider, setProvider] = useState<AnchorProvider | null>(null);
  const [program, setProgram] = useState<Program<StandardIDL> | null>(null);
  const [verifications, setVerifications] = useState<VerificationResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [verifyArgs, setVerifyArgs] = useState<VerifyArgs>({
    claimInfo: {
      provider: '',
      parameters: '',
      contextAddress: wallet ? wallet.publicKey.toBase58() : '',
      contextMessage: '',
    },
    signedClaim: {
        claimData: {
          identifier: Array.from({ length: 32 }, () => Math.floor(Math.random() * 256)), // Changed to random bytes
          owner: wallet ? wallet.publicKey.toBase58() : '', // Set owner to wallet address
          timestamp: Math.floor(Date.now() / 1000), // Set to current timestamp
          epochIndex: 1, // Set to a valid epoch index
        },
        signatures: [Array.from({ length: 65 }, () => Math.floor(Math.random() * 256))], // Added a mock signature
      },
  });

  useEffect(() => {
    if (wallet) {
      const connection = new Connection("https://api.devnet.solana.com");
      const provider = new AnchorProvider(connection, wallet, {});
      setProvider(provider);
      setProgram(new Program<StandardIDL>(typedIdl, provider));
    }
  }, [wallet]);

  useEffect(() => {
    if (program) {
      void fetchVerifications();
    }
  }, [program]);

  const fetchVerifications = async (): Promise<void> => {
    setIsLoading(true);
    try {
        const allVerifications = await (program as any).account.verificationResult.all();
      setVerifications(allVerifications as VerificationResult[]);
    } catch (err) {
      setError(`Failed to fetch verifications: ${err instanceof Error ? err.message : String(err)}`);
    }
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, section: 'claimInfo', field: keyof VerifyArgs['claimInfo']): void => {
    const { value } = e.target;
    setVerifyArgs(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: field === 'contextAddress' ? new web3.PublicKey(value).toBase58() : value,
      },
    }));
  };

  const handleVerify = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const epochConfig = web3.Keypair.generate().publicKey;
      const epoch = web3.Keypair.generate().publicKey;
      
      console.log("Signer:", wallet!.publicKey.toBase58());
      console.log("Epoch Config:", epochConfig.toBase58());
      console.log("Epoch:", epoch.toBase58());
      console.log("Context Address:", verifyArgs.claimInfo.contextAddress);
  
      const contextAddressKey = new web3.PublicKey(verifyArgs.claimInfo.contextAddress);
  
      const tx = await program!.methods.reclaimVerify({
        claimInfo: {
          ...verifyArgs.claimInfo,
          contextAddress: contextAddressKey,
        },
        signedClaim: verifyArgs.signedClaim,
      })
        .accounts({
          signer: wallet!.publicKey,
          epochConfig: epochConfig,
          epoch: epoch,
          reclaimProgram: new web3.PublicKey("9XQD57wwrLaigMLcrcpTJphwmwdbqNKhJWczBH9derGT"),
          systemProgram: web3.SystemProgram.programId,
          verificationResult: web3.PublicKey.findProgramAddressSync(
            [Buffer.from("verification"), wallet!.publicKey.toBuffer()],
            program!.programId
          )[0],
        })
        .rpc();
      console.log("Verification successful. Transaction signature", tx);
      void fetchVerifications();
    } catch (err) {
      setError(`Verification failed: ${err instanceof Error ? err.message : String(err)}`);
    }
    setIsLoading(false);
  };

  const handleRevoke = async (verificationPubkey: PublicKey): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const tx = await program!.methods.revokeReclaimVerification()
        .accounts({
          signer: wallet!.publicKey,
          verificationResult: verificationPubkey,
        })
        .rpc();
      console.log("Revocation successful. Transaction signature", tx);
      void fetchVerifications();
    } catch (err) {
      setError(`Revocation failed: ${err instanceof Error ? err.message : String(err)}`);
    }
    setIsLoading(false);
  };

//   const ReclaimVerificationUI: React.FC = () => {
//     const wallet = useAnchorWallet();
//     const [provider, setProvider] = useState<AnchorProvider | null>(null);
//     const [program, setProgram] = useState<Program<StandardIDL> | null>(null);
//     const [verifications, setVerifications] = useState<VerificationResult[]>([]);
//     const [isLoading, setIsLoading] = useState<boolean>(false);
//     const [error, setError] = useState<string | null>(null);
  
//     const [verifyArgs, setVerifyArgs] = useState<VerifyArgs>({
//       claimInfo: {
//         provider: '',
//         parameters: '',
//         contextAddress: wallet ? wallet.publicKey.toBase58() : '',
//         contextMessage: '',
//       },
//       signedClaim: {
//           claimData: {
//             identifier: Array.from({ length: 32 }, () => Math.floor(Math.random() * 256)), // Changed to random bytes
//             owner: wallet ? wallet.publicKey.toBase58() : '', // Set owner to wallet address
//             timestamp: Math.floor(Date.now() / 1000), // Set to current timestamp
//             epochIndex: 1, // Set to a valid epoch index
//           },
//           signatures: [Array.from({ length: 65 }, () => Math.floor(Math.random() * 256))], // Added a mock signature
//         },
//     });
  
//     useEffect(() => {
//       if (wallet) {
//         const connection = new Connection("https://api.devnet.solana.com");
//         const provider = new AnchorProvider(connection, wallet, {});
//         setProvider(provider);
//         setProgram(new Program<StandardIDL>(typedIdl, provider));
//       }
//     }, [wallet]);
  
//     useEffect(() => {
//       if (program) {
//         void fetchVerifications();
//       }
//     }, [program]);
  
//     const fetchVerifications = async (): Promise<void> => {
//       setIsLoading(true);
//       try {
//           const allVerifications = await (program as any).account.verificationResult.all();
//         setVerifications(allVerifications as VerificationResult[]);
//       } catch (err) {
//         setError(`Failed to fetch verifications: ${err instanceof Error ? err.message : String(err)}`);
//       }
//       setIsLoading(false);
//     };
  
//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, section: 'claimInfo', field: keyof VerifyArgs['claimInfo']): void => {
//       const { value } = e.target;
//       setVerifyArgs(prev => ({
//         ...prev,
//         [section]: {
//           ...prev[section],
//           [field]: field === 'contextAddress' ? new web3.PublicKey(value).toBase58() : value,
//         },
//       }));
//     };
  
//     const handleVerify = async (): Promise<void> => {
//       setIsLoading(true);
//       setError(null);
//       try {
//           if (!wallet || !program || !provider) {
//               throw new Error("Wallet or program not initialized");
//             }
//         const epochConfig = web3.Keypair.generate();
//         const epoch = web3.Keypair.generate();
        
//         console.log("Signer:", wallet!.publicKey.toBase58());
//         console.log("Epoch Config:", epochConfig.publicKey.toBase58());
//         console.log("Epoch:", epoch.publicKey.toBase58());
//         console.log("Context Address:", verifyArgs.claimInfo.contextAddress);
    
//         const contextAddressKey = new web3.PublicKey(verifyArgs.claimInfo.contextAddress);
  
//             // Create epochConfig account
//       const createEpochConfigIx = await program!.methods.createEpochConfig()
//       .accounts({
//         epochConfig: epochConfig.publicKey,
//         authority: wallet!.publicKey,
//         systemProgram: web3.SystemProgram.programId,
//       })
//       .instruction();
  
//     // Create epoch account
//     const createEpochIx = await program!.methods.createEpoch()
//       .accounts({
//         epoch: epoch.publicKey,
//         epochConfig: epochConfig.publicKey,
//         authority: wallet!.publicKey,
//         systemProgram: web3.SystemProgram.programId,
//       })
//       .instruction();
    
//       // Verify instruction
//       const verifyIx = await program!.methods.reclaimVerify({
//           claimInfo: {
//             ...verifyArgs.claimInfo,
//             contextAddress: contextAddressKey,
//           },
//           signedClaim: verifyArgs.signedClaim,
//         })
//           .accounts({
//             signer: wallet!.publicKey,
//             epochConfig: epochConfig.publicKey,
//             epoch: epoch.publicKey,
//             reclaimProgram: new web3.PublicKey("9XQD57wwrLaigMLcrcpTJphwmwdbqNKhJWczBH9derGT"),
//             systemProgram: web3.SystemProgram.programId,
//             verificationResult: web3.PublicKey.findProgramAddressSync(
//               [Buffer.from("verification"), wallet!.publicKey.toBuffer()],
//               program!.programId
//             )[0],
//           })
//           .instruction();
    
//         // Create and send transaction
//         const tx = new web3.Transaction().add(createEpochConfigIx, createEpochIx, verifyIx);
//         tx.feePayer = wallet.publicKey;
//         const latestBlockhash = await provider.connection.getLatestBlockhash();
//         tx.recentBlockhash = latestBlockhash.blockhash;
    
//         const signedTx = await wallet.signTransaction(tx);
//         signedTx.partialSign(epochConfig, epoch);
    
//         const txSignature = await provider.connection.sendRawTransaction(signedTx.serialize());
    
//         console.log("Transaction sent. Signature:", txSignature);
  
//         const confirmOptions: ConfirmOptions = {
//           commitment: 'confirmed',
//           preflightCommitment: 'confirmed',
//           maxRetries: 5,
//         };
  
//         const confirmation = await provider.connection.confirmTransaction(
//           {
//             signature: txSignature,
//             blockhash: latestBlockhash.blockhash,
//             lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
//           },
//           confirmOptions.commitment
//         );
        
//         if (confirmation.value.err) {
//           throw new Error(`Transaction failed: ${confirmation.value.err.toString()}`);
//         }
    
//         console.log("Verification successful. Transaction confirmed.");
//         void fetchVerifications();
//       } catch (err) {
//         setError(`Verification failed: ${err instanceof Error ? err.message : String(err)}`);
//       }
//       setIsLoading(false);
//     };
  
//     const handleRevoke = async (verificationPubkey: PublicKey): Promise<void> => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const tx = await program!.methods.revokeReclaimVerification()
//           .accounts({
//             signer: wallet!.publicKey,
//             verificationResult: verificationPubkey,
//           })
//           .rpc();
//         console.log("Revocation successful. Transaction signature", tx);
//         void fetchVerifications();
//       } catch (err) {
//         setError(`Revocation failed: ${err instanceof Error ? err.message : String(err)}`);
//       }
//       setIsLoading(false);
//     };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-800 to-teal-300 p-8 text-white">
      <motion.h1 
        className="text-4xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FiPackage className="inline-block mr-2" /> Reclaim Verification
      </motion.h1>

      <motion.div 
        className="bg-white rounded-lg p-6 mb-8 text-gray-800"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mb-4"><FiCheck className="inline-block mr-2" /> Verify Claim</h2>
        <div className="space-y-4">
          <div className="relative">
            <FiUser className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Provider"
              value={verifyArgs.claimInfo.provider}
              onChange={(e) => handleInputChange(e, 'claimInfo', 'provider')}
              className="w-full p-2 pl-10 border rounded"
            />
          </div>
          <div className="relative">
            <FiHash className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Parameters"
              value={verifyArgs.claimInfo.parameters}
              onChange={(e) => handleInputChange(e, 'claimInfo', 'parameters')}
              className="w-full p-2 pl-10 border rounded"
            />
          </div>
          <div className="relative">
            <FiMessageSquare className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Context Address"
              value={verifyArgs.claimInfo.contextAddress}
              onChange={(e) => handleInputChange(e, 'claimInfo', 'contextAddress')}
              className="w-full p-2 pl-10 border rounded"
            />
          </div>
          <div className="relative">
            <FiMessageSquare className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Context Message"
              value={verifyArgs.claimInfo.contextMessage}
              onChange={(e) => handleInputChange(e, 'claimInfo', 'contextMessage')}
              className="w-full p-2 pl-10 border rounded"
            />
          </div>
          <button
            onClick={handleVerify}
            disabled={isLoading}
            className="w-full bg-teal-400 text-white p-2 rounded hover:bg-teal-600 transition duration-200 flex items-center justify-center"
          >
            {isLoading ? 'Verifying...' : <><FiCheck className="mr-2" /> Verify</>}
          </button>
        </div>
      </motion.div>

      <motion.div 
        className="bg-white rounded-lg p-6 text-gray-800"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold mb-4"><FiList className="inline-block mr-2" /> Verifications</h2>
        {isLoading ? (
          <p>Loading verifications...</p>
        ) : (
          <ul className="space-y-4">
            {verifications.map((v, index) => (
              <motion.li 
                key={v.publicKey.toString()} 
                className="border p-4 rounded flex justify-between items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div>
                  <p><strong>Provider:</strong> {v.account.provider}</p>
                  <p><strong>Verified At:</strong> {new Date(v.account.verifiedAt * 1000).toLocaleString()}</p>
                  <p><strong>Status:</strong> {v.account.isActive ? 'Active' : 'Revoked'}</p>
                </div>
                {v.account.isActive && (
                  <button
                    onClick={() => void handleRevoke(v.publicKey)}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200 flex items-center"
                  >
                    <FiX className="mr-2" /> Revoke
                  </button>
                )}
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>

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
    </div>
  );
};

export default ReclaimVerificationUI;