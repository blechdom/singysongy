import React from 'react';
import ReactDOM from 'react-dom';
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import './index.css';
import App from './Components/App/App';
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';

const theme = createMuiTheme({
  shadows: ["none"],
  palette: {
    background: {
      default: "#FFFFFF"
    },
    primary: {
      dark: "#a80050",
      main: "#e0007c",
      light: "#ff56ab",
      contrastText: '#fff',
    },
    secondary: {
      dark: "#009f75",
      main: "#11d1a4",
      light: "#64ffd5",
      contrastText: '#000',
    },
    text: {
      primary: "#e0007c",
      secondary: "#11d1a4"
    } 
  },
  typography: {
    fontFamily: 'Roboto',
  },
  fontFamily: 'Roboto',
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>,
  document.getElementById('root')
);

serviceWorker.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
