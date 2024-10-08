// 'use client'

// import React, { useState, useEffect } from 'react';
// import { Connection, PublicKey } from '@solana/web3.js';
// import { AnchorProvider, Program, web3, Idl } from '@coral-xyz/anchor';
// import { useAnchorWallet } from '@solana/wallet-adapter-react';
// import { motion } from 'framer-motion';
// import { FiCheck, FiX, FiList, FiPackage, FiAlertTriangle } from 'react-icons/fi';
// import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk';
// import QRCode from 'react-qr-code';

// // Import your IDL
// import idl from '../../idl/standard.json';

// const programID = new PublicKey("2eTVXGSKCaTaivadMawTEz3h14FLwhyGTY64UBYLyZ6p");

// // Reclaim configuration
// const RECLAIM_APP_ID = process.env.NEXT_PUBLIC_RECLAIM_APP_ID;
// const RECLAIM_APP_SECRET = process.env.NEXT_PUBLIC_RECLAIM_APP_SECRET;
// const RECLAIM_PROVIDER_ID = process.env.NEXT_PUBLIC_RECLAIM_PROVIDER_ID;

// type StandardIDL = Idl & {
//   accounts: {
//     verificationResult: any;
//     epoch: any;
//     epochConfig: any;
//   };
// };

// const typedIdl = idl as StandardIDL;

// interface VerificationResult {
//   publicKey: PublicKey;
//   account: {
//     signer: PublicKey;
//     provider: string;
//     verifiedAt: number;
//     isActive: boolean;
//   };
// }

// // const RECLAIM_PROGRAM_ID = new PublicKey("rEcLDWaVLaymz82eGr6cutosPxE6SEzw6q4pbtLuyqf");
// const RECLAIM_PROGRAM_ID = new PublicKey("DovMZfoRztSgQ1SKx1M3UKwZz5fZtNbshX3qYSZHacZ4")
// const REDIRECT_URL = 'https://app.useark.xyz/chat';

// const ReclaimVerificationUI: React.FC = () => {
//   const wallet = useAnchorWallet();
//   const [provider, setProvider] = useState<AnchorProvider | null>(null);
//   const [program, setProgram] = useState<Program<StandardIDL> | null>(null);
//   const [verifications, setVerifications] = useState<VerificationResult[]>([]);
//   const [statusUrl, setStatusUrl] = useState<string>('');
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
  
//   const [reclaimProofRequest, setReclaimProofRequest] = useState<ReclaimProofRequest | null>(null);
//   const [requestUrl, setRequestUrl] = useState<string>('');
//   const [proofs, setProofs] = useState<any>(null);
//   const [initializationError, setInitializationError] = useState<string | null>(null);

//   useEffect(() => {
//     if (wallet) {
//       const connection = new Connection("https://api.devnet.solana.com");
//       const provider = new AnchorProvider(connection, wallet, {});
//       setProvider(provider);
//       setProgram(new Program<StandardIDL>(typedIdl, provider));
//     }
//   }, [wallet]);

//   useEffect(() => {
//     if (program) {
//       void fetchVerifications();
//     }
//   }, [program]);

//   useEffect(() => {
//     async function initializeReclaim() {
//       try {
//         if (!RECLAIM_APP_ID || !RECLAIM_APP_SECRET || !RECLAIM_PROVIDER_ID) {
//           throw new Error("Reclaim App ID, Secret or Provider ID not configured");
//         }

//         const proofRequest = await ReclaimProofRequest.init(RECLAIM_APP_ID, RECLAIM_APP_SECRET, RECLAIM_PROVIDER_ID);
//         proofRequest.setRedirectUrl(REDIRECT_URL);
//         setReclaimProofRequest(proofRequest);
//         setInitializationError(null);
//       } catch (err) {
//         console.error("Failed to initialize ReclaimProofRequest:", err);
//         setInitializationError(`Failed to initialize Reclaim: ${err instanceof Error ? err.message : String(err)}`);
//       }
//     }

//     initializeReclaim();
//   }, []);

//   const fetchVerifications = async (): Promise<void> => {
//     setIsLoading(true);
//     try {
//       const allVerifications = await (program as any).account.verificationResult.all();
//       setVerifications(allVerifications as VerificationResult[]);
//     } catch (err) {
//       setError(`Failed to fetch verifications: ${err instanceof Error ? err.message : String(err)}`);
//     }
//     setIsLoading(false);
//   };

