// import { NextApiRequest, NextApiResponse } from 'next';
// import { Connection, PublicKey } from '@solana/web3.js';
// import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';
// import idl from '../../../idl/military_junta.json';

// const PROGRAM_ID = new PublicKey('2fPj7RDkm4FJouSo6DE6vHbE5rjTvdZPnnxJUgFvYVm2');

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     const { juntaPublicKey, walletPublicKey } = req.body;

//     const connection = new Connection('https://api.devnet.solana.com');
//     const provider = new AnchorProvider(connection, { publicKey: new PublicKey(walletPublicKey) } as any, {});
//     const program = new Program(idl as any, provider);

//     try {
//       const junta = await program.account.junta.fetch(new PublicKey(juntaPublicKey));
      
//       const [invitePda] = PublicKey.findProgramAddressSync(
//         [
//           Buffer.from('junta_invite'),
//           new PublicKey(juntaPublicKey).toBuffer(),
//           new PublicKey(walletPublicKey).toBuffer(),
//           new BN(junta.totalSubjects).toArrayLike(Buffer, 'le', 8)
//         ],
//         program.programId
//       );

//       const tx = await program.methods.createJuntaInvite(new BN(7)) // 7 days expiration
//         .accounts({
//           junta: new PublicKey(juntaPublicKey),
//           invite: invitePda,
//           creator: new PublicKey(walletPublicKey),
//           systemProgram: web3.SystemProgram.programId,
//         })
//         .rpc();

//       const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/join/military-junta/${invitePda.toBase58()}`;

//       res.status(200).json({ inviteLink, transaction: tx });
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to create invite' });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }