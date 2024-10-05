// import { NextApiRequest, NextApiResponse } from 'next';
// import { Connection, PublicKey } from '@solana/web3.js';
// import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';
// import idl from '../../../idl/sociocracy.json';

// const PROGRAM_ID = new PublicKey('5fgkDxG2a88FoKvcfEMToAwouPMXesTV25n56tFg68Vw');

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     const { circlePublicKey, walletPublicKey } = req.body;

//     const connection = new Connection('https://api.devnet.solana.com');
//     const provider = new AnchorProvider(connection, {publicKey: new PublicKey(walletPublicKey)} as any, {});
//     const program = new Program(idl as any, provider);

//     try {
//       const [invitePda] = PublicKey.findProgramAddressSync(
//         [
//           Buffer.from('circle_invite'),
//           new PublicKey(circlePublicKey).toBuffer(),
//           new PublicKey(walletPublicKey).toBuffer(),
//           Buffer.from(program.programId.toBuffer()),
//         ],
//         program.programId
//       );

//       const tx = await program.methods.createCircleInvite(new BN(7)) // 7 days expiration
//         .accounts({
//           circle: new PublicKey(circlePublicKey),
//           invite: invitePda,
//           creator: new PublicKey(walletPublicKey),
//           systemProgram: web3.SystemProgram.programId,
//         })
//         .rpc();

//       const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/join/sociocracy/${invitePda.toBase58()}`;

//       res.status(200).json({ inviteLink, transaction: tx });
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to create invite' });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }