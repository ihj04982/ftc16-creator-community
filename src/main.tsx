import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router';
import { CssBaseline } from '@mui/material';
import { ohouseTheme } from './theme';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ThemeProvider theme={ohouseTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </BrowserRouter>,
);
