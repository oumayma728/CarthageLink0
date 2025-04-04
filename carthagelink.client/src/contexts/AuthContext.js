import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    if (token && userData) {
      setUser({
        ...userData,
        token
      });
    }
    setLoading(false);
  }, []);

  // Enhanced login function
  const login = async ({ email, password, rememberMe }) => {
    try {
      const response = await fetch("https://localhost:7086/api/User/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      
      // Store all user data including role
      const userData = {
        email: data.email,
        role: data.role,
        name: data.name,
        // Add other user properties as needed
      };
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("userData", JSON.stringify(userData));
      
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      }

      setUser({
        ...userData,
        token: data.token
      });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Enhanced register function
  const register = async (formData) => {
    try {
      const response = await fetch("https://localhost:7086/api/User/register-user", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json" 
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role,
          licenseKey: formData.licenseKey
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }
  
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    localStorage.removeItem("rememberedEmail");
    setUser(null);
    navigate("/login");
  };

  // Add a function to check specific roles
  const hasRole = (requiredRole) => {
    if (!user) return false;
    return user.role === requiredRole;
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    hasRole,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}