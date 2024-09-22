import React from "react";
import Navbar from "./Components/Navbar/Navbar";
import Admin from "./Pages/Admin/Admin";
import { Routes, Route } from "react-router-dom";
import Notification from "./Components/Notification/Notification";

const App = () => {
  return (
    <div>
      <Navbar />
      <Admin/>
      <Notification/>
    </div>
  );
};

export default App;
