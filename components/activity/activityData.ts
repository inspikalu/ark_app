// activityData.ts
'use client'
export interface ActivityItem {
    id: string;
    daoId: string;
    daoName: string;
    type: 'governance' | 'membership' | 'treasury' | 'token' | 'event' | 'system' | 'user' | 'milestone';
    title: string;
    description: string;
    timestamp: string;
    icon: string;
  }
  
  export const activityData: ActivityItem[] = [
    {
      id: '1',
      daoId: 'dao1',
      daoName: 'Father DAO',
      type: 'governance',
      title: 'Proposal Vote Concluded',
      description: 'Proposal #42 "Increase Treasury Allocation" has passed with 75% approval.',
      timestamp: '2024-09-17T14:30:00Z',
      icon: 'FiCheckCircle',
    },
    {
      id: '2',
      daoId: 'dao2',
      daoName: 'TechInnovators DAO',
      type: 'membership',
      title: 'New Member Joined',
      description: 'Alice (0x1234...abcd) has joined the DAO as a contributor.',
      timestamp: '2024-09-17T10:15:00Z',
      icon: 'FiUserPlus',
    },
    {
      id: '3',
      daoId: 'dao1',
      daoName: 'GreenEarth DAO',
      type: 'treasury',
      title: 'Treasury Transaction',
      description: 'Deposit of 1000 USDC received from fundraising campaign.',
      timestamp: '2024-09-16T18:45:00Z',
      icon: 'FiDollarSign',
    },
    {
      id: '4',
      daoId: 'dao3',
      daoName: 'Mother DAO',
      type: 'token',
      title: 'Tokens Minted',
      description: '10,000 ART tokens minted and distributed to new contributors.',
      timestamp: '2024-09-16T09:00:00Z',
      icon: 'FiPackage',
    },
    {
      id: '5',
      daoId: 'dao2',
      daoName: 'Aunty DAO',
      type: 'event',
      title: 'Upcoming Community Call',
      description: 'Monthly community call scheduled for September 20, 2024, at 15:00 UTC.',
      timestamp: '2024-09-15T12:00:00Z',
      icon: 'FiCalendar',
    },
  ];