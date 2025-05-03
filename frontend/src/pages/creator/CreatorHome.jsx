import React from 'react';
import { motion } from 'framer-motion';

const CreatorHome = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-8 rounded-2xl shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-white">Creator Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            className="bg-purple-900 bg-opacity-30 p-6 rounded-xl"
            whileHover={{ scale: 1.03 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-white">Content Management</h2>
            <p className="text-purple-100">Manage your created content, upload new media, and track performance.</p>
          </motion.div>
          
          <motion.div
            className="bg-purple-900 bg-opacity-30 p-6 rounded-xl"
            whileHover={{ scale: 1.03 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-white">Analytics</h2>
            <p className="text-purple-100">View detailed analytics about your content performance and audience engagement.</p>
          </motion.div>
          
          <motion.div
            className="bg-purple-900 bg-opacity-30 p-6 rounded-xl"
            whileHover={{ scale: 1.03 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-white">Community</h2>
            <p className="text-purple-100">Interact with your audience and collaborate with other creators.</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default CreatorHome;