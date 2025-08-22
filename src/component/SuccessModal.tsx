'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Questrial } from 'next/font/google';
import { corinthia } from '../app/fonts';

const questrial = Questrial({ subsets: ['latin'], weight: '400' });

export default function SuccessModal({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        className="fixed inset-0 z-40 bg-black/60"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="success-title"
                        className={`fixed left-1/2 top-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 text-center shadow-2xl ${questrial.className}`}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                    >
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 3, delay: 0.1 }}
                            className={`text-7xl sm:text-7xl leading-[1.2] mb-2 ${corinthia.className} font-bold text-[#baaa9e]`}
                        >
                            Ana & William
                        </motion.h1>

                        <h2 id="success-title" className="mb-1 text-xl font-semibold text-[#6b5c52]">
                            Confirmação enviada!
                        </h2>
                        <p className="mb-5 text-[#6b5c52]">
                            Cadastro realizado com sucesso. Em breve você receberá os{' '}
                            <strong>convites digitais</strong> pelo <strong>e-mail</strong> e{' '}
                            <strong>WhatsApp</strong> informados. 💌
                        </p>

                        <button
                            onClick={onClose}
                            className="w-full rounded-xl bg-[#baaa9e] px-4 py-3 font-bold text-white hover:opacity-90 active:opacity-80 transition"
                        >
                            Fechar
                        </button>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
