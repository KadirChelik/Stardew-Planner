import React, { useState, useEffect, useRef } from "react";
import DraggableComponent from "./DraggableComponent";
import Clock from "./Clock";
import Timer from "./Timer";
import Pomodoro from "./Pomodoro";
import ToDoList from "./ToDoList";
import WeeklyToDoList from "./WeeklyToDoList";
import SpotifyWidget from "./SpotifyWidget";
import logo from "../assets/Logo_son.png";
import editButton from "../assets/edit-button.png";
import clickSound from "../assets/click-sound.mp3";

const widgetSizes = {
  Clock: { width: 472, height: 190 },
  Timer: { width: 432, height: 337 },
  Pomodoro: { width: 308, height: 387 },
  ToDoList: { width: 300, height: 400 },
  WeeklyToDoList: { width: 835, height: 520 },
  SpotifyWidget: { width: 450, height: 400 }
};

const Dashboard = ({ isEditMode, setIsEditMode, isDragging, setIsDragging }) => {
  const [components, setComponents] = useState([]);
  const [selectedComponentId, setSelectedComponentId] = useState(null);
  const [showIndicator, setShowIndicator] = useState(false);
  const [dashboardHeight, setDashboardHeight] = useState(600); // Başlangıç yüksekliği
  const dashboardRef = useRef(null);
  const isResizingRef = useRef(false);

  useEffect(() => {
    const savedComponents = localStorage.getItem("dashboardWidgets");
    if (savedComponents) {
      try {
        setComponents(JSON.parse(savedComponents));
      } catch (error) {
        console.error("LocalStorage JSON parse hatası:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (components.length > 0) {
      try {
        localStorage.setItem("dashboardWidgets", JSON.stringify(components));
      } catch (error) {
        console.error("LocalStorage'a kaydetme hatası:", error);
      }
    }
  }, [components]);

  useEffect(() => {
    if (isEditMode) {
      setShowIndicator(true);
    } else {
      const timeout = setTimeout(() => setShowIndicator(false), 800);
      return () => clearTimeout(timeout);
    }
  }, [isEditMode]);

  const addComponent = (widget, position) => {
    const newComponent = { id: Date.now(), type: widget.id, position };
    setComponents((prev) => [...prev, newComponent]);
  };

  const updatePosition = (id, newPosition) => {
    setComponents((prev) =>
      prev.map((comp) =>
        comp.id === id ? { ...comp, position: newPosition } : comp
      )
    );
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const widget = JSON.parse(e.dataTransfer.getData("widget"));

    if (dashboardRef.current) {
      const boundingRect = dashboardRef.current.getBoundingClientRect();
      const { width = 100, height = 100 } = widgetSizes[widget.id] || {};

      let x = e.clientX - boundingRect.left - width / 2;
      let y = e.clientY - boundingRect.top - height / 2;

      const minX = 10, minY = 12;
      const maxX = boundingRect.width - width - 12;
      const maxY = boundingRect.height - height - 4;

      x = Math.max(minX, Math.min(x, maxX));
      y = Math.max(minY, Math.min(y, maxY));

      addComponent(widget, { x, y });
    }
  };

  const handleDelete = (id) => {
    setComponents((prev) => prev.filter((comp) => comp.id !== id));
    setSelectedComponentId(null);
    localStorage.setItem("dashboardWidgets", JSON.stringify(components.filter(comp => comp.id !== id)));
  };

  const playClickSound = () => {
    const audio = new Audio(clickSound);
    audio.volume = 0.3;
    audio.play();
  };

  // Dashboard boyutunu değiştirme işlemi
  const startResizing = (e) => {
    isResizingRef.current = true;
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResizing);
  };

  const resize = (e) => {
    if (!isResizingRef.current) return;
    setDashboardHeight((prevHeight) => Math.max(300, e.clientY - dashboardRef.current.getBoundingClientRect().top));
  };

  const stopResizing = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", resize);
    document.removeEventListener("mouseup", stopResizing);
    localStorage.setItem("dashboardHeight", JSON.stringify(dashboardHeight));
  };
  useEffect(() => {
    const savedHeight = localStorage.getItem("dashboardHeight");
    if (savedHeight) {
      try {
        console.log("savedHeight", savedHeight);
        setDashboardHeight(JSON.parse(savedHeight));
      } catch (error) {
        console.error("LocalStorage JSON parse hatası:", error);
      }
    }
  }, []);

  return (
    <div
      ref={dashboardRef}
      className="dashboard-container"
      style={{ height: `${dashboardHeight}px` }}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="edit-button-container">
        {showIndicator && (
          <div className="edit-mode-indicator">
            <button className={`indicator ${!isEditMode ? "hide" : ""}`}>Düzenleme Modu</button>
          </div>
        )}
        <button
          className="edit-button"
          onClick={() => {
            playClickSound();
            setIsEditMode((prev) => !prev);
          }}
        >
          <img src={editButton} alt="Edit" />
        </button>
      </div>

      <a className="logo" href="#">
        <img src={logo} alt="Logo" />
      </a>

      {components.map((comp) => {
        let Component;
        if (comp.type === "Clock") Component = <Clock />;
        if (comp.type === "Timer") Component = <Timer />;
        if (comp.type === "Pomodoro") Component = <Pomodoro />;
        if (comp.type === "ToDoList") Component = <ToDoList />;
        if (comp.type === "WeeklyToDoList") Component = <WeeklyToDoList />;
        if (comp.type === "SpotifyWidget") Component = <SpotifyWidget />;
        if (!Component) return null;

        return (
          <DraggableComponent
            key={comp.id}
            id={comp.id}
            component={Component}
            initialPosition={comp.position}
            onPositionChange={updatePosition}
            isEditMode={isEditMode}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            isSelected={selectedComponentId === comp.id}
            onSelect={() => setSelectedComponentId(comp.id)}
            onDelete={handleDelete}
          />
        );
      })}

      {isEditMode && (
        <div className="resize-handle" onMouseDown={startResizing}></div>
      )}
    </div>
  );
};

export default Dashboard;
