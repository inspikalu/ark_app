import { NextApiRequest, NextApiResponse } from 'next';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@coral-xyz/anchor';
import idl from '../../../idl/sociocracy.json';

const PROGRAM_ID = new PublicKey('5fgkDxG2a88FoKvcfEMToAwouPMXesTV25n56tFg68Vw');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { invitePublicKey, walletPublicKey, memberName } = req.body;

    const connection = new Connection('https://api.devnet.solana.com');
    const provider = new AnchorProvider(connection, {publicKey: new PublicKey(walletPublicKey)} as any, {});
    const program = new Program(idl as any, provider);

    try {
      const invite = await program.account.circleInvite.fetch(new PublicKey(invitePublicKey));
      
      const [memberPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('member'), new PublicKey(walletPublicKey).toBuffer()],
        program.programId
      );

      const [circleMemberRecordPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('circle_member'), invite.circle.toBuffer(), new PublicKey(walletPublicKey).toBuffer()],
        program.programId
      );

      const tx = await program.methods.useCircleInvite(memberName)
        .accounts({
          circle: invite.circle,
          invite: new PublicKey(invitePublicKey),
          member: memberPda,
          circleMemberRecord: circleMemberRecordPda,
          newMember: new PublicKey(walletPublicKey),
          systemProgram: web3.SystemProgram.programId,
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