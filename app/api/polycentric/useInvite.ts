// // pages/api/polycentric/useInvite.ts
// import { NextApiRequest, NextApiResponse } from 'next';
// import { Connection, PublicKey } from '@solana/web3.js';
// import { Program, AnchorProvider, web3 } from '@coral-xyz/anchor';
// import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync } from '@solana/spl-token';
// import idl from '../../../idl/polycentric.json';

// const PROGRAM_ID = new PublicKey('5MkjpkHC6FuXQgkjJiTc6QNNAzYyAHfRFHyQFNjXT1kv');

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   const { invitePublicKey, walletPublicKey } = req.body;

//   const connection = new Connection('https://api.devnet.solana.com');
//   const provider = new AnchorProvider(connection, {publicKey: new PublicKey(walletPublicKey)} as any, {});
//   const program = new Program(idl as any, provider);

//   try {
//     const invite = await program.account.governanceInvite.fetch(new PublicKey(invitePublicKey));

//     const tx = await program.methods.usePolycentricGovernanceInvite()
//       .accounts({
//         governancePool: invite.governancePool,
//         invite: new PublicKey(invitePublicKey),
//         newMember: new PublicKey(walletPublicKey),
//         governanceTokenMint: invite.governanceTokenMint,
//         memberGovernanceTokenAccount: await getAssociatedTokenAddressSync(
//           invite.governanceTokenMint,
//           new PublicKey(walletPublicKey)
//         ),
//         tokenProgram: TOKEN_PROGRAM_ID,
//         associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
//         systemProgram: web3.SystemProgram.programId,
//         rent: web3.SYSVAR_RENT_PUBKEY,
//       })
//       .rpc();

//     res.status(200).json({ success: true, transaction: tx });
//   } catch (error) {
//     console.error('Error using invite:', error);
//     res.status(500).json({ error: 'Failed to use invite' });
//   }
// }