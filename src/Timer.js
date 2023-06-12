import React, { useState, useEffect } from 'react';
import './Timer.css';

const Timer = () => {
  const [timers, setTimers] = useState([]);
  const [newTimer, setNewTimer] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [selectedTimeZone, setSelectedTimeZone] = useState('');
  const [worldClockTime, setWorldClockTime] = useState('');

  // Countdown Timer Functions
  const addTimer = () => {
    const totalSeconds = newTimer.hours * 3600 + newTimer.minutes * 60 + newTimer.seconds;
    setTimers([...timers, { seconds: totalSeconds, remainingSeconds: totalSeconds, isRunning: false }]);
    setNewTimer({ hours: 0, minutes: 0, seconds: 0 });
  };

  const removeTimer = (index) => {
    const updatedTimers = [...timers];
    updatedTimers.splice(index, 1);
    setTimers(updatedTimers);
  };

  const startTimer = (timerIndex) => {
    const updatedTimers = [...timers];
    const timer = updatedTimers[timerIndex];
    timer.isRunning = true;
    updatedTimers[timerIndex] = timer;
    setTimers(updatedTimers);
  };

  const pauseResumeTimer = (timerIndex) => {
    const updatedTimers = [...timers];
    const timer = updatedTimers[timerIndex];
    timer.isRunning = !timer.isRunning;
    updatedTimers[timerIndex] = timer;
    setTimers(updatedTimers);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedTimers = timers.map((timer) => {
        if (timer.isRunning && timer.remainingSeconds > 0) {
          timer.remainingSeconds--;
        }
        return timer;
      });
      setTimers(updatedTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [timers]);

  // World Clock Function
  const fetchWorldClockTime = () => {
    const date = new Date().toLocaleString('en-US', {
      timeZone: selectedTimeZone,
      hour12: false,
    });
    setWorldClockTime(date);
  };

  useEffect(() => {
    if (selectedTimeZone) {
      fetchWorldClockTime();
      const interval = setInterval(() => {
        fetchWorldClockTime();
      }, 1000); // Fetch the time every second

      return () => clearInterval(interval);
    }
  }, [selectedTimeZone]);

  return (
    <div className="timer-container">
      <h2>Countdown Timer</h2>
      <div className="timer-form">
        <input
          type="number"
          min="0"
          max="23"
          value={newTimer.hours}
          onChange={(e) => setNewTimer({ ...newTimer, hours: parseInt(e.target.value, 10) })}
        />
        <span className="timer-label">Hours</span>
        <input
          type="number"
          min="0"
          max="59"
          value={newTimer.minutes}
          onChange={(e) => setNewTimer({ ...newTimer, minutes: parseInt(e.target.value, 10) })}
        />
        <span className="timer-label">Minutes</span>
        <input
          type="number"
          min="0"
          max="59"
          value={newTimer.seconds}
          onChange={(e) => setNewTimer({ ...newTimer, seconds: parseInt(e.target.value, 10) })}
        />
        <span className="timer-label">Seconds</span>
        <button onClick={addTimer}>Add Timer</button>
      </div>
      <ul className="timer-list">
        {timers.map((timer, index) => (
          <li key={index} className="timer-item">
            {timer.remainingSeconds > 0 ? (
              <>
                <span className="timer-value">{timer.remainingSeconds}s</span>
                {!timer.isRunning ? (
                  <button className="timer-button" onClick={() => startTimer(index)}>Start</button>
                ) : (
                  <button className="timer-button" onClick={() => pauseResumeTimer(index)}>Pause/Resume</button>
                )}
              </>
            ) : (
              <span className="timer-value">Timer Complete</span>
            )}
            <button className="timer-remove-button" onClick={() => removeTimer(index)}>Remove</button>
          </li>
        ))}
      </ul>

      <h2>World Clock</h2>
      <select
        value={selectedTimeZone}
        onChange={(e) => setSelectedTimeZone(e.target.value)}
      >
        <option value="">Select Time Zone</option>
        <option value="America/Los_Angeles">PST</option>
        <option value="Asia/Kolkata">IST</option>
      </select>
      {selectedTimeZone && (
        <p className="world-clock-time">
          Current Time in {selectedTimeZone}: {worldClockTime}
        </p>
      )}
    </div>
  );
};

export default Timer;
