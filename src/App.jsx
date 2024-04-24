import { useEffect, useState } from 'react';
import './App.css'
import { Sidebar } from './components/sidebar/Sidebar'
import { Dashboard } from './pages/dashboard/Dashboard'
import { Navbar } from './components/navbar/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Employes } from './pages/employes/Employes';
import { Conges } from './pages/conges/Conges';
import { Statistique } from './pages/statistique/Statistique';
import { Pointages } from './pages/pointages/Pointages';
import { Login } from './pages/login/Login';
import { Introuvable } from './pages/introuvable/Introuvable';

function App() {

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('theme')) {

      const darkModeToggle = document.querySelector('.dark-mode');
      if (localStorage.getItem('theme') == 'dark') {
        document.body.classList.remove('dark-mode-variables');
        darkModeToggle.querySelector('span:nth-child(1)').classList.add('active');
        darkModeToggle.querySelector('span:nth-child(2)').classList.remove('active');

      } else if (localStorage.getItem('theme') == 'light') {
        document.body.classList.add('dark-mode-variables');
        darkModeToggle.querySelector('span:nth-child(1)').classList.remove('active');
        darkModeToggle.querySelector('span:nth-child(2)').classList.add('active');
      }

    } else {
      localStorage.setItem('theme', 'light');
    }
  }, [])

  useEffect(() => {
    const darkModeToggle = document.querySelector('.dark-mode');

    const handleToggleClick = () => {
      document.body.classList.toggle('dark-mode-variables');
      darkModeToggle.querySelector('span:nth-child(1)').classList.toggle('active');
      darkModeToggle.querySelector('span:nth-child(2)').classList.toggle('active');
      setIsDarkMode(!isDarkMode);
    };

    darkModeToggle?.addEventListener('click', handleToggleClick);
    if (localStorage.getItem('theme') == 'light') {
      localStorage.setItem('theme', 'dark');
    } else if (localStorage.getItem('theme') == 'dark') {
      localStorage.setItem('theme', 'light');
    }

    return () => {
      darkModeToggle?.removeEventListener('click', handleToggleClick);
    };

  }, [isDarkMode]);


  useEffect(() => {
    const sideMenu = document.querySelector('aside');
    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-btn');

    const handleMenuBtnClick = () => {
      sideMenu.style.display = 'block';
    };

    const handleCloseBtnClick = () => {
      sideMenu.style.display = 'none';
    };

    const handleWindowResize = () => {
      if (window.innerWidth < 768) {
        menuBtn.addEventListener('click', handleMenuBtnClick);
        closeBtn.addEventListener('click', handleCloseBtnClick);
      } else {
        handleMenuBtnClick();
      }
    };

    handleWindowResize();

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [window.innerWidth]);

  return (
    <BrowserRouter>
      <Sidebar />
      <div>
        <Navbar />
        <Routes >
          <Route path="/dashboard" exact element={<Dashboard />} />
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/employes" element={<Employes />} />
          <Route path="/pointages" element={<Pointages />} />
          <Route path="/conges" element={<Conges />} />
          <Route path="/statistique" element={<Statistique />} />
        </Routes>
      </div>

    </BrowserRouter>
  )
}

export default App
