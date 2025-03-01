import React, { useState, useEffect } from "react";
import trashIcon from "../assets/trashcan-icon.png";
import nailIcon from "../assets/nail.png"; // Çivi ikonunu içe aktar

const DraggableComponent = ({
  id,
  component,
  initialPosition,
  onPositionChange,
  isEditMode,
  setIsDragging,
  isDragging,
  isSelected,
  onSelect,
  onDelete,
}) => {
  const [position, setPosition] = useState(() => {
    const savedPosition = localStorage.getItem(`widget-position-${id}`);
    return savedPosition ? JSON.parse(savedPosition) : initialPosition;
  });

  useEffect(() => {
    localStorage.setItem(`widget-position-${id}`, JSON.stringify(position));
  }, [position, id]);

  const handleMouseDown = (e) => {
    if (!isEditMode) return;

    document.body.style.userSelect = "none";
    const offsetX = e.clientX - position.x;
    const offsetY = e.clientY - position.y;

    const dashboard = document.querySelector(".dashboard-container");
    if (!dashboard) return;

    const dashboardRect = dashboard.getBoundingClientRect();
    const widget = e.target.closest(".draggable");
    const widgetWidth = widget.offsetWidth;
    const widgetHeight = widget.offsetHeight;

    let moved = false;

    const handleMouseMove = (e) => {
      if (!moved) {
        setIsDragging(true);
        moved = true;
      }

      let newX = e.clientX - offsetX;
      let newY = e.clientY - offsetY;

      const minX = 10;
      const minY = 12;
      const maxX = dashboardRect.width - widgetWidth - 12;
      const maxY = dashboardRect.height - widgetHeight - 4;

      newX = Math.max(minX, Math.min(newX, maxX));
      newY = Math.max(minY, Math.min(newY, maxY));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      onPositionChange(id, position);
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      className="draggable"
      style={{
        borderRadius: "20px",
        position: "absolute",
        left: position.x,
        top: position.y,
        cursor: isEditMode ? "grab" : "default",
        boxShadow: isEditMode && isSelected ? "0px 0px 20px #CC6805" : "none",
        transition: "box-shadow 0.2s ease-in-out",
      }}
      onMouseDown={handleMouseDown}
      onClick={onSelect}
    >
      {/* Çivi İkonu */}
      <img 
        src={nailIcon} 
        alt="Çivi" 
        className="nail-icon"
        style={{
          position: "absolute",
          top: "-8px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "20px",
          height: "20px",
        }} 
      />

      {component}

      {isEditMode && isSelected && (
        <button className="delete-button" onClick={() => onDelete(id)}>
          <img src={trashIcon} alt="" />
        </button>
      )}
    </div>
  );
};

export default DraggableComponent;
