'use client'
import React, { useRef, useState } from "react";
import { FiSearch, FiHelpCircle, FiPlusCircle, FiMessageCircle, FiFilter } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { motion } from "framer-motion";

export interface GoverningStructure {
  structureName: string;
  pathName: string;
  structureDescription: string;
}

export type GovernanceType = 
  | 'absolute-monarchy'
  | 'flat-dao'
  | 'military-junta'
  | 'conviction'
  | 'sortition'
  | 'polycentric'
  | 'sociocracy';

  export type InitializeKingdomArgs = {
    name: string;
    description: string;
    monarchName: string;
    divineMandate: string;
    collectionPrice: BN;
    nftSupply: BN;
    splSupply: BN;
    royalDecreeThreshold: BN;
    minLoyaltyAmount: BN;
    membershipTokensThreshold: BN;
    knighthoodPrice: BN;
    nftConfig: TokenConfig | null;
    splConfig: TokenConfig | null;
    primaryKingdomToken: PrimaryKingdomToken;
    initializeSbt: boolean;
  };

  export type DecreeType = 
  | { Law: {} }
  | { EconomicPolicy: {} }
  | { MilitaryOrder: {} }
  | { RoyalProclamation: {} };

  export type KingdomTokenType = {
    new: {}
  } | {
    existing: {}
  };
  
  export type PrimaryKingdomToken = {
    nft: {}
  } | {
    spl: {}
  };
  
  export type TokenConfig = {
    tokenType: KingdomTokenType;
    customMint: PublicKey | null;
  };

const governingStructures: GoverningStructure[] = [
  {
    "structureName": "Absolute Monarchy",
    "pathName": "absolute-monarchy",
    "structureDescription": "One person has total control over decisions, usually chosen by the community."
  },
  {
    "structureName": "Flat DAO",
    "pathName": "flat-dao",
    "structureDescription": "Everyone has an equal say, and decisions are made together with no leader."
  },
  {
    "structureName": "Military Junta",
    "pathName": "military-junta",
    "structureDescription": "A small, trusted group makes important decisions, especially during tough times."
  },
  {
    "structureName": "Conviction",
    "pathName": "conviction",
    "structureDescription": "Members show their support by staking tokens or votes, with decisions passed based on long-term backing."
  },
  {
    "structureName": "Sortition",
    "pathName": "sortition",
    "structureDescription": "Leaders or decision-makers are randomly picked, making it fair and unbiased."
  },
  {
    "structureName": "Polycentric",
    "pathName": "polycentric",
    "structureDescription": "Multiple groups make decisions independently, allowing for flexibility and avoiding central control."
  },
  {
    "structureName": "Sociocracy",
    "pathName": "sociocracy",
    "structureDescription": "Decisions are made in smaller, independent groups, with each group having the power to decide, ensuring everyone’s voice is heard."
  }
];

// interface CreatePAOModalProps {
//   modalRef: React.RefObject<HTMLDialogElement>;
//   onSelectGovernance: (governanceType: GovernanceType) => void;
// }


