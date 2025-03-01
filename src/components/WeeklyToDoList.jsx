import React, { useState, useRef, useEffect } from "react";
import tickIcon from "../assets/tick-icon.png";
import clickSound from "../assets/click-sound.mp3";

const daysOfWeek = [
  "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi/Pazar"
];

const WeeklyToDoList = () => {
  const initialTasks = () => {
    try {
      return JSON.parse(localStorage.getItem("weeklyTasks")) || {};
    } catch (error) {
      console.error("localStorage okuma hatası:", error);
      return {};
    }
  };

  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState({});
  const [isAdding, setIsAdding] = useState({});
  const inputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("weeklyTasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const addTask = (day) => {
    if (newTask[day]?.trim() === "") return;
    setTasks({
      ...tasks,
      [day]: [...(tasks[day] || []), { id: Date.now(), text: newTask[day], completed: false }]
    });
    setNewTask({ ...newTask, [day]: "" });
    setIsAdding({ ...isAdding, [day]: false });
  };

  const toggleTask = (day, id) => {
    setTasks({
      ...tasks,
      [day]: tasks[day].map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    });
  };

  const removeTask = (day, id) => {
    setTasks({
      ...tasks,
      [day]: tasks[day].filter(task => task.id !== id)
    });
  };

  const playClickSound = () => {
    const audio = new Audio(clickSound);
    audio.volume = 0.3;
    audio.play();
  };

  return (
    <div className="weekly-todo-grid">
      {daysOfWeek.map((day, index) => (
        <React.Fragment key={day}>
          <div className="todo-wrapper">
            <div className="weeklytodo-container">
              <h3>{day}</h3>
              <ul>
                {(tasks[day] || []).map(task => (
                  <li key={task.id} className={task.completed ? "completed" : ""}>
                    <div className="checkbox" onClick={() => { playClickSound(); toggleTask(day, task.id); }}>
                      {task.completed && <img src={tickIcon} alt="Checked" className="tick-icon" />}
                    </div>
                    <span className="weekly-task-text">{task.text}</span>
                    <button className="remove-btn" onClick={() => removeTask(day, task.id)}>✖</button>
                  </li>
                ))}
              </ul>
              <div className="add-task-container">
                {isAdding[day] && (
                  <div className="add-task">
                    <input
                      ref={inputRef}
                      type="text"
                      value={newTask[day] || ""}
                      onChange={(e) => setNewTask({ ...newTask, [day]: e.target.value })}
                      placeholder="Yeni görev"
                      className="task-input"
                    />
                    <button className="btn" onClick={() => addTask(day)}>Ekle</button>
                  </div>
                )}
                <button className={`add-btn ${isAdding[day] ? "rotate" : ""}`} onClick={() => setIsAdding({ ...isAdding, [day]: !isAdding[day] })}>✖</button>
              </div>
            </div>

            {/* Divider sadece Çarşamba ve Cumartesi/Pazar HARİÇ diğer günlerden sonra gelecek */}
            {!(day === "Çarşamba" || day === "Cumartesi/Pazar") && <div className="divider"></div>}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default WeeklyToDoList;