//   const handleCreateClaim = async (): Promise<void> => {
//     if (!reclaimProofRequest) {
//       setError('Reclaim Proof Request not initialized');
//       return;
//     }

//     try {
//       setIsLoading(true);
//       setError(null);

//       if (!RECLAIM_PROVIDER_ID) {
//         throw new Error("Reclaim Provider ID not configured");
//       }

//       await reclaimProofRequest.addContext(wallet!.publicKey.toString(), "Verification for Solana wallet");

//       const url = await reclaimProofRequest.getRequestUrl();
//       setRequestUrl(url);

//       const status = reclaimProofRequest.getStatusUrl()
//       setStatusUrl(status);

//       await reclaimProofRequest.startSession({
//         onSuccess: (proofs: any) => {
//           console.log('Verification success', proofs);
//           setProofs(proofs);
//           handleVerify(proofs[0]);
//         },
//         onError: (error: any) => {
//           console.error('Verification failed', error);
//           setError(`Verification failed: ${error}`);
//         }
//       });
//     } catch (err) {
//       setError(`Failed to create claim: ${err instanceof Error ? err.message : String(err)}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleVerify = async (proofData: any): Promise<void> => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       if (!wallet || !program) {
//         throw new Error("Wallet or program not initialized");
//       }

//       const [epochConfigPda] = PublicKey.findProgramAddressSync(
//         [Buffer.from("epoch_config")],
//         program.programId
//       );

//       const [epochPda] = PublicKey.findProgramAddressSync(
//         [Buffer.from("epoch"), Buffer.from(proofData.epoch.toString())],
//         program.programId
//       );

//       const [verificationResultPda] = PublicKey.findProgramAddressSync(
//         [Buffer.from("verification"), wallet.publicKey.toBuffer()],
//         program.programId
//       );

//       const tx = await program.methods.reclaimVerify({
//         claimInfo: {
//           provider: proofData.provider,
//           parameters: proofData.parameters,
//           contextAddress: new PublicKey(proofData.contextAddress),
//           contextMessage: proofData.contextMessage,
//         },
//         signedClaim: {
//           claimData: {
//             identifier: proofData.identifier,
//             owner: proofData.owner,
//             timestamp: proofData.timestampS,
//             epochIndex: proofData.epoch,
//           },
//           signatures: proofData.signatures,
//         },
//       })
//         .accounts({
//           signer: wallet.publicKey,
//           epochConfig: epochConfigPda,
//           epoch: epochPda,
//           reclaimProgram: RECLAIM_PROGRAM_ID,
//           systemProgram: web3.SystemProgram.programId,
//           verificationResult: verificationResultPda,
//         })
//         .rpc();

//       console.log("Verification successful. Transaction signature", tx);
//       void fetchVerifications();
//     } catch (err) {
//       setError(`Verification failed: ${err instanceof Error ? err.message : String(err)}`);
//     }
//     setIsLoading(false);
//   };

//   const handleRevoke = async (verificationPubkey: PublicKey): Promise<void> => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const tx = await program!.methods.revokeReclaimVerification()
//         .accounts({
//           signer: wallet!.publicKey,
//           verificationResult: verificationPubkey,
//         })
//         .rpc();
//       console.log("Revocation successful. Transaction signature", tx);
//       void fetchVerifications();
//     } catch (err) {
//       setError(`Revocation failed: ${err instanceof Error ? err.message : String(err)}`);
//     }
//     setIsLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-teal-800 to-teal-300 p-8 text-white">
//       <motion.h1 
//         className="text-4xl font-bold mb-8 text-center"
//         initial={{ opacity: 0, y: -50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <FiPackage className="inline-block mr-2" /> Reclaim Verification
//       </motion.h1>

//       {initializationError && (
//         <motion.div 
//           className="mb-4 p-4 bg-red-100 text-red-700 rounded flex items-center"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3 }}
//         >
//           <FiAlertTriangle className="mr-2" /> {initializationError}
//         </motion.div>
//       )}

//       <motion.div 
//         className="bg-white rounded-lg p-6 mb-8 text-gray-800"
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         <h2 className="text-2xl font-semibold mb-4"><FiCheck className="inline-block mr-2" /> Verify Claim</h2>
//         <button
//           onClick={handleCreateClaim}
//           disabled={isLoading || !reclaimProofRequest}
//           className="w-full bg-teal-400 text-white p-2 rounded hover:bg-teal-600 transition duration-200 flex items

