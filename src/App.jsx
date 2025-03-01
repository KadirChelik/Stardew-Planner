import { useState,useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import Top from "./components/Top";
import Dashboard from "./components/Dashboard";
import SpotifyWidget from "./components/SpotifyWidget";

function App() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <>
      <Navbar />
      <Sidebar isEditMode={isEditMode} isDragging={isDragging} />
      <Top />
      <Dashboard 
        isEditMode={isEditMode} 
        setIsEditMode={setIsEditMode} 
        setIsDragging={setIsDragging} 
        isDragging={isDragging}
      />
      <Footer />
    </>
  );
}

export default App;
