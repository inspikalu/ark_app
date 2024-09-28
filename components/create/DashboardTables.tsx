import React from "react";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiDollarSign,
  FiAward,
  FiBarChart,
  FiChevronRight,
} from "react-icons/fi";
import { IconType } from "react-icons";
import { activityData } from "../activity/activityData";
import Link from "next/link";

type CardProps = {
  title: string;
  value: string | number;
  icon: IconType;
};

type PaoData = {
  id: string;
  title: string;
  members: string;
  treasury: string;
  votingSystem: string;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const cardData: CardProps[] = [
  { title: "Total PAOs", value: "1,234", icon: FiUsers },
  { title: "Largest Treasury", value: "$10M", icon: FiDollarSign },
  { title: "Active Users", value: "50,000", icon: FiUsers },
  { title: "Total TVL", value: "$100M", icon: FiBarChart },
];

const paoData: PaoData[] = [
  {
    id: "mother-dao",
    title: "Mother DAO",
    members: "5,778",
    treasury: "$8,000,000",
    votingSystem: "Conviction",
  },
  {
    id: "father-dao",
    title: "Father DAO",
    members: "7,234",
    treasury: "$12,500,000",
    votingSystem: "Quadratic Voting",
  },
  {
    id: "uncle-dao",
    title: "Uncle DAO",
    members: "6,345",
    treasury: "$10,200,000",
    votingSystem: "Conviction",
  },
];

const Card: React.FC<CardProps> = ({ title, value, icon: Icon }) => (
  <motion.div
    variants={itemVariants}
    className="bg-black bg-opacity-30 border-teal-500 rounded-lg p-4"
  >
    <h3 className="text-teal-300 flex items-center text-lg mb-2">
      <Icon className="mr-2" /> {title}
    </h3>
    <p className="text-3xl font-semibold text-white">{value}</p>
  </motion.div>
);

const RecentActiviy: React.FC = function() {
  return (
    <motion.div variants={itemVariants}>
      <h2 className="w-full text-center text-3xl text-teal-300 font-bold mb-[4rem]">
        Recent Activiy
      </h2>
      <ul>
        {activityData.map(function(item, index) {
          return (
            <motion.li
              whileHover={{
                x: 5,
              }}
              key={index}
              className="w-full flex items-center justify-between my-6 cursor-pointer"
            >
              <Link
                href={`/activity/${item.daoId}`}
                className="w-full flex items-center justify-between"
              >
                <span>
                  {item.description}({item.daoName})
                </span>
                <FiChevronRight />
              </Link>
            </motion.li>
          );
        })}
      </ul>
      <div className="w-full flex items-center justify-center">
        <Link
          href={"/activity"}
          className="text-white bg-teal-800 rounded-md p-4"
        >
          See all activities
        </Link>
      </div>
    </motion.div>
  );
};

const DashboardTables: React.FC = () => {
  return (
    <motion.div
      className="p-6 bg-gradient-to-br from-teal-500 to-teal-900 text-white min-h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div initial="hidden" animate="visible" className="">
        <div className="w-full my-8"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cardData.map((card, index) => (
            <Card
              key={index}
              title={card.title}
              value={card.value}
              icon={card.icon}
            />
          ))}
        </div>

        {/* Render the PAO sections */}
        <motion.div
          variants={itemVariants}
          className="mt-8 bg-black bg-opacity-30 border border-teal-500 rounded-lg p-6"
        >
          {paoData.map((pao, index) => (
            <>
              <Link href={`/pao/${pao.id}`}>
                <div key={index}>
                  <h3 className="text-teal-300 flex items-center text-xl mb-4 ">
                    <FiAward className="mr-2" /> {pao.title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-teal-300">Members</p>
                      <p className="text-2xl font-semibold text-white">
                        {pao.members}
                      </p>
                    </div>
                    <div>
                      <p className="text-teal-300">Treasury</p>
                      <p className="text-2xl font-semibold text-white">
                        {pao.treasury}
                      </p>
                    </div>
                    <div>
                      <p className="text-teal-300">Voting System</p>
                      <p className="text-2xl font-semibold text-white">
                        {pao.votingSystem}
                      </p>
                    </div>
                  </div>
                </div>
                {index !== paoData.length - 1 && <hr className="my-5" />}{" "}
              </Link>
            </>
          ))}
        </motion.div>
        <div className="w-full flex items-center justify-center mt-5 mb-[4rem]">
          <div className="join border-teal-900">
            <button className="join-item btn btn-active bg-teal-950">1</button>
            <button className="join-item btn bg-teal-800">2</button>
            <button className="join-item btn bg-teal-800">3</button>
            <button className="join-item btn bg-teal-800">4</button>
          </div>
        </div>
      </motion.div>

      <RecentActiviy />
    </motion.div>
  );
};

export default DashboardTables;
