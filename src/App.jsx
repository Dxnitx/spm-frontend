import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


import './App.css'
import EmployeePage from './pages/EmployeePage';
import AdminPanel from './pages/AdminPanel';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<EmployeePage />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  )
}

export default App
