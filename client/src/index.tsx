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
      main: "#cac3e9" // This is an orange looking color
    },
    secondary: {
      main: "#6771ad" //Another orange-ish color
    },
    text: {
      primary: "#8c86c4",
      secondary: "#6771ad"
    } 
  },
  typography: {
    fontFamily: 'Roboto',
  },
  // even darker: #6771ad
  fontFamily: 'Roboto', // as an aside, highly recommend importing roboto font for Material UI projects! Looks really nice
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