const LocationSearch = () => {
  return (
    <form className="w-full max-w-2xl">
      <div className="relative">
        <input
          type="search"
          id="location-search"
          className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
          placeholder="Search PAO directory"
          required
        />
        <button
          type="submit"
          className="text-white absolute right-2.5 bottom-2.5 bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800"
        >
          <FiSearch className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};

const ActionButton: React.FC<{ icon: React.ReactNode; text: string; onClick: () => void }> = ({ icon, text, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg shadow-lg hover:bg-teal-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
    onClick={onClick}
  >
    {icon}
    <span>{text}</span>
  </motion.button>
);

// const CreatePAOModal: React.FC<CreatePAOModalProps> = ({ modalRef, onSelectGovernance }) => {
//   return (
//     <dialog ref={modalRef} className="modal">
//       <div className="modal-box p-6 bg-gradient-to-br from-teal-500 to-teal-900 text-white">
//         <h3 className="font-bold text-lg">Choose Governance Model!</h3>
//         <ul>
//           {governingStructures.map((item, index) => (
//             <div key={`${item.structureName}${index}`}>
//               <li className="flex flex-row items-center justify-start gap-3 py-4">
//                 <button onClick={() => onSelectGovernance(item.pathName as GovernanceType)}>
//                   {item.structureName}
//                 </button>
//                 <div className="dropdown dropdown-hover">
//                   <div tabIndex={0} role="button"><FiHelpCircle size={20} /></div>
//                   <ul tabIndex={0} className="dropdown-content menu bg-teal-800 rounded-box z-[1] w-52 p-2 shadow">
//                     <li><a>{item.structureDescription}</a></li>
//                   </ul>
//                 </div>
//               </li>
//               {index < governingStructures.length - 1 && <hr />}
//             </div>
//           ))}
//         </ul>
//         <div className="modal-action">
//           <form method="dialog">
//             <button className="btn rounded-md bg-teal-800 hover:bg-teal-900 border-white">
//               Close
//             </button>
//           </form>
//         </div>
//       </div>
//     </dialog>
//   );
// };

// const DashSearch: React.FC = () => {
//   const modalRef = useRef<HTMLDialogElement>(null);
//   const router = useRouter();

//   const openModal = () => {
//     modalRef.current?.showModal();
//   };

//   const handleSelectGovernance = (governanceType: GovernanceType) => {
//     modalRef.current?.close();
//     router.push(`/new/${governanceType}`);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center">
//       <div className="w-full max-w-4xl p-6">
//         <div className="flex flex-col items-center justify-center gap-4">
//           <LocationSearch />
//           <div className="flex gap-4">
//             <button className="px-4 py-2 hover:text-teal-400 hover:bg-black rounded bg-teal-800 text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50">
//               Filter
//             </button>
//             <button
//               className="px-4 py-2 hover:text-teal-400 hover:bg-black rounded bg-teal-800 text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
//               onClick={openModal}
//             >
//               Create PAO
//             </button>
//           </div>
//           <CreatePAOModal modalRef={modalRef} onSelectGovernance={handleSelectGovernance} />
//         </div>
//       </div>
//     </div>
//   );
// };

const DashboardSearch: React.FC = () => {
  const governanceModalRef = useRef<HTMLDialogElement>(null);
  const managementModalRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [selectedManagement, setSelectedManagement] = useState<'chat' | 'dashboard' | null>(null);

  const openManagementModal = () => {
    managementModalRef.current?.showModal();
  };

  const handleManagementSelection = (type: 'chat' | 'dashboard') => {
    setSelectedManagement(type);
    managementModalRef.current?.close();
    // Use setTimeout to ensure the first modal is fully closed before opening the second
    setTimeout(() => {
      governanceModalRef.current?.showModal();
    }, 0);
  };

  const handleSelectGovernance = (governanceType: GovernanceType) => {
    governanceModalRef.current?.close();
    if (selectedManagement === 'chat') {
      // Route to the chat interface
      router.push(`/new/${governanceType}`);
    } else {
      // Route to the legacy dashboard
      router.push(`/new/${governanceType}`);
    }
  };

  const handleEnterPAOChat = () => {
    router.push('/chat');
  };

  const ManagementModal: React.FC = () => (
    <dialog ref={managementModalRef} className="modal">
      <div className="modal-box p-6 bg-gradient-to-br from-teal-500 to-teal-900 text-white">
        <h3 className="font-bold text-lg">Choose Management Interface</h3>
        <div className="flex flex-col gap-4 mt-4">
          <button
            onClick={() => handleManagementSelection('chat')}
            className="btn bg-teal-700 hover:bg-teal-600 text-white"
          >
            PAO Chat
          </button>
          <button
            onClick={() => handleManagementSelection('dashboard')}
            className="btn bg-teal-700 hover:bg-teal-600 text-white"
          >
            Legacy Dashboard
          </button>
        </div>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn rounded-md bg-teal-800 hover:bg-teal-900 border-white">
              Close
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );

  const GovernanceModal: React.FC = () => (
    <dialog ref={governanceModalRef} className="modal">
      <div className="modal-box p-6 bg-gradient-to-br from-teal-500 to-teal-900 text-white">
        <h3 className="font-bold text-lg">Choose Governance Model!</h3>
        <ul>
          {governingStructures.map((item, index) => (
            <div key={`${item.structureName}${index}`}>
              <li className="flex flex-row items-center justify-start gap-3 py-4">
                <button onClick={() => handleSelectGovernance(item.pathName as GovernanceType)}>
                  {item.structureName}
                </button>
                <div className="dropdown dropdown-hover">
                  <div tabIndex={0} role="button"><FiHelpCircle size={20} /></div>
                  <ul tabIndex={0} className="dropdown-content menu bg-teal-800 rounded-box z-[1] w-52 p-2 shadow">
                    <li><a>{item.structureDescription}</a></li>
                  </ul>
                </div>
              </li>
              {index < governingStructures.length - 1 && <hr />}
            </div>
          ))}
        </ul>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn rounded-md bg-teal-800 hover:bg-teal-900 border-white">
              Close
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );

  return (
    <div className="w-full bg-gradient-to-br from-teal-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center gap-12"
        >
          <h1 className="text-4xl font-bold text-center mb-4">Welcome to ARK🌊🚢</h1>
          <LocationSearch />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            <ActionButton
              icon={<FiPlusCircle className="w-6 h-6" />}
              text="Create PAO"
              onClick={openManagementModal}
            />
            <ActionButton
              icon={<FiMessageCircle className="w-6 h-6" />}
              text="Enter PAO Chat"
              onClick={handleEnterPAOChat}
            />
            <ActionButton
              icon={<FiFilter className="w-6 h-6" />}
              text="Filter PAOs"
              onClick={() => {/* Implement filter functionality */}}
            />
          </div>
        </motion.div>
      </div>
      <ManagementModal />
      <GovernanceModal />
    </div>
  );
};



export default DashboardSearch;
