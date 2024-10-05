// // pages/api/flat-dao/useInvite.ts
// import { NextApiRequest, NextApiResponse } from 'next';
// import { Connection, PublicKey } from '@solana/web3.js';
// import { Program, AnchorProvider, web3 } from '@coral-xyz/anchor';
// import idl from '../../../idl/flat_dao.json';

// const PROGRAM_ID = new PublicKey('FNF2M3rVeAhQ28VTCNVYzfKTnX1ZcStGuDZ9geVzY38Q');

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   const { invitePublicKey, walletPublicKey } = req.body;

//   const connection = new Connection('https://api.devnet.solana.com');
//   const provider = new AnchorProvider(connection, {publicKey: new PublicKey(walletPublicKey)} as any, {});
//   const program = new Program(idl as any, provider);

//   try {
//     const invite = await program.account.daoInvite.fetch(new PublicKey(invitePublicKey));

//     const tx = await program.methods.useFlatdaoInvite()
//       .accounts({
//         dao: invite.dao,
//         invite: new PublicKey(invitePublicKey),
//         newMember: new PublicKey(walletPublicKey),
//       })
//       .rpc();

//     res.status(200).json({ success: true, transaction: tx });
//   } catch (error) {
//     console.error('Error using invite:', error);
//     res.status(500).json({ error: 'Failed to use invite' });
//   }
// }