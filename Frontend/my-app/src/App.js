import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Schoolslist from "./Pages/Schoolslist";
import Addsschool from "./Components/Addsschool";
import Searchschool from "./Components/Searchschool";
import Appointments from "./Components/Appointments";
import FixedAppointments from "./Components/FixedAppointments";

function App() {
  
    return (
    <Router>
      <Routes>
        <Route path="/schoolslist" element={<Schoolslist />} />
        <Route path="/add-school" element={<Addsschool />} />
        <Route path="/Search-school" element={<Searchschool />} />
       <Route path="/appointments" element={<Appointments />} />
        <Route path="/FixedAppoinemnts" element={<FixedAppointments />} />

      </Routes>
    </Router>
  );
}

export default App;
