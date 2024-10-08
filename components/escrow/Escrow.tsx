import React, { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorProvider, Program, web3, Idl, BN } from '@coral-xyz/anchor';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDollarSign, FiUser, FiCalendar, FiCheckCircle, FiBook, FiX, FiList, FiCreditCard } from 'react-icons/fi';

// Import your IDL
import idl from '../../idl/standard.json';
import { ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';

const programID = new PublicKey("2eTVXGSKCaTaivadMawTEz3h14FLwhyGTY64UBYLyZ6p");

type StandardIDL = Idl & {
  accounts: {
    escrow: PublicKey;
    market: PublicKey;
    escrowList: EscrowList;
    paymentList: PaymentList;
  };
}

interface EscrowList {
  escrows: EscrowData[];
  bump: number;
}

interface PaymentList {
  payments: Payment[];
  bump: number;
}

const typedIdl = idl as StandardIDL;

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

interface EscrowData {
  sender: PublicKey;
  recipient: PublicKey;
  mint: PublicKey;
  amount: BN;
  condition: string;
  is_fulfilled: boolean;
  expiry_time: BN;
}

interface Payment {
  amount: BN;
  recipient: PublicKey;
  timestamp: BN;
}

;

const EscrowUI: React.FC = () => {
  const wallet = useAnchorWallet();
  const [provider, setProvider] = useState<AnchorProvider | null>(null);
  const [program, setProgram] = useState<Program<StandardIDL> | null>(null);
  const [transactionSignature, setTransactionSignature] = useState<string | null>(null);
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
  const [escrows, setEscrows] = useState<EscrowData[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (wallet) {
      const connection = new Connection("https://api.devnet.solana.com");
      const provider = new AnchorProvider(connection, wallet, {});
      setProvider(provider);
      setProgram(new Program<StandardIDL>(typedIdl, provider));
    }
  }, [wallet]);

  useEffect(() => {
    if (program && wallet) {
      fetchEscrows();
      fetchPayments();
    }
  }, [program, wallet]);

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
    setError(null);
    try {
      if (escrowType === 'conditional') {
        await createConditionalEscrow();
      } else if (escrowType === 'orderbook') {
        await placeOrder();
      }
      setEscrowType(null);
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const createConditionalEscrow = async (): Promise<void> => {
    if (!program || !wallet) return;

    const [escrowPDA] = await PublicKey.findProgramAddressSync(
      [
        Buffer.from("escrow"),
        wallet.publicKey.toBuffer(),
        new PublicKey(conditionalData.recipient).toBuffer(),
        new PublicKey("So11111111111111111111111111111111111111112").toBuffer() // Example: SOL mint
      ],
      program.programId
    );

    const [escrowTokenAccountPDA] = await PublicKey.findProgramAddressSync(
      [escrowPDA.toBuffer(), new PublicKey("So11111111111111111111111111111111111111112").toBuffer()],
      TOKEN_PROGRAM_ID
    );

    const [escrowListPDA] = await PublicKey.findProgramAddressSync(
      [Buffer.from("escrow_list")],
      program.programId
    );

    const tx = await program.methods.createConditionalEscrow(
      new BN(parseFloat(conditionalData.amount) * 1e9), // Convert to lamports
      conditionalData.condition,
      new BN(Date.parse(conditionalData.expiryTime) / 1000)
    )
    .accounts({
      escrow: escrowPDA,
      sender: wallet.publicKey,
      recipient: new PublicKey(conditionalData.recipient),
      mint: new PublicKey("So11111111111111111111111111111111111111112"),
      senderTokenAccount: await getAssociatedTokenAddress(
        new PublicKey("So11111111111111111111111111111111111111112"),
        wallet.publicKey,
      ),
      escrowTokenAccount: escrowTokenAccountPDA,
      escrowList: escrowListPDA,
      systemProgram: web3.SystemProgram.programId,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      rent: web3.SYSVAR_RENT_PUBKEY,
    })
    .rpc();

    setTransactionSignature(tx);
    console.log("Conditional escrow created successfully. Transaction signature:", tx);
    await fetchEscrows();
  };

  const placeOrder = async (): Promise<void> => {
    if (!program || !wallet) return;

    const marketKey = new PublicKey(orderBookData.market);

    const [escrowTokenAccountPDA] = await PublicKey.findProgramAddressSync(
      [marketKey.toBuffer(), program.programId.toBuffer()],
      TOKEN_PROGRAM_ID
    );

    const tx = await program.methods.placeOrder(
      { [orderBookData.side]: {} },
      new BN(parseFloat(orderBookData.amount) * 1e9), // Convert to lamports
      new BN(parseFloat(orderBookData.price) * 1e9) // Convert to lamports
    )
    .accounts({
      market: marketKey,
      owner: wallet.publicKey,
      ownerTokenAccount: await getAssociatedTokenAddress(
        marketKey,
        wallet.publicKey
      ),
      escrowTokenAccount: escrowTokenAccountPDA,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .rpc();

    setTransactionSignature(tx);
    console.log("Order placed successfully. Transaction signature:", tx);
  };

  const fetchEscrows = async (): Promise<void> => {
    if (!program || !wallet) return;

    const [escrowListPDA] = await PublicKey.findProgramAddressSync(
      [Buffer.from("escrow_list")],
      program.programId
    );

    try {
      
      const tx = await program.methods.listConditionalEscrows()
        .accounts({
          authority: wallet.publicKey,
          escrowList: escrowListPDA,
        })
        .rpc();
        const escrowListAccount = await (program as any).account.escrowList.fetch(escrowListPDA);

        if (escrowListAccount && escrowListAccount.escrows) {
          setEscrows(escrowListAccount.escrows);
        }
    } catch (error) {
      console.error("Error fetching escrows:", error);
      setError("Failed to fetch escrows");
    }
  };

  const fetchPayments = async (): Promise<void> => {
    if (!program || !wallet) return;

    const [paymentListPDA] = await PublicKey.findProgramAddressSync(
      [Buffer.from("payment_list")],
      program.programId
    );

    try {
      const tx = await program.methods.listReleasedPayments()
        .accounts({
          authority: wallet.publicKey,
          paymentList: paymentListPDA,
        })
        .rpc();

        const paymentListAccount = await (program as any).account.paymentList.fetch(paymentListPDA);

        if (paymentListAccount && paymentListAccount.payments) {
          // Set the payments into state
          setPayments(paymentListAccount.payments);
        }

      setPayments(paymentListAccount);
    } catch (error) {
      console.error("Error fetching payments:", error);
      setError("Failed to fetch payments");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-800 to-teal-300 p-8 text-white">
      <motion.h1 
        className="text-4xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        ARK Escrow
      </motion.h1>

      {!escrowType && (
        <motion.div
          className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center"
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

            {/* New sections for displaying escrows and payments */}
            <motion.div
        className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Escrows Section */}
        <motion.div
          className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-xl"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <FiList className="mr-2" /> Escrows
          </h2>
          <ul className="space-y-4">
            <AnimatePresence>
              {escrows.map((escrow, index) => (
                <motion.li
                  key={index}
                  className="bg-white bg-opacity-20 rounded-lg p-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <p><strong>Sender:</strong> {escrow.sender.toBase58().slice(0, 8)}...</p>
                  <p><strong>Recipient:</strong> {escrow.recipient.toBase58().slice(0, 8)}...</p>
                  <p><strong>Amount:</strong> {escrow.amount.toString()} SOL</p>
                  <p><strong>Condition:</strong> {escrow.condition}</p>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </motion.div>

               {/* Payments Section */}
               <motion.div
          className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-xl"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <FiCreditCard className="mr-2" /> Payments
          </h2>
          <ul className="space-y-4">
            <AnimatePresence>
              {payments.map((payment, index) => (
                <motion.li
                  key={index}
                  className="bg-white bg-opacity-20 rounded-lg p-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <p><strong>Recipient:</strong> {payment.recipient.toBase58().slice(0, 8)}...</p>
                  <p><strong>Amount:</strong> {payment.amount.toString()} SOL</p>
                  <p><strong>Timestamp:</strong> {new Date(payment.timestamp.toNumber() * 1000).toLocaleString()}</p>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </motion.div>
      </motion.div>

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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
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
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 text-gray-800">
                  {escrowType === 'conditional' ? 'Create Conditional Escrow' : 'Place Order'}
                </h2>

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
                        className="w-full text-black rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
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

      {error && (
        <motion.div 
          className="mt-4 p-4 bg-red-100 text-red-700 rounded flex items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FiX className="mr-2" /> {error}
        </motion.div>
      )}
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
  <div>
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
        className="pl-10 w-full text-black rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
        required
      />
    </div>
  </div>
);

export default EscrowUI;