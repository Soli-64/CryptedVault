import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomeView from './pages/Home.tsx';
import StaticLayout from './pages/generics/StaticLayout.tsx';
import NotFoundView from './pages/generics/NotFound.tsx';
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

import './index.css';

const PageManager = () => {

  return (
    <Routes>
      <Route path='/' element={<StaticLayout/>}>
        <Route path='/' element={<HomeView />}></Route>
      </Route>
      <Route path='*' element={<NotFoundView />}></Route>
    </Routes>
  )

}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <PageManager />
        <Toaster />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)
