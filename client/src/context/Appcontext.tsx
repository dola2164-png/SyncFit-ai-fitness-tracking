import { createContext, useContext, useEffect, useState } from "react";
import { initialState, type ActivityEntry, type Credentials, type FoodEntry, type User } from "../types";
import { useNavigate } from "react-router-dom";
import api from "../configs/api";
import toast from "react-hot-toast";

const Appcontext = createContext(initialState);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>(null);
  const [isUserFetched, setIsUserFetched] = useState(localStorage.getItem('token') ? false : true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [allFoodLogs, setAllFoodLogs] = useState<FoodEntry[]>([]);
  const [allActivityLogs, setAllActivityLogs] = useState<ActivityEntry[]>([]);

  const signup = async (credentials: Credentials) => {
    try {
      // 1. Moved the API call INSIDE the try block so errors are caught properly
      const { data } = await api.post('/api/auth/local/register', credentials);
      
      setUser({ ...data.user, token: data.jwt });
      
      if (data?.user?.age && data?.user?.weight && data?.user?.goal) {
        setOnboardingCompleted(true);
      }
      
      localStorage.setItem('token', data.jwt);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.jwt}`;

      // 2. NEW: Fetch logs immediately so the dashboard isn't empty!
      await fetchFoodLogs(data.jwt);
      await fetchActivityLogs(data.jwt);

    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.error?.message || error?.message);
    }
  };

  const login = async (credentials: Credentials) => {
    try {
      const { data } = await api.post('/api/auth/local', { 
        identifier: credentials.email, 
        password: credentials.password 
      });
      
      setUser({ ...data.user, token: data.jwt });
      
      if (data?.user?.age && data?.user?.weight && data?.user?.goal) {
        setOnboardingCompleted(true);
      }
      
      localStorage.setItem('token', data.jwt);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.jwt}`;

      // 3. NEW: Fetch logs immediately upon login so the dashboard works without a refresh!
      await fetchFoodLogs(data.jwt);
      await fetchActivityLogs(data.jwt);

    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.error?.message || error?.message);
    }
  };

  const fetchUser = async (token: string) => {
    try {
      const { data } = await api.get('/api/users/me', { 
        headers: { Authorization: `Bearer ${token}` } 
      });

      setUser({ ...data, token });
      
      if (data?.age && data?.weight && data?.goal) {
        setOnboardingCompleted(true);
      }
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.error?.message || error?.message);
    }
    setIsUserFetched(true);
  };

  const fetchFoodLogs = async (token: string) => {
    try {
      const { data } = await api.get('/api/food-logs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllFoodLogs(data);
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.error?.message || error?.message);
    }
  };

  const fetchActivityLogs = async (token: string) => {
    try {
      const { data } = await api.get('/api/activity-logs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllActivityLogs(data);
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.error?.message || error?.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setOnboardingCompleted(false);
    setAllFoodLogs([]); // NEW: Clear out the data when logging out
    setAllActivityLogs([]); // NEW: Clear out the data when logging out
    api.defaults.headers.common['Authorization'] = '';
    navigate('/');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      (async () => {
        await fetchUser(token);
        await fetchFoodLogs(token);
        await fetchActivityLogs(token);
      })();
    }
  }, []);

  const value = {
    user, setUser, isUserFetched, fetchUser, signup,
    login, logout, setOnboardingCompleted, setAllFoodLogs, setAllActivityLogs,
    onboardingCompleted, allFoodLogs, allActivityLogs
  };

  return (
    <Appcontext.Provider value={value}>
      {children}
    </Appcontext.Provider>
  );
};

export const useAppContext = () => useContext(Appcontext);
