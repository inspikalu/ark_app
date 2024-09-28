"use client"
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function Wallet() {
  const { publicKey, connected } = useWallet();

  const truncatedPublicKey = publicKey ? 
    `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}` : 
    '';

  return (
    <div className="flex items-center">
      <WalletMultiButton className="bg-[#008080] font-semibold text-white px-8 py-2 rounded-lg border-2 border-[#008080] hover:bg-black hover:text-[#008080] transition-colors duration-300" />
      {connected && publicKey && (
        <span className="ml-2 text-white">
          Connected: {truncatedPublicKey}
        </span>
      )}
    </div>
  );
}