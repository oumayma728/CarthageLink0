//import App from "./App.js";
import Home from "./components/Home/Home.js";
//import Login from "./components/Login/login"
import Register from "./components/register/register.js";
const AppRoutes = [
  {
    path: "/",
    element: <Home /> // Home route
  },
  {
    path:"/register",
    element:<Register/>
  }
  
];

export default AppRoutes;
