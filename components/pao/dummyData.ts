
export interface PAOData {
  id: string;
  daoName: string;
  shortcut: string;
  treasuryBalance: string;
  wallets: Array<{
    name: string;
    balance: string;
    value: string;
  }>;
  programs: Array<{
    name: string;
    id: string;
  }>;
  proposals: Array<{
    name: string;
    votes?: {
      yes: number;
      no: number;
    };
    status: string;
    date?: string;
  }>;
}

export const dummyPAOs: PAOData[] = [
  {
    id: "mango-dao",
    daoName: "Mango DAO",
    shortcut: "MNG",
    treasuryBalance: "$71,088,870.57",
    wallets: [
      { name: "Mango DAO MNGO Treasury Vault", balance: "2,732,352.737343413 MNGO", value: "$39,788,521" },
      { name: "a9fhz...DhmGA", balance: "64,097,701.039642 mangoSQL", value: "$13,771,231" },
      { name: "2mci2...mDP8z", balance: "4,012,200 CHAI", value: "$4,891,333" },
      { name: "Mango DAO CHAI Treasury", balance: "3,259,406.33994249 CHAI", value: "$3,971,231" },
    ],
    programs: [
      { name: "Mango v4 Program", id: "4Man...w6Vg" },
      { name: "Program", id: "62xN...dQrM" },
      { name: "Mango Governance Program", id: "GqTP...ph2i" },
    ],
    proposals: [
      { name: "Edit render perp oracle", votes: { yes: 107779899, no: 0 }, status: "Required approval achieved" },
      { name: "SEC Settlement Offer Proposal", status: "Completed", date: "a month ago" },
      { name: "Reset sb on demand oracles as fallback oracles in mango-v4", status: "Executable", date: "2 months ago" },
      { name: "Introduction Bounty for Head of Growth Role", status: "Completed" },
    ],
  },
  // Add more PAO data objects here as needed
];
