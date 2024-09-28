import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import * as FiIcons from "react-icons/fi";
import { activityData, ActivityItem } from "./activityData";

interface RecentActivityProps {
  id?: string; // Optional id prop
}

const RecentActivity: React.FC<RecentActivityProps> = ({ id }) => {
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Filter activities based on the provided id
  const relevantActivities = id
    ? activityData.filter(item => item.daoId === id)
    : activityData;

  const daos = useMemo(() => {
    const daoSet = new Set(relevantActivities.map((item) => item.daoId));
    return Array.from(daoSet).map((daoId) => {
      const dao = relevantActivities.find((item) => item.daoId === daoId);
      return { id: daoId, name: dao?.daoName };
    });
  }, [relevantActivities]);

  const filteredData = relevantActivities.filter(
    (item) => typeFilter === "all" || item.type === typeFilter
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="bg-teal-800 text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">
        Recent Activity {id ? `for ${daos[0]?.name}` : ''}
      </h2>
      <div className="mb-4 flex space-x-4">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-teal-700 text-white p-2 rounded"
        >
          <option value="all">All Types</option>
          <option value="governance">Governance</option>
          <option value="membership">Membership</option>
          <option value="treasury">Treasury</option>
          <option value="token">Token</option>
          <option value="event">Event</option>
        </select>
        {!id && (
          <select
            onChange={(e) => window.location.href = `/dao/${e.target.value}`}
            className="bg-teal-700 text-white p-2 rounded"
          >
            <option value="">Select a DAO</option>
            {daos.map((dao) => (
              <option key={dao.id} value={dao.id}>
                {dao.name}
              </option>
            ))}
          </select>
        )}
      </div>
      <motion.ul
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {filteredData.map((item: ActivityItem) => (
          <motion.li
            key={item.id}
            variants={itemVariants}
            className="bg-teal-700 p-4 rounded-lg flex items-start"
          >
            <div className="mr-4">
              {React.createElement(FiIcons[item.icon as keyof typeof FiIcons], {
                size: 24,
              })}
            </div>
            <div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-teal-300">{item.description}</p>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-teal-400">
                  {new Date(item.timestamp).toLocaleString()}
                </span>
                {!id && (
                  <span className="text-xs font-semibold text-teal-200">
                    {item.daoName}
                  </span>
                )}
              </div>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
};

export default RecentActivity;