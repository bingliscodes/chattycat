import { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { createConnection } from '../utils/js/socket';
import { fetchUserData, fetchOrganizationData } from '../utils/js/apiCalls';
import { verifyJWT } from '../utils/js/authentication';

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [userData, setUserData] = useState({});
  const [organizationData, setOrganizationData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [socketReady, setSocketReady] = useState(false);
  const socketRef = useRef(null);

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocketReady(false);
    }
  };

  const loadUserData = useCallback(async () => {
    try {
      const currentUser = await verifyJWT();
      if (currentUser.status !== 'success') {
        setUserData({});
        setIsLoggedIn(false);
        return;
      }

      const userDataRes = await fetchUserData();
      setUserData(userDataRes.data);
      setIsLoggedIn(true);

      if (!socketRef.current) {
        const socket = await createConnection(userDataRes.data.id);
        socketRef.current = socket;
        setSocketReady(true);
      }
    } catch (err) {
      console.error(err);
      setUserData({});
      socketRef.current = null;
      setIsLoggedIn(false);
      setSocketReady(false);
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const loadOrganizationData = useCallback(async () => {
    try {
      const organizationsRes = await fetchOrganizationData();
      setOrganizationData(organizationsRes.data);
    } catch (err) {
      console.error(err);
      setOrganizationData([]);
    }
  }, []);

  useEffect(() => {
    loadOrganizationData();
  }, [loadOrganizationData]);

  return (
    <UserContext.Provider
      value={{
        userData,
        userSocket: socketRef.current,
        socketReady,
        disconnectSocket,
        setUserData,
        isLoggedIn,
        refreshUserData: loadUserData,
        organizationData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
