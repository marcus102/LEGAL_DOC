import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Results from "./components/Results";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/results/:docId" element={<Results />} />
    </Routes>
  </Router>
);

export default App;
