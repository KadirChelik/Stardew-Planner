
import FlipcardClock from './FlipcardClock';
import { useState, useEffect } from 'react';

export default function RealTimeClock() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  function updateTime() {
    const now = new Date();
    
    const displayedHours = now.getHours();
    const displayedMinutes = now.getMinutes();
    const displayedSeconds = now.getSeconds();

    setHours(displayedHours);
    setMinutes(displayedMinutes);
    setSeconds(displayedSeconds);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      updateTime();
    }, 1000);

    return () => clearInterval(interval); // Temizleme işlemi
  }, []);

  return (
    <div className="clock-container">
      <FlipcardClock measure={'Saat'} time={hours} />
      <FlipcardClock measure={'Dakika'} time={minutes} />
      <FlipcardClock measure={'Saniye'} time={seconds} />
    </div>
  );
}