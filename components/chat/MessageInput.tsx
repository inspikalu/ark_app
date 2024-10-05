'use client'
import React, { useState, useRef, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { FiSmile, FiPaperclip, FiMic, FiSend, FiX, FiFileText, FiCamera, FiImage, FiFile } from 'react-icons/fi';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import dynamic from 'next/dynamic';

const ReactMediaRecorder = dynamic(() => import('react-media-recorder').then(mod => mod.ReactMediaRecorder), {
  ssr: false
});

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState<string>('');
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [showActionButtons, setShowActionButtons] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage(prevMessage => prevMessage + emojiData.emoji);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // Implement file upload logic here
        console.log('File uploaded successfully:', file.name);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  return (
    <div className="p-4 bg-white border-t relative">
      <div className="flex items-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="mr-2"
          aria-label={showEmojiPicker ? "Close emoji picker" : "Open emoji picker"}
        >
          {showEmojiPicker ? <FiX /> : <FiSmile />}
        </motion.button>
        <input
          type="text"
          value={message}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          placeholder="Type a message..."
          className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          aria-label="Message input"
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowActionButtons(!showActionButtons)}
          className="ml-2"
          aria-label="Show action buttons"
        >
          <FiPaperclip />
        </motion.button>
        <ReactMediaRecorder
          render={({ status, startRecording, stopRecording }) => (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={status === 'recording' ? stopRecording : startRecording}
              className="ml-2"
              aria-label={status === 'recording' ? "Stop recording" : "Start recording"}
            >
              <FiMic color={status === 'recording' ? 'red' : 'black'} />
            </motion.button>
          )}
          audio
          onStop={(blobUrl) => console.log('Voice note recorded:', blobUrl)}
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSendMessage}
          className="ml-2"
          aria-label="Send message"
        >
          <FiSend />
        </motion.button>
      </div>
      {showEmojiPicker && (
        <div className="absolute bottom-full mb-2">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
      {showActionButtons && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-full mb-2 bg-white rounded-lg shadow-lg p-2 flex space-x-2"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => fileInputRef.current?.click()}
            className="p-2 bg-teal-100 rounded-full"
          >
            <FiCamera />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => fileInputRef.current?.click()}
            className="p-2 bg-teal-100 rounded-full"
          >
            <FiImage />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => fileInputRef.current?.click()}
            className="p-2 bg-teal-100 rounded-full"
          >
            <FiFile />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => fileInputRef.current?.click()}
            className="p-2 bg-teal-100 rounded-full"
            aria-label="Upload file"
          >
            <FiFileText />
          </motion.button>
        </motion.div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        style={{ display: 'none' }}
        multiple
      />
    </div>
  );
};

export default MessageInput;