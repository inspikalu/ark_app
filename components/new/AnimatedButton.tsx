// "use client";
// import React, { useState, useEffect } from "react";
// import dynamic from 'next/dynamic';
// import { motion } from "framer-motion";

// // Create a client-side only version of the motion.button
// const MotionButton = dynamic(
//   () => import("framer-motion").then((mod) => mod.motion.button),
//   { ssr: false }
// );

// interface ButtonProps {
//   loading: boolean;
//   onClick?: () => void;
// }

// const AnimatedButton: React.FC<ButtonProps> = ({ loading, onClick }) => {
//   const [isMounted, setIsMounted] = useState(false);

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   if (!isMounted) {
//     // Render a plain button if not mounted (server-side or initial client-side render)
//     return (
//       <button
//         type="submit"
//         className="w-full bg-teal-500 hover:bg-teal-400 text-white font-bold py-2 px-4 rounded"
//         disabled={loading}
//       >
//         {loading ? 'Creating...' : 'Create PAO'}
//       </button>
//     );
//   }

//   // Render the animated button once mounted (client-side only)
//   return (
//     <MotionButton
//       whileHover={{ scale: 0.98 }}
//       whileTap={{ scale: 0.95 }}
//       type="submit"
//       className="w-full bg-teal-500 hover:bg-teal-400 text-white font-bold py-2 px-4 rounded"
//       disabled={loading}
//       onClick={onClick}
//     >
//       {loading ? 'Creating...' : 'Create PAO'}
//     </MotionButton>
//   );
// };

// export default AnimatedButton;