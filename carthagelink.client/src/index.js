import ReactDOM from 'react-dom/client'; // Change to 'react-dom/client'
import App from './App.js';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter

// Create a root and render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
