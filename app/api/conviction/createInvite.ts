import { NextApiRequest, NextApiResponse } from 'next';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';
import idl from '../../../idl/conviction.json';

const PROGRAM_ID = new PublicKey('ATsZoBzoVyPF97HLn9kt2ffNSGcnYwUApbNxfsVknNVr');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { governancePublicKey, walletPublicKey } = req.body;

    const connection = new Connection('https://api.devnet.solana.com');
    const provider = new AnchorProvider(connection, { publicKey: new PublicKey(walletPublicKey) } as any, {});
    const program = new Program(idl as any, provider);

    try {
      const governance = await program.account.governance.fetch(new PublicKey(governancePublicKey));
      
      const [invitePda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('invite'),
          new PublicKey(governancePublicKey).toBuffer(),
          new PublicKey(walletPublicKey).toBuffer(),
          new BN(governance.totalMembers).toArrayLike(Buffer, 'le', 8)
        ],
        program.programId
      );

      const tx = await program.methods.createConvictionInvite(new BN(7)) // 7 days expiration
        .accounts({
          governance: new PublicKey(governancePublicKey),
          invite: invitePda,
          creator: new PublicKey(walletPublicKey),
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/join/conviction/${invitePda.toBase58()}`;

      res.status(200).json({ inviteLink, transaction: tx });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create invite' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}