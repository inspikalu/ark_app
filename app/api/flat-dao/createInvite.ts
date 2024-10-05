// // pages/api/flat-dao/createInvite.ts
// import { NextApiRequest, NextApiResponse } from 'next';
// import { Connection, PublicKey } from '@solana/web3.js';
// import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';
// import idl from '../../../idl/flat_dao.json';

// const PROGRAM_ID = new PublicKey('FNF2M3rVeAhQ28VTCNVYzfKTnX1ZcStGuDZ9geVzY38Q');

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   const { daoPublicKey, walletPublicKey } = req.body;

//   const connection = new Connection('https://api.devnet.solana.com');
//   const provider = new AnchorProvider(connection, {publicKey: new PublicKey(walletPublicKey)} as any, {});
//   const program = new Program(idl as any, provider);

//   try {
//     const [invitePda] = PublicKey.findProgramAddressSync(
//       [
//         Buffer.from('invite'),
//         new PublicKey(daoPublicKey).toBuffer(),
//         new PublicKey(walletPublicKey).toBuffer(),
//         Buffer.from(program.programId.toBuffer()),
//       ],
//       program.programId
//     );

//     const tx = await program.methods.createFlatdaoInvite(new BN(7)) // 7 days expiration
//       .accounts({
//         dao: new PublicKey(daoPublicKey),
//         invite: invitePda,
//         creator: new PublicKey(walletPublicKey),
//         systemProgram: web3.SystemProgram.programId,
//       })
//       .rpc();

//     const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/join/flat-dao/${invitePda.toBase58()}`;

//     res.status(200).json({ inviteLink, transaction: tx });
//   } catch (error) {
//     console.error('Error creating invite:', error);
//     res.status(500).json({ error: 'Failed to create invite' });
//   }
// }