// -center justify-center"
//         >
//           {isLoading ? 'Processing...' : <><FiCheck className="mr-2" /> Create Claim</>}
//         </button>
//         {requestUrl && (
//           <div className="mt-4">
//             <h2 className="text-xl font-semibold mb-2">Scan this QR code to start the verification process:</h2>
//             <QRCode value={requestUrl} />
//           </div>
//         )}
//       </motion.div>

//       {statusUrl && (
//         <div className="mt-4">
//           <h2 className="text-xl font-semibold mb-2">Status URL:</h2>
//           <p className="break-all">{statusUrl}</p>
//         </div>
//       )}

//       <motion.div 
//         className="bg-white rounded-lg p-6 text-gray-800"
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.5, delay: 0.2 }}
//       >
//         <h2 className="text-2xl font-semibold mb-4"><FiList className="inline-block mr-2" /> Verifications</h2>
//         {isLoading ? (
//           <p>Loading verifications...</p>
//         ) : (
//           <ul className="space-y-4">
//             {verifications.map((v, index) => (
//               <motion.li 
//                 key={v.publicKey.toString()} 
//                 className="border p-4 rounded flex justify-between items-center"
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.3, delay: index * 0.1 }}
//               >
//                 <div>
//                   <p><strong>Provider:</strong> {v.account.provider}</p>
//                   <p><strong>Verified At:</strong> {new Date(v.account.verifiedAt * 1000).toLocaleString()}</p>
//                   <p><strong>Status:</strong> {v.account.isActive ? 'Active' : 'Revoked'}</p>
//                 </div>
//                 {v.account.isActive && (
//                   <button
//                     onClick={() => void handleRevoke(v.publicKey)}
//                     className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200 flex items-center"
//                   >
//                     <FiX className="mr-2" /> Revoke
//                   </button>
//                 )}
//               </motion.li>
//             ))}
//           </ul>
//         )}
//       </motion.div>

//       {error && (
//         <motion.div 
//           className="mt-4 p-4 bg-red-100 text-red-700 rounded flex items-center"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3 }}
//         >
//           <FiX className="mr-2" /> {error}
//         </motion.div>
//       )}

//       {proofs && (
//         <motion.div 
//           className="mt-4 p-4 bg-green-100 text-green-700 rounded"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3 }}
//         >
//           <h2 className="text-xl font-semibold mb-2">Verification Successful!</h2>
//           <pre className="whitespace-pre-wrap">{JSON.stringify(proofs, null, 2)}</pre>
//         </motion.div>
//       )}
//     </div>
//   );
// };

// export default ReclaimVerificationUI;











// OLD CODE

// 'use client'

// import React, { useState, useEffect } from 'react';
// import { Connection, PublicKey } from '@solana/web3.js';
// import { AnchorProvider, Program, web3, Idl } from '@coral-xyz/anchor';
// import { useAnchorWallet } from '@solana/wallet-adapter-react';
// import { motion } from 'framer-motion';
// import { FiCheck, FiX, FiList, FiPackage } from 'react-icons/fi';

// // Import your IDL
// import idl from '../../idl/standard.json';

// // CHANGE: Updated program ID to match the one in the IDL
// const programID = new PublicKey("2eTVXGSKCaTaivadMawTEz3h14FLwhyGTY64UBYLyZ6p");

// // CHANGE: Updated StandardIDL type to include all accounts from the IDL
// type StandardIDL = Idl & {
//   accounts: {
//     verificationResult: any;
//     epoch: any;
//     epochConfig: any;
//   };
// };

// const typedIdl = idl as StandardIDL;

// // CHANGE: Updated VerifyArgs interface to match the IDL structure
// interface VerifyArgs {
//   claimInfo: {
//     provider: string;
//     parameters: string;
//     contextAddress: PublicKey;
//     contextMessage: string;
//   };
//   signedClaim: {
//     claimData: {
//       identifier: number[];
//       owner: string;
//       timestamp: number;
//       epochIndex: number;
//     };
//     signatures: number[][];
//   };
// }

// interface VerificationResult {
//   publicKey: PublicKey;
//   account: {
//     signer: PublicKey;
//     provider: string;
//     verifiedAt: number;
//     isActive: boolean;
//   };
// }

// // CHANGE: Added Reclaim import and constants similar to the second file
// import { Reclaim } from "@reclaimprotocol/js-sdk";
// // const RECLAIM_PROGRAM_ID = new PublicKey("rEcLDWaVLaymz82eGr6cutosPxE6SEzw6q4pbtLuyqf");
// const RECLAIM_PROGRAM_ID = new PublicKey("DovMZfoRztSgQ1SKx1M3UKwZz5fZtNbshX3qYSZHacZ4");
// const contextMessage = "Application related context";

