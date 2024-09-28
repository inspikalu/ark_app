"use client"
import React, { useState, useEffect } from 'react';
import governanceStories from './governanceStories.json';

// Define the type for a single story
type Story = {
  model: string;
  story: string;
};

// Define the type for governanceStories
type GovernanceStories = {
  stories: Story[];
};

const DidYouKnowModal = ({ isLoading }: { isLoading: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);

  useEffect(() => {
    if (isLoading) {
      // Ensure governanceStories is typed correctly
      const stories = (governanceStories as GovernanceStories).stories;
      const randomStory = stories[Math.floor(Math.random() * stories.length)];
      setCurrentStory(randomStory);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [isLoading]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="modal-box relative bg-teal-800 p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 className="font-bold text-lg mb-2">Did You Know?</h3>
        <p className="py-4">{currentStory?.story}</p>
        <div className="modal-action">
          <button className="btn btn-primary hidden" onClick={() => setIsOpen(false)}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default DidYouKnowModal;
