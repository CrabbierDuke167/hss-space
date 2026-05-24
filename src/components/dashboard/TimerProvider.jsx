import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

const TimerContext = createContext({ h: 0, m: 0, s: 0 });

export const TimerProvider = ({ children }) => {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });
  const intervalRef = useRef(null);

  useEffect(() => {
    // Load existing session time if it exists
    const savedTime = sessionStorage.getItem('site_timer');
    if (savedTime) setTime(JSON.parse(savedTime));

    const startTimer = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      
      intervalRef.current = setInterval(() => {
        setTime(prev => {
          let { h, m, s } = prev;
          s++;
          if (s === 60) { s = 0; m++; }
          if (m === 60) { m = 0; h++; }
          const newTime = { h, m, s };
          sessionStorage.setItem('site_timer', JSON.stringify(newTime));
          return newTime;
        });
      }, 1000);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        clearInterval(intervalRef.current);
      } else {
        startTimer();
      }
    };

    // Start immediately
    startTimer();

    document.addEventListener("visibilitychange", handleVisibility);
    return () => { 
      document.removeEventListener("visibilitychange", handleVisibility); 
      clearInterval(intervalRef.current); 
    };
  }, []);

  return <TimerContext.Provider value={time}>{children}</TimerContext.Provider>;
};

export const useTimer = () => useContext(TimerContext);