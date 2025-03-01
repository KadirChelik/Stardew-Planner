import React from "react";
import Clock from "../assets/clock.png";
import Timer from "../assets/timer.png";
import Pomodoro from "../assets/pomodoro.png";
import TodoList from "../assets/todolist-icon.png";

const widgets = [
  { id: "Clock", name: "Saat", icon: Clock },
  { id: "Timer", name: "Zamanlayıcı", icon: Timer },
  { id: "Pomodoro", name: "Pomodoro", icon: Pomodoro },
  { id: "ToDoList", name: "Yapılacaklar Listesi", icon: TodoList },
  { id: "WeeklyToDoList", name: "Haftalık Yapılacaklar Listesi", icon: TodoList },
  { id: "SpotifyWidget", name: "Spotify", icon: TodoList }
];

const Sidebar = ({ isEditMode, isDragging }) => {
  const handleDragStart = (e, widget) => {
    if (!isEditMode) return;
    e.dataTransfer.setData("widget", JSON.stringify(widget));
  };

  const sidebarClass = `sidebar ${isEditMode && !isDragging ? "expanded" : ""}`;

  return (
    <div className={sidebarClass}>
      <div className="sidebar-title">Araçlar</div>
      <div className="widget-list">
        {widgets.map((widget) => (
          <div
            key={widget.id}
            className={`widget-item ${widget.id.toLowerCase()}`}
            draggable={isEditMode}
            onDragStart={(e) => handleDragStart(e, widget)}
          >
            <div className="widget-icon-container"> 
            <img
              src={widget.icon}
              alt={widget.name}
              className={`widget-icon ${widget.id.toLowerCase()}-icon`}
            />
            </div>
            
            <div className="widget-name-container">
            <span>{widget.name}</span>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