// const ReclaimVerificationUI: React.FC = () => {
//   const wallet = useAnchorWallet();
//   const [provider, setProvider] = useState<AnchorProvider | null>(null);
//   const [program, setProgram] = useState<Program<StandardIDL> | null>(null);
//   const [verifications, setVerifications] = useState<VerificationResult[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   // CHANGE: Added state for verifyURL
//   const [verifyURL, setverifyURL] = useState<string | null>(null);

//   const [verifyArgs, setVerifyArgs] = useState<VerifyArgs>({
//     claimInfo: {
//       provider: '',
//       parameters: '',
//       contextAddress: wallet ? wallet.publicKey : PublicKey.default,
//       contextMessage: '',
//     },
//     signedClaim: {
//       claimData: {
//         identifier: Array.from({ length: 32 }, () => Math.floor(Math.random() * 256)),
//         owner: wallet ? wallet.publicKey.toBase58() : '',
//         timestamp: Math.floor(Date.now() / 1000),
//         epochIndex: 1,
//       },
//       signatures: [Array.from({ length: 65 }, () => Math.floor(Math.random() * 256))],
//     },
//   });

//   useEffect(() => {
//     if (wallet) {
//       const connection = new Connection("https://api.devnet.solana.com");
//       const provider = new AnchorProvider(connection, wallet, {});
//       setProvider(provider);
//       setProgram(new Program<StandardIDL>(typedIdl, provider));
//     }
//   }, [wallet]);

//   useEffect(() => {
//     if (program) {
//       void fetchVerifications();
//     }
//   }, [program]);

//   // CHANGE: Added effect to reset verifyURL when wallet changes
//   useEffect(() => {
//     setverifyURL(null);
//   }, [wallet]);

