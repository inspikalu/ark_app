'use client'
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface GoverningStructure {
  name: string;
  path: string;
}

const governingStructures: GoverningStructure[] = [
  { name: 'Absolute Monarchy', path: 'absolute-monarchy' },
  { name: 'Flat DAO', path: 'flat-dao' },
  { name: 'Military Junta', path: 'military-junta' },
  { name: 'Conviction', path: 'conviction' },
  { name: 'Sortition', path: 'sortition' },
  { name: 'Polycentric', path: 'polycentric' },
  { name: 'Sociocracy', path: 'sociocracy' },
];

interface CreatePAOModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePAOModal: React.FC<CreatePAOModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  const handleSelectGovernance = (governanceType: string): void => {
    void router.push(`/new/${governanceType}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-4">Create New PAO</h2>
            <p className="mb-4">Select a governance model for your new PAO:</p>
            <ul className="space-y-2">
              {governingStructures.map((structure) => (
                <li key={structure.path}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectGovernance(structure.path)}
                    className="w-full text-left p-2 rounded-lg hover:bg-teal-100 transition-colors"
                  >
                    {structure.name}
                  </motion.button>
                </li>
              ))}
            </ul>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="mt-6 w-full bg-teal-500 text-white rounded-lg p-2"
            >
              Cancel
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreatePAOModal;