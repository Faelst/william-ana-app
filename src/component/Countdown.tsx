'use client';

import { useEffect, useState } from 'react';

const targetDate = new Date('2025-10-25T00:00:00');

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        return;
      }

      const dias = Math.floor(difference / (1000 * 60 * 60 * 24));
      const horas = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutos = Math.floor((difference / (1000 * 60)) % 60);
      const segundos = Math.floor((difference / 1000) % 60);

      setTimeLeft({ dias, horas, minutos, segundos });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-2xl sm:text-3xl mt-2 text-[#baaa9e] flex items-center justify-center gap-2 font-bold">
      <div className="bg-[#f7f7f7] rounded-xl flex flex-col items-center justify-center p-4 w-20">
        <span>{timeLeft.dias}</span>
        <span className="text-xs font-light">DIAS</span>
      </div>
      <div className="bg-[#f7f7f7] rounded-xl flex flex-col items-center justify-center p-4 w-20">
        <span>{timeLeft.horas}</span>
        <span className="text-xs font-light">HORAS</span>
      </div>
      <div className="bg-[#f7f7f7] rounded-xl flex flex-col items-center justify-center p-4 w-20">
        <span>{timeLeft.minutos}</span>
        <span className="text-xs font-light">MINUTOS</span>
      </div>
      <div className="bg-[#f7f7f7] rounded-xl flex flex-col items-center justify-center p-4 w-20">
        <span>{timeLeft.segundos}</span>
        <span className="text-xs font-light">SEGUNDOS</span>
      </div>
    </div>
  );
}
