'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiMenu, FiMessageSquare, FiUsers, FiFileText, FiChevronLeft, FiDollarSign, FiPlusCircle, FiInfo, FiCheckCircle, FiLock } from 'react-icons/fi';
import { useWallet } from '@solana/wallet-adapter-react';
import CreatePAOModal from './PAOModal';
import MessageInput from './MessageInput';
import WalletDisplay from './WalletDisplay';
import { IconType } from 'react-icons';
import { useRouter } from 'next/navigation';
import { PAO } from './Mock';
import ErrorBoundary from './ErrorBoundary';
import TreasurySection from './TreasurySection';
import ProposalSection from './ProposalSection';

interface Tab {
  id: string;
  icon: IconType;
  label: string;
}

interface PAOChatInterfaceProps {
  initialPAO: PAO | null;
  allPAOs: PAO[];
}

const PAOChatInterface: React.FC<PAOChatInterfaceProps> = ({ initialPAO, allPAOs }) => {
  const [selectedPAO, setSelectedPAO] = useState<PAO | null>(initialPAO);
  const [activeTab, setActiveTab] = useState<string>('chat');
  const [isCreatePAOModalOpen, setIsCreatePAOModalOpen] = useState<boolean>(false);
  const [isPAODetailsOpen, setIsPAODetailsOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const wallet = useWallet();
  const router = useRouter();

  const tabs: Tab[] = [
    { id: 'chat', icon: FiMessageSquare, label: 'Chat' },
    { id: 'proposals', icon: FiFileText, label: 'Proposals' },
    { id: 'members', icon: FiUsers, label: 'Members' },
    { id: 'treasuries', icon: FiDollarSign, label: 'Treasuries' },
  ];

  const togglePAODetails = (): void => setIsPAODetailsOpen(!isPAODetailsOpen);
  const toggleSidebar = (): void => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    if (selectedPAO) {
      router.push(`/chat/${selectedPAO.id}`);
    } else {
      router.push('/chat');
    }
  }, [selectedPAO, router]);

  const appStoreIcons = [
    { icon: FiCheckCircle, label: "Verify", route: "/verify" },
    { icon: FiLock, label: "Escrow", route: "/escrow" },
    { icon: FiDollarSign, label: "Treasury", route: "/multisig" },
  ];

  const renderMainContent = () => {
    if (!selectedPAO) {
      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center justify-center h-full bg-white"
        >
          <motion.h1 
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="text-4xl md:text-6xl font-bold text-teal-600 mb-8 text-center"
          >
            ARK, The Future of onchain governance
          </motion.h1>
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 5,
              ease: "easeInOut",
              times: [0, 0.2, 0.5, 0.8, 1],
              repeat: Infinity,
              repeatDelay: 1
            }}
            className="w-32 h-32 bg-teal-500 rounded-full"
          />
        </motion.div>
      );
    }

    return (
      <>
        <div className="flex-1 p-4 overflow-y-auto bg-white rounded-2xl m-2 shadow-inner">
          {activeTab === 'chat' && (
            <div className="space-y-4">
              <p className="text-center text-gray-500">
                This is the beginning of your conversation in {selectedPAO.name}
              </p>
              {/* Add chat messages here */}
            </div>
          )}
          {activeTab === 'proposals' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Active Proposals</h3>
              <ProposalSection />
            </div>
          )}
          {activeTab === 'members' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">PAO Members</h3>
              {/* Add member list here */}
            </div>
          )}
          {activeTab === 'treasuries' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">PAO Treasuries</h3>
              <TreasurySection />
            </div>
          )}
        </div>
        {activeTab === 'chat' && selectedPAO && <MessageInput />}
      </>
    );
  };

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-gradient-to-br from-teal-100 to-blue-100">
          {/* App Store Icons */}
          <div className="w-16 bg-white shadow-lg flex flex-col items-center py-4">
          {appStoreIcons.map((icon, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => router.push(icon.route)}
              className="cursor-pointer mb-4"
            >
              {React.createElement(icon.icon, { size: 24, className: "text-teal-600" })}
              <span className="text-xs text-center mt-1">{icon.label}</span>
            </motion.div>
          ))}
        </div>
        {/* Left Sidebar (Chat List) */}
        <motion.div 
          className="bg-white shadow-lg"
          initial={false}
          animate={{
            width: isSidebarOpen ? '20rem' : '0rem',
            opacity: isSidebarOpen ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          {isSidebarOpen && (
        <div className="w-80 bg-white shadow-lg">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-teal-600 mb-4">All PAOs</h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Search PAOs"
                className="w-full p-2 pl-8 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-label="Search PAOs"
              />
              <FiSearch className="absolute left-2 top-2.5 text-gray-400" size={20} />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreatePAOModalOpen(true)}
              className="mt-4 w-full bg-teal-500 text-white rounded-lg p-2 flex items-center justify-center"
              aria-label="Create New PAO"
            >
              <FiPlusCircle className="mr-2" />
              Create New PAO
            </motion.button>
          </div>
          <ul className="mt-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            {allPAOs.map((pao) => (
              <motion.li
                key={pao.id}
                whileHover={{ backgroundColor: '#f3f4f6' }}
                onClick={() => setSelectedPAO(pao)}
                className={`p-4 cursor-pointer rounded-lg m-2 ${selectedPAO?.id === pao.id ? 'bg-teal-100' : ''}`}
              >
                <h3 className="font-semibold text-gray-800">{pao.name}</h3>
                <p className="text-sm text-gray-500">{pao.lastMessage || 'No recent messages'}</p>
              </motion.li>
            ))}
          </ul>
        </div>
        )}
      </motion.div>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white shadow-sm p-4 flex items-center justify-between rounded-b-2xl">
            <div className="flex items-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleSidebar}
                className="mr-4"
                aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                {isSidebarOpen ? <FiChevronLeft size={24} /> : <FiMenu size={24} />}
              </motion.button>
              <h2 className="text-xl font-semibold text-gray-800 cursor-pointer" onClick={togglePAODetails}>
                {selectedPAO ? selectedPAO.name : 'Welcome to PAO Chat'}
              </h2>
              {selectedPAO && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={togglePAODetails}
                  className="ml-2"
                  aria-label="Toggle PAO details"
                >
                  <FiInfo size={20} />
                </motion.button>
              )}
            </div>
            <WalletDisplay wallet={wallet} />
          </header>

          {/* PAO Details */}
          <AnimatePresence>
            {isPAODetailsOpen && selectedPAO && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white p-4 shadow-md rounded-lg m-2"
              >
                <h3 className="text-lg font-semibold mb-2">{selectedPAO.name} Details</h3>
                <p>Governance Type: {selectedPAO.governanceType}</p>
                {/* Add more PAO details here */}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tabs */}
          {selectedPAO && (
            <nav className="bg-white shadow-sm rounded-t-2xl mt-2">
              <ul className="flex">
                {tabs.map((tab) => (
                  <li key={tab.id} className="flex-1">
                    <motion.button
                      whileHover={{ backgroundColor: '#f3f4f6' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full p-4 flex items-center justify-center ${
                        activeTab === tab.id ? 'border-b-2 border-teal-500' : ''
                      }`}
                      aria-label={tab.label}
                      aria-selected={activeTab === tab.id}
                    >
                      {React.createElement(tab.icon, { className: "mr-2", size: 20 })}
                      {tab.label}
                    </motion.button>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Main Content */}
          {renderMainContent()}
        </main>

        {/* Create PAO Modal */}
        <CreatePAOModal isOpen={isCreatePAOModalOpen} onClose={() => setIsCreatePAOModalOpen(false)} />
      </div>
    </ErrorBoundary>
  );
};

export default PAOChatInterface;

// const PAOChatInterface: React.FC<PAOChatInterfaceProps> = ({ initialPAO, allPAOs }) => {
//   const [selectedPAO, setSelectedPAO] = useState<PAO | null>(initialPAO);
//   const [activeTab, setActiveTab] = useState<string>('chat');
//   const [isCreatePAOModalOpen, setIsCreatePAOModalOpen] = useState<boolean>(false);
//   const [isPAODetailsOpen, setIsPAODetailsOpen] = useState<boolean>(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
//   const wallet = useWallet();
//   const router = useRouter();

//   const tabs: Tab[] = [
//     { id: 'chat', icon: FiMessageSquare, label: 'Chat' },
//     { id: 'proposals', icon: FiFileText, label: 'Proposals' },
//     { id: 'members', icon: FiUsers, label: 'Members' },
//     { id: 'treasuries', icon: FiDollarSign, label: 'Treasuries' },
//   ];

//   const togglePAODetails = (): void => setIsPAODetailsOpen(!isPAODetailsOpen);
//   // const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
//   const toggleSidebar = (): void => setIsSidebarOpen(!isSidebarOpen);

//   useEffect(() => {
//     if (selectedPAO) {
//       router.push(`/chat/${selectedPAO.id}`);
//     } else {
//       router.push('/chat');
//     }
//   }, [selectedPAO, router]);

//   const renderMainContent = () => {
//     if (!selectedPAO) {
//       return (
//         <motion.div 
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 1 }}
//           className="flex flex-col items-center justify-center h-full bg-white"
//         >
//           <motion.h1 
//             initial={{ y: -50 }}
//             animate={{ y: 0 }}
//             transition={{ type: "spring", stiffness: 100 }}
//             className="text-4xl md:text-6xl font-bold text-teal-600 mb-8 text-center"
//           >
//             ARK, The Future of onchain governance
//           </motion.h1>
//           <motion.div
//             animate={{
//               scale: [1, 1.1, 1],
//               rotate: [0, 5, -5, 0],
//             }}
//             transition={{
//               duration: 5,
//               ease: "easeInOut",
//               times: [0, 0.2, 0.5, 0.8, 1],
//               repeat: Infinity,
//               repeatDelay: 1
//             }}
//             className="w-32 h-32 bg-teal-500 rounded-full"
//           />
//         </motion.div>
//       );
//     }

//     return (
//       <>
//         <div className="flex-1 p-4 overflow-y-auto bg-white rounded-2xl m-2 shadow-inner">
//           {activeTab === 'chat' && (
//             <div className="space-y-4">
//               <p className="text-center text-gray-500">
//                 This is the beginning of your conversation in {selectedPAO.name}
//               </p>
//               {/* Add chat messages here */}
//             </div>
//           )}
//           {activeTab === 'proposals' && (
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold">Active Proposals</h3>
//               {/* Add proposal list here */}
//             </div>
//           )}
//           {activeTab === 'members' && (
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold">PAO Members</h3>
//               {/* Add member list here */}
//             </div>
//           )}
//           {activeTab === 'treasuries' && (
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold">PAO Treasuries</h3>
//               {/* Add treasuries information here */}
//             </div>
//           )}
//         </div>
//         {activeTab === 'chat' && selectedPAO && <MessageInput />}
//       </>
//     );
//   };

//   return (
//     <div className="flex h-screen bg-gradient-to-br from-teal-100 to-blue-100">
//       {/* Left Sidebar (Chat List) */}
//       <div className="w-80 bg-white shadow-lg">
//         <div className="p-4">
//           <h1 className="text-2xl font-bold text-teal-600 mb-4">All PAOs</h1>
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search PAOs"
//               className="w-full p-2 pl-8 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
//             />
//             <FiSearch className="absolute left-2 top-2.5 text-gray-400" size={20} />
//           </div>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => setIsCreatePAOModalOpen(true)}
//             className="mt-4 w-full bg-teal-500 text-white rounded-lg p-2 flex items-center justify-center"
//           >
//             <FiPlusCircle className="mr-2" />
//             Create New PAO
//           </motion.button>
//         </div>
//         <ul className="mt-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
//           {allPAOs.map((pao) => (
//             <motion.li
//               key={pao.id}
//               whileHover={{ backgroundColor: '#f3f4f6' }}
//               onClick={() => setSelectedPAO(pao)}
//               className={`p-4 cursor-pointer rounded-lg m-2 ${selectedPAO?.id === pao.id ? 'bg-teal-100' : ''}`}
//             >
//               <h3 className="font-semibold text-gray-800">{pao.name}</h3>
//               <p className="text-sm text-gray-500">{pao.lastMessage || 'No recent messages'}</p>
//             </motion.li>
//           ))}
//         </ul>
//       </div>

//       {/* Main Content Area */}
//       <main className="flex-1 flex flex-col">
//         {/* Header */}
//         <header className="bg-white shadow-sm p-4 flex items-center justify-between rounded-b-2xl">
//           <div className="flex items-center">
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={toggleSidebar}
//               className="mr-4"
//             >
//               {isSidebarOpen ? <FiChevronLeft size={24} /> : <FiMenu size={24} />}
//             </motion.button>
//             <h2 className="text-xl font-semibold text-gray-800 cursor-pointer" onClick={togglePAODetails}>
//               {selectedPAO ? selectedPAO.name : 'Welcome to PAO Chat'}
//             </h2>
//             {selectedPAO && (
//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={togglePAODetails}
//                 className="ml-2"
//               >
//                 <FiInfo size={20} />
//               </motion.button>
//             )}
//           </div>
//           <WalletDisplay wallet={wallet} />
//         </header>

//         {/* PAO Details */}
//         <AnimatePresence>
//           {isPAODetailsOpen && selectedPAO && (
//             <motion.div
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="bg-white p-4 shadow-md rounded-lg m-2"
//             >
//               <h3 className="text-lg font-semibold mb-2">{selectedPAO.name} Details</h3>
//               <p>Governance Type: {selectedPAO.governanceType}</p>
//               {/* Add more PAO details here */}
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Tabs */}
//         {selectedPAO && (
//           <nav className="bg-white shadow-sm rounded-t-2xl mt-2">
//             <ul className="flex">
//               {tabs.map((tab) => (
//                 <li key={tab.id} className="flex-1">
//                   <motion.button
//                     whileHover={{ backgroundColor: '#f3f4f6' }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => setActiveTab(tab.id)}
//                     className={`w-full p-4 flex items-center justify-center ${
//                       activeTab === tab.id ? 'border-b-2 border-teal-500' : ''
//                     }`}
//                   >
//                     {React.createElement(tab.icon, { className: "mr-2", size: 20 })}
//                     {tab.label}
//                   </motion.button>
//                 </li>
//               ))}
//             </ul>
//           </nav>
//         )}

//         {/* Main Content */}
//         {renderMainContent()}
//       </main>

//       {/* Create PAO Modal */}
//       <CreatePAOModal isOpen={isCreatePAOModalOpen} onClose={() => setIsCreatePAOModalOpen(false)} />
//     </div>
//   );
// };

// export default PAOChatInterface;

// OLD CODE
// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FiSearch, FiMenu, FiMessageSquare, FiUsers, FiFileText, FiChevronLeft, FiDollarSign, FiPlusCircle } from 'react-icons/fi';
// import { useWallet } from '@solana/wallet-adapter-react';
// import CreatePAOModal from './PAOModal';
// import MessageInput from './MessageInput';
// import WalletDisplay from './WalletDisplay';
// import { IconType } from 'react-icons';

// interface PAO {
//   id: number;
//   name: string;
//   lastMessage: string;
// }

// interface Tab {
//   id: string;
//   icon: IconType;
//   label: string;
// }

// const PAOChatInterface: React.FC = () => {
//   const [selectedPAO, setSelectedPAO] = useState<PAO | null>(null);
//   const [activeTab, setActiveTab] = useState<string>('chat');
//   const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
//   const [isCreatePAOModalOpen, setIsCreatePAOModalOpen] = useState<boolean>(false);
//   const wallet = useWallet();

//   const paoList: PAO[] = [
//     { id: 1, name: 'EcoDAO', lastMessage: 'New proposal: Solar Panel Initiative' },
//     { id: 2, name: 'TechPAO', lastMessage: 'Voting ends in 2 hours' },
//     { id: 3, name: 'ArtCollective', lastMessage: 'Fund allocation approved' },
//   ];

//   const tabs: Tab[] = [
//     { id: 'chat', icon: FiMessageSquare, label: 'Chat' },
//     { id: 'proposals', icon: FiFileText, label: 'Proposals' },
//     { id: 'members', icon: FiUsers, label: 'Members' },
//     { id: 'treasuries', icon: FiDollarSign, label: 'Treasuries' },
//   ];

//   const toggleSidebar = (): void => setIsSidebarOpen(!isSidebarOpen);

//   return (
//     <div className="flex h-screen bg-gradient-to-br from-teal-100 to-blue-100">
//       {/* Sidebar */}
//       <AnimatePresence>
//         {isSidebarOpen && (
//           <motion.aside
//             initial={{ width: 0 }}
//             animate={{ width: 300 }}
//             exit={{ width: 0 }}
//             className="bg-white shadow-lg rounded-r-2xl"
//           >
//             <div className="p-4">
//               <h1 className="text-2xl font-bold text-teal-600 mb-4">All PAOs</h1>
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search PAOs"
//                   className="w-full p-2 pl-8 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
//                 />
//                 <FiSearch className="absolute left-2 top-2.5 text-gray-400" size={20} />
//               </div>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setIsCreatePAOModalOpen(true)}
//                 className="mt-4 w-full bg-teal-500 text-white rounded-lg p-2 flex items-center justify-center"
//               >
//                 <FiPlusCircle className="mr-2" />
//                 Create New PAO
//               </motion.button>
//             </div>
//             <ul className="mt-2">
//               {paoList.map((pao) => (
//                 <motion.li
//                   key={pao.id}
//                   whileHover={{ backgroundColor: '#f3f4f6' }}
//                   onClick={() => setSelectedPAO(pao)}
//                   className="p-4 cursor-pointer rounded-lg m-2"
//                 >
//                   <h3 className="font-semibold text-gray-800">{pao.name}</h3>
//                   <p className="text-sm text-gray-500">{pao.lastMessage}</p>
//                 </motion.li>
//               ))}
//             </ul>
//           </motion.aside>
//         )}
//       </AnimatePresence>

//       {/* Main Content */}
//       <main className="flex-1 flex flex-col">
//         {/* Header */}
//         <header className="bg-white shadow-sm p-4 flex items-center justify-between rounded-b-2xl">
//           <div className="flex items-center">
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={toggleSidebar}
//               className="mr-4"
//             >
//               {isSidebarOpen ? <FiChevronLeft size={24} /> : <FiMenu size={24} />}
//             </motion.button>
//             <h2 className="text-xl font-semibold text-gray-800">
//               {selectedPAO ? selectedPAO.name : 'Welcome to PAO Chat'}
//             </h2>
//           </div>
//           <WalletDisplay wallet={wallet} />
//         </header>

//         {/* Tabs */}
//         <nav className="bg-white shadow-sm rounded-t-2xl mt-2">
//           <ul className="flex">
//             {tabs.map((tab) => (
//               <li key={tab.id} className="flex-1">
//                 <motion.button
//                   whileHover={{ backgroundColor: '#f3f4f6' }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`w-full p-4 flex items-center justify-center ${
//                     activeTab === tab.id ? 'border-b-2 border-teal-500' : ''
//                   }`}
//                 >
//                   {React.createElement(tab.icon, { className: "mr-2", size: 20 })}
//                   {tab.label}
//                 </motion.button>
//               </li>
//             ))}
//           </ul>
//         </nav>

//         {/* Content Area */}
//         <div className="flex-1 p-4 overflow-y-auto bg-white rounded-2xl m-2 shadow-inner">
//           {activeTab === 'chat' && (
//             <div className="space-y-4">
//               <p className="text-center text-gray-500">
//                 {selectedPAO
//                   ? `This is the beginning of your conversation in ${selectedPAO.name}`
//                   : 'Select a PAO to start chatting'}
//               </p>
//               {/* Add chat messages here */}
//             </div>
//           )}
//           {activeTab === 'proposals' && (
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold">Active Proposals</h3>
//               {/* Add proposal list here */}
//             </div>
//           )}
//           {activeTab === 'members' && (
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold">PAO Members</h3>
//               {/* Add member list here */}
//             </div>
//           )}
//           {activeTab === 'treasuries' && (
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold">PAO Treasuries</h3>
//               {/* Add treasuries information here */}
//             </div>
//           )}
//         </div>

//         {/* Message Input */}
//         {activeTab === 'chat' && (
//           <MessageInput />
//         )}
//       </main>

//       {/* Create PAO Modal */}
//       <CreatePAOModal isOpen={isCreatePAOModalOpen} onClose={() => setIsCreatePAOModalOpen(false)} />
//     </div>
//   );
// };

// export default PAOChatInterface;