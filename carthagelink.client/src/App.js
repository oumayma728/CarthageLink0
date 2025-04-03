// src/App.js
import  { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes.js';
import './index.css';
import { DarkModeProvider } from './DarkModeContext.js';


export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <div className="App">
            <DarkModeProvider>

        <Routes>
          {AppRoutes.map((route, index) => {
            const { element, ...rest } = route;
            return <Route key={index} {...rest} element={element} />;
          })}
        </Routes>
        </DarkModeProvider>

      </div>
    );
  }
}
