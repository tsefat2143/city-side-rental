import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/navbar';
import Home from './components/Home/home';
import Register from './components/Register/register';
import Login from './components/Login/login';
import { AuthProvider } from './components/Context/AuthContext';
import ForgotPassword from './components/ForgotPassword/forgotPassword';
import './App.css';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
