import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {CssBaseline} from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';
import { SocketProvider, UsernameProvider, RoomnameProvider } from './components/SocketContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <Router>
      <CssBaseline/>
      <SocketProvider>
        <UsernameProvider>
          <RoomnameProvider>
            <App />
          </RoomnameProvider>
        </UsernameProvider>
      </SocketProvider>
    </Router>
  </>,
)
