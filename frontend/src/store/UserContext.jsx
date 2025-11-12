import { createContext, useState, useEffect, useCallback } from "react";

import { fetchUserData } from "../utils/js/apiCalls";
import { verifyJWT } from "../utils/js/authentication";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [userData, setUserData] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const loadUserData = useCallback(async () => {
    try {
      const currentUser = await verifyJWT();
      if (currentUser.status !== "success") {
        setUserData({});
        setIsLoggedIn(false);
        return;
      }

      const userDataRes = await fetchUserData();

      setUserData(userDataRes.data);
      setIsLoggedIn(true);
    } catch (err) {
      console.error(err);
      setUserData({});
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        isLoggedIn,
        setIsLoggedIn,
        refreshUserData: loadUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
