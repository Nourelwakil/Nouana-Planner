import React, { createContext, useContext, ReactNode } from 'react';

// Firebase integration and user authentication have been removed.
// This AuthProvider is a placeholder to prevent breaking the component tree.

interface AuthContextType {
  currentUser: null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ currentUser: null, loading: false });

export const useAuth = () => {
  return useContext(AuthContext);
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const value = {
    currentUser: null,
    loading: false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
