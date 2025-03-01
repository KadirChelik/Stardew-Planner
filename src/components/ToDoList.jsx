import React, { useState, useRef, useEffect } from "react";
import tickIcon from "../assets/tick-icon.png"; // ✅ Pixel checkmark ikonu

import clickSound from "../assets/click-sound.mp3";
const ToDoList = () => {
  // localStorage'dan görevleri yükle
  let initialTasks;
  try {
    initialTasks = JSON.parse(localStorage.getItem("tasks")) || [
      { id: 1, text: "Mailleri Kontrol Et", completed: false },
      { id: 2, text: "Dişlerini Fırçala", completed: false }
    ];
  } catch (error) {
    console.error("localStorage'dan veri okunurken hata oluştu:", error);
    initialTasks = [
      { id: 1, text: "Mailleri Kontrol Et", completed: false },
      { id: 2, text: "Dişlerini Fırçala", completed: false }
    ];
  }

  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const inputRef = useRef(null);

  // Görevler her değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const addTask = () => {
    if (newTask.trim() === "") return;
    setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
    setNewTask("");
    setIsAdding(false);
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };
  const playClickSound = () => {
      const audio = new Audio(clickSound);
      audio.volume = 0.3;
      audio.play();
    };

  return (
    <div className="todo-container">
      <h3>Yapılacaklar Listesi</h3>
      <ul>
        {tasks.map(task => (
          <li key={task.id} className={task.completed ? "completed" : ""}>
            <div className="checkbox" onClick={() =>{playClickSound()
               toggleTask(task.id)}}>
              {task.completed && <img src={tickIcon} alt="Checked" className="tick-icon" />}
            </div>
            <span className="task-text">{task.text}</span>
            <button className="remove-btn" onClick={() => removeTask(task.id)}>✖</button>
          </li>
        ))}
      </ul>

      <div className="add-task-container">
        {isAdding && (
          <div className="add-task">
            <input
              ref={inputRef}
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Yeni görev"
              className="task-input"
            />
            <button className="btn" onClick={addTask}>Ekle</button>
          </div>
        )}

        <button
          className={`add-btn ${isAdding ? "rotate" : ""}`}
          onClick={() => setIsAdding(!isAdding)}
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default ToDoList;