//   const fetchVerifications = async (): Promise<void> => {
//     setIsLoading(true);
//     try {
//       const allVerifications = await (program as any).account.verificationResult.all();
//       setVerifications(allVerifications as VerificationResult[]);
//     } catch (err) {
//       setError(`Failed to fetch verifications: ${err instanceof Error ? err.message : String(err)}`);
//     }
//     setIsLoading(false);
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, section: 'claimInfo', field: keyof VerifyArgs['claimInfo']): void => {
//     const { value } = e.target;
//     setVerifyArgs(prev => ({
//       ...prev,
//       [section]: {
//         ...prev[section],
//         [field]: field === 'contextAddress' ? new web3.PublicKey(value) : value,
//       },
//     }));
//   };

//   // CHANGE: Added getVerificationReq function similar to the second file
//   async function getVerificationReq() {
//     if (wallet?.publicKey) {
//       const publicKey = wallet.publicKey;
//       const APP_ID = "YOUR APP ID";
//       const APP_SECRET = "YOUR APP SECRET";
//       const providerId = "HTML PROVIDER ID";
//       const reclaimClient = new Reclaim.ProofRequest(APP_ID);

//       console.log(`Connected wallet: ${wallet?.publicKey?.toString()}`);

//       reclaimClient.addContext(publicKey.toString(), contextMessage);
//       await reclaimClient.buildProofRequest(providerId);
//       const signature = await reclaimClient.generateSignature(APP_SECRET);

//       reclaimClient.setSignature(signature);
//       const { requestUrl } = await reclaimClient.createVerificationRequest();
//       setverifyURL(requestUrl);

//       await reclaimClient.startSession({
//         onSuccessCallback: (proof: any) => {
//           console.log("Verification success", proof[0]);
//           handleVerify(proof[0]).then(() => {
//             alert(`Verification successful!`);
//           });
//         },
//         onFailureCallback: (error: any) => {
//           console.error("Verification failed", error);
//           alert(error);
//           setverifyURL(null);
//         },
//       });
//     }
//   }

//   // CHANGE: Updated handleVerify function to use the proof data
//   const handleVerify = async (proofData: any): Promise<void> => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       if (!wallet || !program) {
//         throw new Error("Wallet or program not initialized");
//       }

//       const context = JSON.parse(proofData.claimData.context);
//       const args: VerifyArgs = {
//         claimInfo: {
//           provider: proofData.claimData.provider,
//           parameters: proofData.claimData.parameters,
//           contextAddress: new PublicKey(context.contextAddress),
//           contextMessage: context.contextMessage,
//         },
//         signedClaim: {
//           claimData: {
//             identifier: proofData.identifier,
//             owner: proofData.claimData.owner,
//             timestamp: proofData.claimData.timestampS,
//             epochIndex: proofData.claimData.epoch,
//           },
//           signatures: proofData.signatures,
//         },
//       };

//       const [epochConfigPda] = PublicKey.findProgramAddressSync(
//         [Buffer.from("epoch_config")],
//         program.programId
//       );

//       const [epochPda] = PublicKey.findProgramAddressSync(
//         [Buffer.from("epoch"), Buffer.from(args.signedClaim.claimData.epochIndex.toString())],
//         program.programId
//       );

//       const [verificationResultPda] = PublicKey.findProgramAddressSync(
//         [Buffer.from("verification"), wallet.publicKey.toBuffer()],
//         program.programId
//       );

//       const tx = await program.methods.reclaimVerify(args)
//         .accounts({
//           signer: wallet.publicKey,
//           epochConfig: epochConfigPda,
//           epoch: epochPda,
//           reclaimProgram: RECLAIM_PROGRAM_ID,
//           systemProgram: web3.SystemProgram.programId,
//           verificationResult: verificationResultPda,
//         })
//         .rpc();

//       console.log("Verification successful. Transaction signature", tx);
//       void fetchVerifications();
//     } catch (err) {
//       setError(`Verification failed: ${err instanceof Error ? err.message : String(err)}`);
//     }
//     setIsLoading(false);
//   };

//   const handleRevoke = async (verificationPubkey: PublicKey): Promise<void> => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const tx = await program!.methods.revokeReclaimVerification()
//         .accounts({
//           signer: wallet!.publicKey,
//           verificationResult: verificationPubkey,
//         })
//         .rpc();
//       console.log("Revocation successful. Transaction signature", tx);
//       void fetchVerifications();
//     } catch (err) {
//       setError(`Revocation failed: ${err instanceof Error ? err.message : String(err)}`);
//     }
//     setIsLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-teal-800 to-teal-300 p-8 text-white">
//       <motion.h1 
//         className="text-4xl font-bold mb-8 text-center"
//         initial={{ opacity: 0, y: -50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <FiPackage className="inline-block mr-2" /> Reclaim Verification
//       </motion.h1>

//       <motion.div 
//         className="bg-white rounded-lg p-6 mb-8 text-gray-800"
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         <h2 className="text-2xl font-semibold mb-4"><FiCheck className="inline-block mr-2" /> Verify Claim</h2>
//         {/* CHANGE: Updated button to use getVerificationReq */}
//         <button
//           onClick={getVerificationReq}
//           disabled={isLoading}
//           className="w-full bg-teal-400 text-white p-2 rounded hover:bg-teal-600 transition duration-200 flex items-center justify-center"
//         >
//           {isLoading ? 'Processing...' : <><FiCheck className="mr-2" /> Start Verification</>}
//         </button>
//         {/* CHANGE: Added QR code display */}
//         {verifyURL && (
//           <div className="mt-4">
//             <p>Scan this QR code to verify:</p>
//             <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(verifyURL)}`} alt="QR Code" />
//           </div>
//         )}
//       </motion.div>

//       <motion.div 
//         className="bg-white rounded-lg p-6 text-gray-800"
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.5, delay: 0.2 }}
//       >
//         <h2 className="text-2xl font-semibold mb-4"><FiList className="inline-block mr-2" /> Verifications</h2>
//         {isLoading ? (
//           <p>Loading verifications...</p>
//         ) : (
//           <ul className="space-y-4">
//             {verifications.map((v, index) => (
//               <motion.li 
//                 key={v.publicKey.toString()} 
//                 className="border p-4 rounded flex justify-between items-center"
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.3, delay: index * 0.1 }}
//               >
//                 <div>
//                   <p><strong>Provider:</strong> {v.account.provider}</p>
//                   <p><strong>Verified At:</strong> {new Date(v.account.verifiedAt * 1000).toLocaleString()}</p>
//                   <p><strong>Status:</strong> {v.account.isActive ? 'Active' : 'Revoked'}</p>
//                 </div>
//                 {v.account.isActive && (
//                   <button
//                     onClick={() => void handleRevoke(v.publicKey)}
//                     className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200 flex items-center"
//                   >
//                     <FiX className="mr-2" /> Revoke
//                   </button>
//                 )}
//               </motion.li>
//             ))}
//           </ul>
//         )}
//       </motion.div>

