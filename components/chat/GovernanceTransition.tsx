'use client'

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { GovernanceType } from './Mock';


interface GovernanceTransitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGovernance: GovernanceType | undefined;
  onTransition: (newGovernance: GovernanceType) => void;
}




const governanceOptions: GovernanceType[] = [
  'Absolute-Monarchy',
  'Sociocracy',
  'Sortition',
  'Military-Junta',
  'Conviction',
  'Polycentric',
  'Flat',
];

const GovernanceTransitionModal: React.FC<GovernanceTransitionModalProps> = ({
  isOpen,
  onClose,
  currentGovernance,
  onTransition,
}) => {
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-teal-600">Change Governance</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>
            <p className="mb-4">Current Governance: <span className="font-semibold">{currentGovernance}</span></p>
            <div className="grid grid-cols-2 gap-4">
              {governanceOptions.map((option) => (
                <motion.button
                  key={option}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onTransition(option)}
                  className={`p-3 rounded-lg text-white font-semibold ${
                    option === currentGovernance ? 'bg-teal-600' : 'bg-teal-500 hover:bg-teal-600'
                  }`}
                  disabled={option === currentGovernance}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GovernanceTransitionModal;