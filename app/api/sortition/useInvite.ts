import { NextApiRequest, NextApiResponse } from 'next';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@coral-xyz/anchor';
import idl from '../../../idl/sortition.json';

const PROGRAM_ID = new PublicKey('7naXQjiC6W4Vz28Z4cPjBqjWVFVbRipVrZ9VQsuUAPcg');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { invitePublicKey, walletPublicKey, name, region, ageGroup, otherDemographic } = req.body;

    const connection = new Connection('https://api.devnet.solana.com');
    const provider = new AnchorProvider(connection, { publicKey: new PublicKey(walletPublicKey) } as any, {});
    const program = new Program(idl as any, provider);

    try {
      const invite = await program.account.governanceInvite.fetch(new PublicKey(invitePublicKey));
      
      const [citizenAccountPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('citizen'), invite.governancePool.toBuffer(), new PublicKey(walletPublicKey).toBuffer()],
        program.programId
      );

      const [citizenIndexPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('citizen_index'), invite.governancePool.toBuffer(), new BN(invite.governancePool.totalCitizens).toArrayLike(Buffer, 'le', 8)],
        program.programId
      );

      const tx = await program.methods.useGovernanceInvite(name, region, ageGroup, otherDemographic)
        .accounts({
          governancePool: invite.governancePool,
          invite: new PublicKey(invitePublicKey),
          citizenAccount: citizenAccountPda,
          newMember: new PublicKey(walletPublicKey),
          citizenIndex: citizenIndexPda,
          memberTokenAccount: new PublicKey(walletPublicKey), // This should be the correct ATA
          governanceTokenMint: invite.governancePool, // Assuming this is the correct mint
          systemProgram: web3.SystemProgram.programId,
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