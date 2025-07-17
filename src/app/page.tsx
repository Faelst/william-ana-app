'use client';

import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-[700px] flex flex-col items-center text-center text-[#baaa9e]">
        {/* Save the date */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="uppercase text-lg tracking-widest font-['Questrial'] mb-2"
        >
          Save the date
        </motion.p>

        {/* Nomes dos noivos */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-6xl sm:text-8xl font-['Corinthia'] leading-[1.2] mb-4"
        >
          William & Ana
        </motion.h1>

        {/* Data */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-xl sm:text-2xl tracking-[0.3em] font-['Questrial'] mb-6"
        >
          25 . 10 . 2025
        </motion.p>

        {/* Linha horizontal */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="w-40 h-[2px] bg-[#baaa9e] mb-4 origin-center"
        />

        {/* Local */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-md sm:text-lg font-['Questrial'] tracking-widest"
        >
          JACAREÍ - SP
        </motion.p>
      </div>
    </div>
  );
}
