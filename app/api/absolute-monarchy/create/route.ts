import { NextApiRequest, NextApiResponse } from 'next';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';
import idl from '../../../../idl/absolute_monarchy.json';

const PROGRAM_ID = new PublicKey('ADp9DgS9ZpsVDCXb4ysDjJoB1d8cL3CUmm4ErwVtqWzu');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { kingdomPublicKey, walletPublicKey } = req.body;

    const connection = new Connection('https://api.devnet.solana.com');
    const provider = new AnchorProvider(connection, { publicKey: new PublicKey(walletPublicKey) } as any, {});
    const program = new Program(idl as any, provider);

    try {
      const kingdom = await (program as any).account.kingdom.fetch(new PublicKey(kingdomPublicKey));
      
      const [invitePda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('kingdom_invite'),
          new PublicKey(kingdomPublicKey).toBuffer(),
          new PublicKey(walletPublicKey).toBuffer(),
          new BN(kingdom.totalSubjects).toArrayLike(Buffer, 'le', 8)
        ],
        program.programId
      );

      const tx = await (program as any).methods.createKingdomInvite(new BN(7)) // 7 days expiration
        .accounts({
          kingdom: new PublicKey(kingdomPublicKey),
          invite: invitePda,
          creator: new PublicKey(walletPublicKey),
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/join/absolute-monarchy/create/${invitePda.toBase58()}`;

      res.status(200).json({ inviteLink, transaction: tx });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create invite' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}