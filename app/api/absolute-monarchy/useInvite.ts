import { NextApiRequest, NextApiResponse } from 'next';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@coral-xyz/anchor';
import idl from '../../../idl/absolute_monarchy.json';

const PROGRAM_ID = new PublicKey('ADp9DgS9ZpsVDCXb4ysDjJoB1d8cL3CUmm4ErwVtqWzu');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { invitePublicKey, walletPublicKey } = req.body;

    const connection = new Connection('https://api.devnet.solana.com');
    const provider = new AnchorProvider(connection, { publicKey: new PublicKey(walletPublicKey) } as any, {});
    const program = new Program(idl as any, provider);

    try {
      const invite = await program.account.kingdomInvite.fetch(new PublicKey(invitePublicKey));
      
      const [subjectPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('subject'), invite.kingdom.toBuffer(), invite.kingdom.toBuffer()],
        program.programId
      );

      const tx = await program.methods.useKingdomInvite()
        .accounts({
          kingdom: invite.kingdom,
          invite: new PublicKey(invitePublicKey),
          subject: subjectPda,
          newSubject: new PublicKey(walletPublicKey),
          memberTokenAccount: new PublicKey(walletPublicKey), // This should be the correct ATA
          kingdomMint: invite.kingdom, // Assuming this is the correct mint
          tokenProgram: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
          systemProgram: web3.SystemProgram.programId,
          associatedTokenProgram: new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'),
          rent: web3.SYSVAR_RENT_PUBKEY,
        })
        .rpc();

      res.status(200).json({ success: true, transaction: tx });
    } catch (error) {
      res.status(500).json({ error: 'Failed to use invite' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}