//       {error && (
//         <motion.div 
//           className="mt-4 p-4 bg-red-100 text-red-700 rounded flex items-center"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3 }}
//         >
//           <FiX className="mr-2" /> {error}
//         </motion.div>
//       )}
//     </div>
//   );
// };

// export default ReclaimVerificationUI;

'use client'

import React, { useState, useEffect } from 'react';
import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk';
import QRCode from 'react-qr-code';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiPackage, FiAlertTriangle } from 'react-icons/fi';

// Reclaim configuration
const RECLAIM_APP_ID = process.env.NEXT_PUBLIC_RECLAIM_APP_ID;
const RECLAIM_APP_SECRET = process.env.NEXT_PUBLIC_RECLAIM_APP_SECRET;
const REDIRECT_URL = 'https://app.useark.xyz/chat';

// Define providers
const providers = [
  { id: process.env.NEXT_PUBLIC_TWITTER_FOLLOWER_COUNT_ID, name: "Twitter Follower Count" },
  { id: process.env.NEXT_PUBLIC_STEAM_ID, name: "Steam ID" },
  { id: process.env.NEXT_PUBLIC_DUBAI_LAND_METADATA_ID, name: "Dubai Land Department" },
  { id: process.env.NEXT_PUBLIC_DUBAI_LAND_EMIRATES_ID, name: "Dubai Land Department - Emirates Id" },
  { id: process.env.NEXT_PUBLIC_LINKEDIN_POST_IMPRESSIONS_ID, name: "Linkedin Provider for Post Impressions" },
  { id: process.env.NEXT_PUBLIC_DUBAI_LAND_TENANT_V2_ID, name: "Dubai Land Department - Tenant Verification V2" },
  { id: process.env.NEXT_PUBLIC_BOA_ACCOUNT_BALANCE_ID, name: "Bank of America Account Balance" },
  { id: process.env.NEXT_PUBLIC_LINKEDIN_DASHBOARD_ANALYTICS_ID, name: "LinkedIn Dashboard Analytics" },
  { id: process.env.NEXT_PUBLIC_YOUTUBE_CREATOR_ANALYTICS_ID, name: "Youtube Creator Analytics in Last 28 days" },
  { id: process.env.NEXT_PUBLIC_LINKEDIN_ANALYTICS_DATA_ID, name: "LinkedIn Analytics Data" },
  { id: process.env.NEXT_PUBLIC_USA_IDENTITY_ID, name: "USA Identity" },
  { id: process.env.NEXT_PUBLIC_INSTAGRAM_STORY_VIEWS_ID, name: "Instagram Story Views" },
  { id: process.env.NEXT_PUBLIC_KAGGLE_USERNAME_ID, name: "Kaggle username working" },
  { id: process.env.NEXT_PUBLIC_COINBASE_KYC_ID, name: "Coinbase Completed KYC" },
  { id: process.env.NEXT_PUBLIC_TWITTER_CREDENTIALS_ID, name: "Twitter Credentials" },
  { id: process.env.NEXT_PUBLIC_SPOTIFY_PUBLIC_PLAYLIST_ID, name: "Spotify Proof of Public Playlist" },
  { id: process.env.NEXT_PUBLIC_FACEBOOK_ID, name: "Facebook" },
  { id: process.env.NEXT_PUBLIC_AIRBNB_HOST_ID, name: "AirbnbHost" },
  { id: process.env.NEXT_PUBLIC_SOUTH_AFRICA_ID, name: "SOUTH AFRICA ID" },
  { id: process.env.NEXT_PUBLIC_UZ_TAX_PAID_ID, name: "UZ Tax paid" },
  { id: process.env.NEXT_PUBLIC_BINANCE_KYC_LEVEL_ID, name: "Binance KYC Level" },
  { id: process.env.NEXT_PUBLIC_AMAZON_PRIME_MEMBERSHIP_ID, name: "Amazon Prime Membership" },
  { id: process.env.NEXT_PUBLIC_US_SSN_NAME_EXTRACTOR_ID, name: "US SSN Name Extractor" },
  { id: process.env.NEXT_PUBLIC_DSID_TWITTER_USERNAME_ID, name: "DSID Twitter Username" },
  { id: process.env.NEXT_PUBLIC_DISCORD_CHANNEL_ACCESS_ID, name: "Discord Channel Access" },
  { id: process.env.NEXT_PUBLIC_INDIA_IDENTITY_ID, name: "India Identity" },
  { id: process.env.NEXT_PUBLIC_BINANCE_TX_HISTORY_ID, name: "Binance Tx History" },
  { id: process.env.NEXT_PUBLIC_NEXUSPAY_BOLT_DROPOFF_ID, name: "Nexuspay Bolt Dropoff Location" },
  { id: process.env.NEXT_PUBLIC_TWEET_VERIFIER_ID, name: "Tweet Verifier" },
  { id: process.env.NEXT_PUBLIC_UK_NHS_NUMBER_ID, name: "UK NHS Number" },
  { id: process.env.NEXT_PUBLIC_CANADA_IDENTITY_ID, name: "Canada Identity" },
  { id: process.env.NEXT_PUBLIC_RUSSIA_IDENTITY_ID, name: "Russia Identity" },
  { id: process.env.NEXT_PUBLIC_DISCORD_CHANNEL_ID, name: "Discord Channel ID" },
  { id: process.env.NEXT_PUBLIC_UZBEKISTAN_IDENTITY_ID, name: "Uzbekistan Identity" },
  { id: process.env.NEXT_PUBLIC_PORTUGAL_IDENTITY_ID, name: "Portugal Identity" },
  { id: process.env.NEXT_PUBLIC_NETHERLANDS_IDENTITY_ID, name: "Netherlands Identity" },
  { id: process.env.NEXT_PUBLIC_GITHUB_REPOSITORIES_ID, name: "Total GitHub Repositories" },
  { id: process.env.NEXT_PUBLIC_DISCORD_USER_ID, name: "Discord User Id" },
  { id: process.env.NEXT_PUBLIC_GERMANY_IDENTITY_ID, name: "Germany Identity" },
  { id: process.env.NEXT_PUBLIC_STRIPE_TRANSACTION_ID, name: "Last Stripe Transaction Amount" },
  { id: process.env.NEXT_PUBLIC_LEETCODE_ID, name: "Leetcode" },
  { id: process.env.NEXT_PUBLIC_AMAZON_ORDERS_ID, name: "Amazon Orders A" },
  { id: process.env.NEXT_PUBLIC_AMAZON_EMAIL_PHONE_ID, name: "Amazon Email & Phone no." },
  { id: process.env.NEXT_PUBLIC_GITHUB_USERNAME, name: "GitHub UserName" },
  { id: process.env.NEXT_PUBLIC_UBER_UID, name: "Uber UID" },
  { id: process.env.NEXT_PUBLIC_GMAIL_ACCOUNT, name: "Gmail Account" },
  { id: process.env.NEXT_PUBLIC_TOTAL_WON_EARN_SUPERTEAM, name: "Total Earned on Superteam Earn" },
  { id: process.env.NEXT_PUBLIC_HACKERRANK_USERNAME, name: "Hackerrank Username" },
  { id: process.env.NEXT_PUBLIC_TITLE_SUPERTEAM, name: "Title Superteam" },
  { id: process.env.NEXT_PUBLIC_GITHUB_CONTRIBUTIONS_LAST_YEAR, name: "Github Contributions in the last year" },
  { id: process.env.NEXT_PUBLIC_RAZORPAY_SALARY, name: "RazorPay Salary" },
  { id: process.env.NEXT_PUBLIC_YC_FOUNDER_DETAILS, name: "YC Founder Details" },
  { id: process.env.NEXT_PUBLIC_CHINA_IDENTITY, name: "China Identity" },
  { id: process.env.NEXT_PUBLIC_IG_STORY_LIKEMONEY_KOUSHITH, name: "IG Story - LikeMoney - Koushith" },
  { id: process.env.NEXT_PUBLIC_LINKEDIN_RECENT_EMPLOYMENT, name: "Linkedin - Recent Employment" },
  { id: process.env.NEXT_PUBLIC_PREMIER_DATA, name: "Premier Data" },
  { id: process.env.NEXT_PUBLIC_PREMIER_LEAGUE_SOLANA_FPL, name: "Premier League Solana FPL" },
  { id: process.env.NEXT_PUBLIC_NIGERIA_IDENTITY, name: "Nigeria Identity" },
  { id: process.env.NEXT_PUBLIC_FRANCE_IDENTITY, name: "France Identity" },
  { id: process.env.NEXT_PUBLIC_EGYPT_IDENTITY, name: "Egypt Identity" },
  { id: process.env.NEXT_PUBLIC_UKRAINE_IDENTITY, name: "Ukraine Identity" },
  { id: process.env.NEXT_PUBLIC_HACKERRANK_VERIFY_BADGES, name: "Hackerank - Verify badges" },
  { id: process.env.NEXT_PUBLIC_DUOLINGO_ACHIEVEMENTS_KOUSHITH, name: "Duolingo Achievements - Koushith - Eth-SG" },
  { id: process.env.NEXT_PUBLIC_TWITTER_FOLLOW_CHECK, name: "Twitter Follow Check" },  
].filter(provider => provider.id); // Only include providers with defined IDs

