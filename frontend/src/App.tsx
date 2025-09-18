import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Colleges } from "./pages/colleges/Colleges";
import { Programs } from "./pages/programs/Programs";
import { Students } from "./pages/students/Students";
import { MasterLayout } from "./layouts/MasterLayout";
import { Home } from "./pages/home/Home"; // Make sure to import Home

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />{" "}
        {/* Redirect */}
        <Route path="/home" element={<MasterLayout />}>
          <Route index element={<Home />} />
          <Route path="colleges" element={<Colleges />} />
          <Route path="programs" element={<Programs />} />
          <Route path="students" element={<Students />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
