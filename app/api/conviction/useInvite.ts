// import { NextApiRequest, NextApiResponse } from 'next';
// import { Connection, PublicKey } from '@solana/web3.js';
// import { Program, AnchorProvider, web3 } from '@coral-xyz/anchor';
// import idl from '../../../idl/conviction.json';

// const PROGRAM_ID = new PublicKey('ATsZoBzoVyPF97HLn9kt2ffNSGcnYwUApbNxfsVknNVr');

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     const { invitePublicKey, walletPublicKey } = req.body;

//     const connection = new Connection('https://api.devnet.solana.com');
//     const provider = new AnchorProvider(connection, { publicKey: new PublicKey(walletPublicKey) } as any, {});
//     const program = new Program(idl as any, provider);

//     try {
//       const invite = await program.account.convictionInvite.fetch(new PublicKey(invitePublicKey));
      
//       const [stakeAccountPda] = PublicKey.findProgramAddressSync(
//         [Buffer.from('stake_account'), invite.governance.toBuffer(), new PublicKey(walletPublicKey).toBuffer()],
//         program.programId
//       );

//       const tx = await program.methods.useConvictionInvite()
//         .accounts({
//           governance: invite.governance,
//           invite: new PublicKey(invitePublicKey),
//           stakeAccount: stakeAccountPda,
//           newMember: new PublicKey(walletPublicKey),
//           memberTokenAccount: new PublicKey(walletPublicKey), // This should be the correct ATA
//           governanceTokenMint: invite.governance, // Assuming this is the correct mint
//           governanceNftMint: invite.governance, // Assuming this is the correct NFT mint
//           memberNftAccount: new PublicKey(walletPublicKey), // This should be the correct NFT ATA
//           tokenProgram: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
//           systemProgram: web3.SystemProgram.programId,
//           associatedTokenProgram: new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'),
//           rent: web3.SYSVAR_RENT_PUBKEY,
//         })
//         .rpc();

//       res.status(200).json({ success: true, transaction: tx });
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to use invite' });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }