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
          Ana & William
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

    <section
      className="p-4 w-full bg-[#f7f7f7] flex flex-col items-center justify-center text-sm text-[#baaa9e] gap-2 py-12"
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, delay: 0.2 }}
        className={`text-6xl sm:text-8xl leading-[1.2] ${corinthia.className}`}
      >
        Cerimônia e Festa
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="text-sm font-light sm:text-base text-center max-w-3xl mb-4"
      >
        Gostaríamos muito de contar com a presença de todos vocês no momento em que nossa união será abençoada diante de Deus! A cerimônia será rápida e tentaremos ser extremamente pontuais. Contamos com vocês! <span className='text-lg font-semibold'>Dia 31 de março de 2027 às 19h</span>.

        <br />
        <br />
        Após a cerimônia, teremos uma festa para celebrar com todos os nossos amigos e familiares.
        A festa será realizada no mesmo local da cerimônia, <span className='text-lg font-semibold'>começando às 20h30</span>.
        <br />
        <br />
        Esperamos que todos possam comparecer e celebrar conosco este momento tão especial!
      </motion.p>

      <div className='flex gap-5 md:flex-row flex-col items-center justify-center'>
        <div className='text-center items-center justify-center flex flex-col gap-2'>
          <a
            href="https://www.google.com/maps?q=Paróquia+São+Francisco+de+Assis,+R.+Luís+de+Moura,+129+-+Cidade+Nova+Jacareí,+Jacareí+-+SP,+12325-180"
            target="_blank"
            rel="noopener noreferrer"
            className="block cursor-pointer hover:underline"
          >

            <p className='text-2xl font-semibold'>Cerimônia Religiosa</p>
            <p className='text-xl'>Paroquia São Francisco de Assis</p>
            <p className='text-lg'>R. Luís de Moura, 129 - Cidade Nova Jacareí, Jacareí - SP, 12325-180</p>
          </a>
          <iframe className='rounded-2xl' width="350" height="400" src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=R.%20Lu%C3%ADs%20de%20Moura,%20129%20-%20Cidade%20Nova%20Jacare%C3%AD,%20Jacare%C3%AD%20-%20SP,%2012325-180+(Par%C3%B3quia%20S%C3%A3o%20Francisco%20de%20Assis)&amp;t=&amp;z=16&amp;ie=UTF8&amp;iwloc=B&amp;output=embed">
          </iframe>
        </div>
        <div className='text-center items-center justify-center flex flex-col gap-2'>
          <a
            href="https://www.google.com/maps?q=Sitio+das+Palmeiras,+Estrada+São+Sebastião,+2235,+Jacareí,+SP"
            target="_blank"
            rel="noopener noreferrer"
            className="block cursor-pointer hover:underline"
          >
            <p className='text-2xl font-semibold'>Sitio das Palmeiras</p>
            <p className='text-xl'>Festa e Recepção</p>
            <p className='text-lg'>Estr. São Sebastião, 2235 - Macrozona Destinação Industrial (Carv. Pinto - São Silvestre), Jacareí - SP, 12340-530</p>
          </a>
          <iframe className='rounded-2xl' width="350" height="400" src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Estr.%20S%C3%A3o%20Sebasti%C3%A3o,%202235%20-%20Macrozona%20Destina%C3%A7%C3%A3o%20Industrial%20(Carv.%20Pinto%20-%20S%C3%A3o%20Silvestre),%20Jacare%C3%AD%20-%20SP,%2012340-530+(Sitio%20das%20Palmeiras)&amp;t=&amp;z=16&amp;ie=UTF8&amp;iwloc=B&amp;output=embed">
          </iframe>
        </div>
      </div>
    </section>

    <div
      id="confirmar"
      className='p-4 w-full bg-[#baaa9e] flex flex-col items-center justify-center text-sm text-[#f7f7f7] gap-2 py-12'>
      <div
        className="max-w-3xl w-full text-center mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 0.2 }}
          className={`text-6xl sm:text-8xl leading-[1.2] ${corinthia.className} text-[#f7f7f7]`}
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
