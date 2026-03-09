import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter} from 'react-router-dom'
import { AppProvider } from './context/Appcontext.tsx'
import { ThemeProvider } from './context/Themecontext.tsx'
createRoot(document.getElementById('root')!).render(
  <BrowserRouter> 
  <ThemeProvider>
    <AppProvider>
    <App /></AppProvider></ThemeProvider>
   </BrowserRouter>,
   
 
)
