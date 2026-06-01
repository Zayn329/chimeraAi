import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthUser {
  username: string;
  name: string;
  initials: string;
  role: 'student' | 'faculty';
}

interface UserContextType {
  user: AuthUser | null;
  login: (username: string, name: string, role: 'student' | 'faculty') => void;
  logout: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedSession = localStorage.getItem('chimera_session');
    if (savedSession) {
      try {
        setUser(JSON.parse(savedSession));
      } catch (e) {
        console.error("Failed to parse saved session", e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (username: string, name: string, role: 'student' | 'faculty') => {
    const initials = name
      .trim()
      .split(/\s+/)
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || (role === 'student' ? 'ST' : 'FA');

    const newUser = { username, name, initials, role };
    setUser(newUser);
    localStorage.setItem('chimera_session', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('chimera_session');
  };

  return (
    <UserContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
