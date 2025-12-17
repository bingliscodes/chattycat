// OrganizationContext.jsx
import { createContext, useState, useEffect, useCallback } from 'react';
import {
  fetchUserOrganizations,
  fetchOrganizationData,
} from '../utils/js/apiCalls';

export const OrganizationContext = createContext({});

export const OrganizationContextProvider = ({ children }) => {
  const [userOrganizations, setUserOrganizations] = useState([]);
  const [organizationData, setOrganizationData] = useState();

  const loadUserOrganizations = useCallback(async () => {
    try {
      const response = await fetchUserOrganizations();
      setUserOrganizations(response.data);
    } catch (err) {
      console.error('Failed to fetch organizations:', err);
      setUserOrganizations([]);
    }
  }, []);

  useEffect(() => {
    loadUserOrganizations();
  }, [loadUserOrganizations]);

  const handleLoadOrganizationData = async (org) => {
    try {
      const orgDataRes = await fetchOrganizationData(org);
      setOrganizationData(orgDataRes);
    } catch (err) {
      setOrganizationData(null);
      console.error('Failed to load org data:', err);
    }
  };

  return (
    <OrganizationContext.Provider
      value={{
        userOrganizations,
        handleLoadOrganizationData,
        organizationData,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};