const ReclaimVerificationUI: React.FC = () => {
  const [reclaimProofRequest, setReclaimProofRequest] = useState<ReclaimProofRequest | null>(null);
  const [requestUrl, setRequestUrl] = useState<string>('');
  const [statusUrl, setStatusUrl] = useState<string>('');
  const [proofs, setProofs] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [initializationError, setInitializationError] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string>(providers[0]?.id || '');

  useEffect(() => {
    async function initializeReclaim() {
      try {
        if (!RECLAIM_APP_ID || !RECLAIM_APP_SECRET) {
          throw new Error("Reclaim App ID or Secret not configured");
        }

        if (providers.length === 0) {
          throw new Error("No providers configured. Please check your environment variables.");
        }

        setInitializationError(null);
      } catch (err) {
        console.error("Failed to initialize ReclaimProofRequest:", err);
        setInitializationError(`Failed to initialize Reclaim: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    initializeReclaim();
  }, []);

  const handleCreateClaim = async () => {
    if (!RECLAIM_APP_ID || !RECLAIM_APP_SECRET || !selectedProvider) {
      setError('Reclaim configuration is incomplete');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const proofRequest = await ReclaimProofRequest.init(
        RECLAIM_APP_ID,
        RECLAIM_APP_SECRET,
        selectedProvider
      );
      proofRequest.setRedirectUrl(REDIRECT_URL);

      const url = await proofRequest.getRequestUrl();
      setRequestUrl(url);

      const status = proofRequest.getStatusUrl();
      setStatusUrl(status);
      console.log('Status URL:', status);

      await proofRequest.startSession({
        onSuccess: (proofs) => {
          console.log('Verification success', proofs);
          setProofs(proofs);
        },
        onError: (error) => {
          console.error('Verification failed', error);
          setError(`Verification failed: ${error}`);
        }
      });
    } catch (err) {
      setError(`Failed to create claim: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 via-teal-800 to-teal-500 p-8 text-white">
      <motion.h1 
        className="text-5xl font-bold mb-12 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 120 }}
      >
        <FiPackage className="inline-block mr-4" /> Reclaim Verification
      </motion.h1>

      <AnimatePresence>
        {initializationError && (
          <motion.div 
            className="mb-8 p-6 bg-red-100 text-red-700 rounded-lg shadow-lg flex items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <FiAlertTriangle className="mr-4 text-3xl" /> {initializationError}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl p-8 mb-8 text-white shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-semibold mb-6"><FiCheck className="inline-block mr-3" /> Verify Claim</h2>
        
        <motion.div className="mb-6" whileHover={{ scale: 1.0 }} whileTap={{ scale: 0.95 }}>
          <label className="block text-lg mb-2" htmlFor="provider-select">Select Provider:</label>
          <select
            id="provider-select"
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-black border border-white border-opacity-50 focus:outline-none focus:ring-2 focus:ring-white"
          >
            {providers.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>
        </motion.div>
        
        <motion.button
          onClick={handleCreateClaim}
          disabled={isLoading || !selectedProvider}
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-lg shadow-lg font-bold text-xl transition duration-300 hover:from-yellow-500 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50"
          whileHover={{ scale: 1.0 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? 'Processing...' : <><FiCheck className="inline-block mr-2" /> Create Claim</>}
        </motion.button>
        
        <AnimatePresence>
          {requestUrl && (
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-semibold mb-4">Scan this QR code to start the verification process:</h2>
              <div className="bg-white p-4 rounded-lg inline-block">
                <QRCode value={requestUrl} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {statusUrl && (
          <motion.div 
            className="mt-8 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold mb-2">Status URL:</h2>
            <p className="break-all">{statusUrl}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div 
            className="mt-8 p-6 bg-red-500 text-white rounded-xl flex items-center shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <FiX className="mr-4 text-3xl" /> {error}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {proofs && (
          <motion.div 
            className="mt-8 p-6 bg-green-500 text-white rounded-xl shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Verification Successful!</h2>
            <pre className="whitespace-pre-wrap overflow-auto max-h-60">{JSON.stringify(proofs, null, 2)}</pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReclaimVerificationUI;