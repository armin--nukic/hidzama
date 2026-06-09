import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import './i18n/config';
import './styles.css';
import App from './App';

const storedTheme = localStorage.getItem('sifa_theme');
const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
const initialTheme = storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : preferredTheme;
document.documentElement.classList.toggle('dark', initialTheme === 'dark');
document.documentElement.style.colorScheme = initialTheme;

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
