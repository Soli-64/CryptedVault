import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomeView from './pages/Home.tsx';
import LoginView from './pages/Login.tsx';
// import DashboardView from './pages/Dashboard.tsx';
// import AnalyzerView from './pages/Analyzer.tsx';
import StaticLayout from './pages/generics/StaticLayout.tsx';
import NotFoundView from './pages/generics/NotFound.tsx';

import './index.css';

const PageManager = () => {

  return (
    <Routes>
      <Route path='/' element={<StaticLayout/>}>
        <Route path='/login' index element={<LoginView />}></Route>
        <Route path='/' element={<HomeView />}></Route>
      </Route>
      <Route path='*' element={<NotFoundView />}></Route>
    </Routes>
  )

}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <PageManager />
    </BrowserRouter>
  </StrictMode>
)
