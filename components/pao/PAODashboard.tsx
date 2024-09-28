"use client";
import React from "react";
import {
  FiChevronLeft,
  FiSearch,
  FiFilter,
  FiArrowDown,
  FiExternalLink,
} from "react-icons/fi";
import { dummyPAOs, PAOData } from "./dummyData";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

interface PAODashboardProps {
  id: string;
}

const PAODashHeader = function ({ paoData }: { paoData: PAOData }) {
  return (
    <>
      <header className="flex flex-wrap items-center mb-4 gap-2">
        <FiChevronLeft className="mr-2" />
        <h1 className="text-2xl font-bold">{paoData.daoName}</h1>
        <div className="ml-auto flex flex-wrap gap-2">
          <button className="bg-teal-900 shadow-md px-3 py-1 rounded text-sm">
            {paoData.shortcut} stats
          </button>
          <button className="bg-teal-900 shadow-md px-3 py-1 rounded text-sm">
            Members
          </button>
          <button className="bg-teal-900 shadow-md px-3 py-1 rounded text-sm">
            Params
          </button>
        </div>
      </header>

      <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-green-500 h-40 rounded-lg mb-4"></div>
    </>
  );
};

const PAODashProposals = function ({ paoData }: { paoData: PAOData }) {
  return (
    <div className="grid grid-cols-1 gap-4 bg-teal-900 p-6">
      <div className="lg:col-span-2">
        <div className="flex flex-wrap items-center mb-4 gap-2">
          <h2 className="text-lg font-semibold">Proposals</h2>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search Proposals"
                className="bg-teal-800 pl-10 pr-3 py-1 rounded text-sm w-full"
              />
            </div>
            <button className="bg-teal-800 px-3 py-1 rounded text-sm flex items-center">
              <FiFilter className="mr-1" /> Filter
            </button>
            <button className="bg-teal-800 px-3 py-1 rounded text-sm flex items-center">
              <FiArrowDown className="mr-1" /> Sorting
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {paoData.proposals.map((proposal, index) => (
            <div key={index} className="bg-teal-800 p-4 rounded-lg">
              <h3 className="font-semibold">{proposal.name}</h3>
              {proposal.votes && (
                <div className="mt-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      Yes Votes: {proposal.votes.yes.toLocaleString()} (100.0%)
                    </span>
                    <span>
                      No Votes: {proposal.votes.no.toLocaleString()} (0.0%)
                    </span>
                  </div>
                  <div className="bg-green-500 h-2 rounded-full mt-1"></div>
                </div>
              )}
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-400">{proposal.date}</span>
                <span className="text-sm text-green-500">
                  {proposal.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PAODashGovernancePower = function ({
  publicKey,
}: {
  publicKey: PublicKey | null;
}) {
  return (
    <div className="bg-teal-800 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-2">My Governance Power</h2>
      {publicKey ? (
        <div>See Governing power</div>
      ) : (
        <div>Connect Wallet to see voting power</div>
      )}
    </div>
  );
};

const PAODashNFT = function () {
  return (
    <div className="bg-teal-800 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-2">NFTs</h2>
    </div>
  );
};

const PAODashPAOAssets = function ({ paoData }: { paoData: PAOData }) {
  return (
    <div className="bg-teal-800 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-2">PAO Wallets & Assets</h2>
      <p className="text-2xl font-bold mb-4">
        Treasury Balance: {paoData.treasuryBalance}
      </p>
      {paoData.wallets.map((wallet, index) => (
        <div key={index} className="bg-teal-700 p-2 rounded mb-2">
          <p className="font-semibold">{wallet.name}</p>
          <p className="text-sm text-gray-400">{wallet.balance}</p>
          <p className="text-sm">{wallet.value}</p>
        </div>
      ))}
    </div>
  );
};

const PAODashPrograms = function ({ paoData }: { paoData: PAOData }) {
  return (
    <div className="bg-teal-800 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Programs</h2>
      {paoData.programs.map((program, index) => (
        <div key={index} className="flex items-center mb-2">
          <div className="bg-teal-700 p-2 rounded mr-2"></div>
          <div className="flex-grow">
            <p className="font-semibold">{program.name}</p>
            <p className="text-sm text-gray-400">{program.id}</p>
          </div>
          <FiExternalLink className="text-gray-400" />
        </div>
      ))}
    </div>
  );
};
const PAODashboard: React.FC<PAODashboardProps> = ({ id }) => {
  const walletData = useWallet();
  console.log(walletData.publicKey);
  const paoData = dummyPAOs.find((pao) => pao.id === id);

  if (!paoData) {
    return <div>PAO not found</div>;
  }

  return (
    <div className="bg-gradient-to-br from-teal-500 to-black text-white p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <PAODashHeader paoData={paoData} />
          <PAODashProposals paoData={paoData} />
        </div>

        <div className="space-y-4">
          <PAODashGovernancePower publicKey={walletData.publicKey} />
          <PAODashNFT />
          <PAODashPAOAssets paoData={paoData} />
          <PAODashPrograms paoData={paoData} />
        </div>
      </div>
    </div>
  );
};

export default PAODashboard;
