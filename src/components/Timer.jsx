import Flipcard from './Flipcard';
import { useState, useEffect } from 'react';
import arrowup from '../assets/arrow.png';
import arrowdown from '../assets/arrow-down.png';
import clickSound from "../assets/click-sound.mp3";

export default function Timer() {
  const getStoredValue = (key, defaultValue) => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  };

  const [inputHours, setInputHours] = useState(getStoredValue("inputHours", 0));
  const [inputMinutes, setInputMinutes] = useState(getStoredValue("inputMinutes", 0));
  const [inputSeconds, setInputSeconds] = useState(getStoredValue("inputSeconds", 0));

  const [hours, setHours] = useState(getStoredValue("hours", 0));
  const [minutes, setMinutes] = useState(getStoredValue("minutes", 0));
  const [seconds, setSeconds] = useState(getStoredValue("seconds", 0));

  const [destinationTime, setDestinationTime] = useState(getStoredValue("destinationTime", 0));
  const [isRunning, setIsRunning] = useState(getStoredValue("isRunning", false));

  useEffect(() => {
    localStorage.setItem("inputHours", JSON.stringify(inputHours));
    localStorage.setItem("inputMinutes", JSON.stringify(inputMinutes));
    localStorage.setItem("inputSeconds", JSON.stringify(inputSeconds));
  }, [inputHours, inputMinutes, inputSeconds]);

  useEffect(() => {
    localStorage.setItem("hours", JSON.stringify(hours));
    localStorage.setItem("minutes", JSON.stringify(minutes));
    localStorage.setItem("seconds", JSON.stringify(seconds));
    localStorage.setItem("isRunning", JSON.stringify(isRunning));
  }, [hours, minutes, seconds, isRunning]);

  useEffect(() => {
    if (!isRunning) return;

    const updateTimer = () => {
      const timeGap = destinationTime - Date.now();

      if (timeGap <= 0) {
        alert('Süre bitti!');
        setIsRunning(false);
        resetTimer();
        return;
      }

      const second = 1000;
      const minute = second * 60;
      const hour = minute * 60;

      const displayedHours = Math.floor((timeGap % (hour * 24)) / hour);
      const displayedMinutes = Math.floor((timeGap % hour) / minute);
      const displayedSeconds = Math.floor((timeGap % minute) / second);

      setHours(displayedHours);
      setMinutes(displayedMinutes);
      setSeconds(displayedSeconds);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [isRunning, destinationTime]);

  const startTimer = () => {
    const totalTime = (inputHours * 60 * 60 + inputMinutes * 60 + inputSeconds) * 1000;
    if (totalTime <= 0) {
      alert('Lütfen geçerli bir süre girin.');
      return;
    }
    const newDestinationTime = Date.now() + totalTime;
    setDestinationTime(newDestinationTime);
    localStorage.setItem("destinationTime", JSON.stringify(newDestinationTime));

    setHours(inputHours);
    setMinutes(inputMinutes);
    setSeconds(inputSeconds);
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setHours(inputHours);
    setMinutes(inputMinutes);
    setSeconds(inputSeconds);
    setDestinationTime(0);
    localStorage.removeItem("destinationTime");
  };

  const increment = (type) => {
    if (isRunning) return;
    if (type === 'hours') {
      setInputHours((prev) => prev + 1);
    } else if (type === 'minutes') {
      setInputMinutes((prev) => (prev + 1) % 60);
    } else if (type === 'seconds') {
      setInputSeconds((prev) => (prev + 1) % 60);
    }
  };

  const decrement = (type) => {
    if (isRunning) return;
    if (type === 'hours') {
      setInputHours((prev) => Math.max(0, prev - 1));
    } else if (type === 'minutes') {
      setInputMinutes((prev) => Math.max(0, prev - 1));
    } else if (type === 'seconds') {
      setInputSeconds((prev) => Math.max(0, prev - 1));
    }
  };

  const playClickSound = () => {
    const audio = new Audio(clickSound);
    audio.volume = 0.3;
    audio.play();
  };

  return (
    <div className="timer-container">
      <div className="timer-display">
        <Flipcard measure={'Saat'} time={hours} />
        <Flipcard measure={'Dakika'} time={minutes} />
        <Flipcard measure={'Saniye'} time={seconds} />
      </div>
      <div className="timer-inputs">
        {['hours', 'minutes', 'seconds'].map((type) => (
          <div className="input-wrapper" key={type}>
            <button className="increment-button" onClick={() => { playClickSound(); increment(type); }}>
              <img src={arrowup} alt="" />
            </button>
            <input
              type="number"
              placeholder={type}
              value={type === 'hours' ? inputHours : type === 'minutes' ? inputMinutes : inputSeconds}
              onChange={(e) => {
                const value = Math.max(0, parseInt(e.target.value, 10) || 0);
                type === 'hours' ? setInputHours(value) : type === 'minutes' ? setInputMinutes(value) : setInputSeconds(value);
              }}
            />
            <button className="decrement-button" onClick={() => { playClickSound(); decrement(type); }}>
              <img src={arrowdown} alt="" />
            </button>
          </div>
        ))}
      </div>
      <div className="timer-buttons">
        <button className="btn" onClick={() => { playClickSound(); startTimer(); }} disabled={isRunning}>Başlat</button>
        <button className="btn" onClick={() => { playClickSound(); stopTimer(); }} disabled={!isRunning}>Durdur</button>
        <button className="btn" onClick={() => { playClickSound(); resetTimer(); }}>Sıfırla</button>
      </div>
    </div>
  );
}
