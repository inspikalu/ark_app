import { NextApiRequest, NextApiResponse } from 'next';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';
import idl from '../../../idl/sortition.json';

const PROGRAM_ID = new PublicKey('7naXQjiC6W4Vz28Z4cPjBqjWVFVbRipVrZ9VQsuUAPcg');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { governancePoolPublicKey, walletPublicKey } = req.body;

    const connection = new Connection('https://api.devnet.solana.com');
    const provider = new AnchorProvider(connection, { publicKey: new PublicKey(walletPublicKey) } as any, {});
    const program = new Program(idl as any, provider);

    try {
      const governancePool = await program.account.governancePool.fetch(new PublicKey(governancePoolPublicKey));
      
      const [invitePda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('governance_invite'),
          new PublicKey(governancePoolPublicKey).toBuffer(),
          new PublicKey(walletPublicKey).toBuffer(),
          new BN(governancePool.totalCitizens).toArrayLike(Buffer, 'le', 8)
        ],
        program.programId
      );

      const tx = await program.methods.createGovernanceInvite(new BN(7)) // 7 days expiration
        .accounts({
          governancePool: new PublicKey(governancePoolPublicKey),
          invite: invitePda,
          creator: new PublicKey(walletPublicKey),
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/join/sortition/${invitePda.toBase58()}`;

      res.status(200).json({ inviteLink, transaction: tx });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create invite' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}