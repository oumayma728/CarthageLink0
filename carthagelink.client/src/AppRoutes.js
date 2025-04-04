import { lazy } from 'react';
import { ProtectedRoute} from './components/ProtectedRoutes/ProtectedRoute.js'; // Fixed import path
import Home from "./components/HomePage/HomePage.js";
import Register from "./Pages/register.js";
import Login from "./Pages/login.js"; 
import NotFoundPage from "./components/NotFound.js";

// Lazy load dashboard components for better performance
const Main = lazy(() => import("./Pages/dashboard/DashboardPage.jsx"));
const DevicePage = lazy(() => import("./Pages/dashboard/DevicePage.jsx"));
const UserPage = lazy(() => import("./Pages/dashboard/UserPage.jsx"));
const Factory = lazy(() => import("./Pages/dashboard/FactoryPage.jsx"));
const License = lazy(() => import("./Pages/dashboard/LicensePage.jsx"));
const AddUser = lazy(() => import("./components/User/AddUser.js"));
const AddFactory = lazy(() => import("./components/Factory/AddFactory.js"));

const AppRoutes = [
  // Public routes (no authentication required)
  {
    path: "/",
    element: <Home /> 
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/NotFoundPage",
    element: <NotFoundPage /> 
  },

  // Protected routes (require authentication)
  {
    path: "/main",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <Main />
      }
    ]
  },
  {
    path: "/Device",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <DevicePage />
      }
    ]
  },
  {
    path: "/User",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <UserPage />
      }
    ]
  },
  {
    path: "/License",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <License />
      }
    ]
  },
  {
    path: "/Factory",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <Factory />
      }
    ]
  },
  {
    path: "/add-user",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <AddUser />
      }
    ]
  },
  {
    path: "/add-factory",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <AddFactory />
      }
    ]
  },

  // Fallback route for 404 errors
  {
    path: "*",
    element: <NotFoundPage />
  }
];

export default AppRoutes;