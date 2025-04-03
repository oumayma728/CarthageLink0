//import App from "./App.js";
import Home from "./components/HomePage/HomePage.js";
import Register from "./components/register/register.js";
import Login from "./components/Login/login.js"; 
import Main from "./components/Main/Main.js";
import Device from "./components/Device/Device.js";
import User from "./components/User/User.js";
import Factory from "./components/Factory/FactoryPage.js";
import AddUser from "./components/User/AddUser.js";
import AddFactory from "./components/Factory/AddFactory.js";
import License from "./components/License/License.js";
import NotFoundPage from "./components/NotFound.js";
const AppRoutes = [
  {
    path: "/",
    element: <Home /> 
  },

  {
    path: "/main",
    element: <Main /> 
  },
  {
    path: "/NotFoundPage",
    element: <NotFoundPage /> 
  },

  {
    path:"/register",
    element:<Register/>
  },

  {
    path:"/login",
    element:<Login/>
  },
  {
    path: "/Device",
    element: <Device /> 
  },

  {
    path:"/User",
    element:<User/>
  },
  {
    path:"/License",
    element:<License/>
  },
  {
    path:"/Factory",
    element:<Factory/>
  },
  {
    path: "/add-user",
    element: <AddUser /> 
  },
  {
    path: "/add-factory",
    element: <AddFactory /> 
  },
  
];

export default AppRoutes;
