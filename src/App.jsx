import React from "react";
import Home from "./Pages/Home";
import { Route, Routes } from "react-router-dom";
import CompanyPage from "./Pages/CompanyPage";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/company/:symbol" element={<CompanyPage />} />
      </Routes>
    </div>
  );
};

export default App;
