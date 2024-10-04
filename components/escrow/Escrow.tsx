'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { FiDollarSign, FiUser, FiCalendar, FiCheckCircle, FiArrowUpCircle, FiArrowDownCircle, FiBook, FiX } from 'react-icons/fi';

type EscrowType = 'conditional' | 'orderbook' | null;

interface ConditionalEscrowData {
  amount: string;
  recipient: string;
  condition: string;
  expiryTime: string;
}

interface OrderBookData {
  market: string;
  side: 'buy' | 'sell';
  amount: string;
  price: string;
}

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const transition = { duration: 0.3 };

const BackgroundAnimation: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-800 to-teal-200" />
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-white rounded-full"
          style={{
            width: Math.random() * 20 + 10,
            height: Math.random() * 20 + 10,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, Math.random() * 100 - 50],
            x: [0, Math.random() * 100 - 50],
            scale: [1, Math.random() + 0.5, 1],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );
};

const EscrowUI: React.FC = () => {
  const [escrowType, setEscrowType] = useState<EscrowType>(null);
  const [conditionalData, setConditionalData] = useState<ConditionalEscrowData>({
    amount: '',
    recipient: '',
    condition: '',
    expiryTime: '',
  });
  const [orderBookData, setOrderBookData] = useState<OrderBookData>({
    market: '',
    side: 'buy',
    amount: '',
    price: '',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleConditionalInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setConditionalData(prev => ({ ...prev, [name]: value }));
  };

  const handleOrderBookInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setOrderBookData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (escrowType === 'conditional') {
        // Call to Solana program to create conditional escrow
        console.log('Creating conditional escrow:', conditionalData);
      } else if (escrowType === 'orderbook') {
        // Call to Solana program to place order
        console.log('Placing order:', orderBookData);
      }
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Reset form
      setEscrowType(null);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4 sm:p-8">
      <BackgroundAnimation />
      
      <motion.h1 
        className="text-4xl sm:text-6xl font-bold text-white mb-6 sm:mb-12 text-center z-10"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Welcome to ARK Escrow
      </motion.h1>

      {!escrowType && (
        <motion.div
          className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.button
            className="bg-white text-purple-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-lg hover:bg-purple-100 transition duration-300 text-lg sm:text-xl font-semibold flex items-center justify-center"
            onClick={() => setEscrowType('conditional')}
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgb(255,255,255)" }}
            whileTap={{ scale: 0.95 }}
          >
            <FiCheckCircle className="mr-2" /> Conditional Escrow
          </motion.button>
          <motion.button
            className="bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-lg hover:bg-blue-100 transition duration-300 text-lg sm:text-xl font-semibold flex items-center justify-center"
            onClick={() => setEscrowType('orderbook')}
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgb(255,255,255)" }}
            whileTap={{ scale: 0.95 }}
          >
            <FiBook className="mr-2" /> Order Book
          </motion.button>
        </motion.div>
      )}

      <AnimatePresence>
        {escrowType && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-md w-full relative"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={fadeInUp}
              transition={transition}
            >
              <motion.button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setEscrowType(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiX size={24} />
              </motion.button>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <motion.h2 
                  className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6"
                  variants={fadeInUp}
                  transition={transition}
                >
                  {escrowType === 'conditional' ? 'Create Conditional Escrow' : 'Place Order'}
                </motion.h2>

                {escrowType === 'conditional' ? (
                  <>
                    <InputField
                      label="Amount"
                      name="amount"
                      type="number"
                      value={conditionalData.amount}
                      onChange={handleConditionalInputChange}
                      icon={<FiDollarSign />}
                    />
                    <InputField
                      label="Recipient"
                      name="recipient"
                      type="text"
                      value={conditionalData.recipient}
                      onChange={handleConditionalInputChange}
                      icon={<FiUser />}
                    />
                    <InputField
                      label="Condition"
                      name="condition"
                      type="text"
                      value={conditionalData.condition}
                      onChange={handleConditionalInputChange}
                      icon={<FiCheckCircle />}
                    />
                    <InputField
                      label="Expiry Time"
                      name="expiryTime"
                      type="datetime-local"
                      value={conditionalData.expiryTime}
                      onChange={handleConditionalInputChange}
                      icon={<FiCalendar />}
                    />
                  </>
                ) : (
                  <>
                    <InputField
                      label="Market"
                      name="market"
                      type="text"
                      value={orderBookData.market}
                      onChange={handleOrderBookInputChange}
                      icon={<FiBook />}
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Side</label>
                      <select
                        name="side"
                        value={orderBookData.side}
                        onChange={handleOrderBookInputChange}
                        className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
                        required
                      >
                        <option value="buy">Buy</option>
                        <option value="sell">Sell</option>
                      </select>
                    </div>
                    <InputField
                      label="Amount"
                      name="amount"
                      type="number"
                      value={orderBookData.amount}
                      onChange={handleOrderBookInputChange}
                      icon={<FiDollarSign />}
                    />
                    <InputField
                      label="Price"
                      name="price"
                      type="number"
                      value={orderBookData.price}
                      onChange={handleOrderBookInputChange}
                      icon={<FiDollarSign />}
                    />
                  </>
                )}

                <motion.button
                  type="submit"
                  className={`w-full ${escrowType === 'conditional' ? 'bg-purple-500 hover:bg-purple-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-6 py-3 rounded-lg shadow-lg transition duration-300 flex items-center justify-center text-lg font-semibold`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : (escrowType === 'conditional' ? 'Create Escrow' : 'Place Order')}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 flex space-x-4 z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <motion.div
          className="bg-white text-purple-500 p-3 sm:p-4 rounded-full shadow-lg"
          whileHover={{ scale: 1.1, rotate: 360 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <FiArrowUpCircle className="h-5 w-5 sm:h-6 sm:w-6" />
        </motion.div>
        <motion.div
          className="bg-white text-blue-500 p-3 sm:p-4 rounded-full shadow-lg"
          whileHover={{ scale: 1.1, rotate: -360 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <FiArrowDownCircle className="h-5 w-5 sm:h-6 sm:w-6" />
        </motion.div>
      </motion.div>
    </div>
  );
};

const InputField: React.FC<{
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
}> = ({ label, name, type, value, onChange, icon }) => (
  <motion.div variants={fadeInUp} transition={transition}>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <div className="absolute top-3 left-3 text-gray-400">
        {icon}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="pl-10 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
        required
      />
    </div>
  </motion.div>
);

export default EscrowUI;