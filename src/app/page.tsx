'use client';

import { motion } from 'framer-motion';
import { Corinthia, Questrial } from 'next/font/google';
import Countdown from '../component/Countdown';
import GuestConfirmationForm from '../component/FormularioConfirmacao';

const corinthia = Corinthia({ subsets: ['latin'], weight: '400' });
const questrial = Questrial({ subsets: ['latin'], weight: '400' });

export default function Home() {

  return (<>
    <div
      className={`min-h-screen w-full overflow-x-hidden bg-[#f7f7f7] flex flex-col items-center justify-center px-6 py-20 gap-10 ${questrial.className}`}
    >
      <div className="w-full max-w-[700px] flex flex-col items-center text-center text-[#baaa9e]">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="uppercase text-xl tracking-[0.2em]"
        >
          Save the date
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 3, delay: 0.1 }}
          className={`text-6xl sm:text-9xl leading-[1.2] mb-4 ${corinthia.className} font-bold`}
        >
          William & Ana
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-2xl sm:text-3xl tracking-[0.3em] mb-6"
        >
          25 . 10 . 2025
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="w-40 h-[2px] bg-[#baaa9e] mb-4 origin-center"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-lg tracking-widest"
        >
          JACAREÍ - SP
        </motion.p>
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 300 }}
        onClick={() => {
          const el = document.getElementById('confirmar');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        className="mt-6 px-8 py-4 rounded-full bg-white text-[#baaa9e] font-bold shadow-xl hover:bg-[#f1f1f1] active:scale-95 transition duration-200"
      >
        Confirmar Minha Presença
      </motion.button>
    </div>
    <div className='w-full bg-[#baaa9e] flex flex-col items-center justify-center text-sm text-white gap-2 py-12'>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className={`text-6xl sm:text-8xl leading-[1.2] ${corinthia.className}`}
      >
        Contagem Regressiva
      </motion.h1>


      <Countdown />
    </div>
    <div
      id="confirmar"
      className='p-4 w-full bg-[#f7f7f7] flex flex-col items-center justify-center text-sm text-[#baaa9e] gap-2 py-12'>
      <div
        className="max-w-3xl w-full text-center mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 0.2 }}
          className={`text-6xl sm:text-8xl leading-[1.2] ${corinthia.className}`}
        >
          Confirme sua presença
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-sm font-light sm:text-base"
        >
          Por que pedimos seu telefone ou e-mail? <br />
          Para que possamos enviar o convite digital e avisos importantes sobre a cerimônia e a festa. Sua confirmação só será válida com pelo menos um desses contatos.
        </motion.p>
      </div>

      <GuestConfirmationForm />
    </div>
  </>
  );
}
