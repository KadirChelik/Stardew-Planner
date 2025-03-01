import Flipcard from './Flipcard';
import { useState, useEffect } from 'react';
import plus from "../assets/plus-button.png";
import minus from "../assets/minus-button.png";
import clickSoundFile from "../assets/click-sound.mp3";

export default function PomodoroTimer() {
  // LocalStorage'dan verileri çek
  const getStoredValue = (key, defaultValue) => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  };

  const [sessionLength, setSessionLength] = useState(getStoredValue("sessionLength", 25));
  const [breakLength, setBreakLength] = useState(getStoredValue("breakLength", 5));
  const [timeLeft, setTimeLeft] = useState(getStoredValue("timeLeft", sessionLength * 60));
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);

  // **Verileri LocalStorage'a Kaydet**
  useEffect(() => {
    localStorage.setItem("sessionLength", JSON.stringify(sessionLength));
    localStorage.setItem("breakLength", JSON.stringify(breakLength));
  }, [sessionLength, breakLength]);

  useEffect(() => {
    if (!isRunning) {
      localStorage.setItem("timeLeft", JSON.stringify(timeLeft));
    }
  }, [timeLeft, isRunning]);

  // Tıklama sesi oynatma
  const playClickSound = () => {
    const audio = new Audio(clickSoundFile);
    audio.volume = 0.3;
    audio.play();
  };

  const incrementSession = () => {
    if (sessionLength < 60) {
      const newSessionLength = sessionLength + 1;
      setSessionLength(newSessionLength);
      if (!isRunning && isSession) {
        setTimeLeft(newSessionLength * 60);
      }
      playClickSound();
    }
  };

  const decrementSession = () => {
    if (sessionLength > 1) {
      const newSessionLength = sessionLength - 1;
      setSessionLength(newSessionLength);
      if (!isRunning && isSession) {
        setTimeLeft(newSessionLength * 60);
      }
      playClickSound();
    }
  };

  const incrementBreak = () => {
    if (breakLength < 60) {
      setBreakLength(breakLength + 1);
      playClickSound();
    }
  };

  const decrementBreak = () => {
    if (breakLength > 1) {
      setBreakLength(breakLength - 1);
      playClickSound();
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
    playClickSound();
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(sessionLength * 60);
    setIsSession(true);
    playClickSound();
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(prevTime => {
          const newTime = prevTime - 1;
          localStorage.setItem("timeLeft", JSON.stringify(newTime));
          return newTime;
        });
      }, 1000);
      return () => clearInterval(interval);
    } else if (isRunning && timeLeft === 0) {
      setIsSession(!isSession);
      setTimeLeft(isSession ? breakLength * 60 : sessionLength * 60);
    }
  }, [isRunning, timeLeft, isSession, sessionLength, breakLength]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="pomodoro-container">
      <div className="pomodoro-clock">
        <div className="timer">
          <div className="middle">
            <div className="mode">
              <div className="mode-text">
                {isSession ? 'Oturum' : 'Mola'}
              </div>
            </div>
            <div className="pomodoro-clock">
              <Flipcard measure={'Dakika'} time={minutes} />
              <Flipcard measure={'Saniye'} time={seconds} />
            </div>
          </div>
        </div>
      </div>

      <div className="length-container">
        <div className="session-length">
          <div className='pomodoro-text'>Oturum Süresi</div>
          <div className="buttons-container">
            <button className="btn btn-default" onClick={decrementSession}>
              <img src={minus} alt="" />
            </button>
            <div className="col-md-2">
              <div id="session">{sessionLength}</div>
            </div>
            <button className="btn btn-default" onClick={incrementSession}>
              <img src={plus} alt="" />
            </button>
          </div>
        </div>

        <div className="break-length">
          <div className='pomodoro-text'>Mola Süresi</div>
          <div className="buttons-container">
            <button className="btn btn-default" onClick={decrementBreak}>
              <img src={minus} alt="" />
            </button>
            <div className="col-md-2">
              <div id="break">{breakLength}</div>
            </div>
            <button className="btn btn-default" onClick={incrementBreak}>
              <img src={plus} alt="" />
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="timer-buttons">
          <button className="btn btn-default btn-lg" onClick={toggleTimer}>
            {isRunning ? 'Durdur' : 'Başlat'}
          </button>
          <button className="btn btn-default btn-lg" onClick={resetTimer}>
            Sıfırla
          </button>
        </div>
      </div>
    </div>
  );
}
