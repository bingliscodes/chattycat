// OrganizationContext.jsx
import { createContext, useState, useEffect, useCallback } from 'react';
import {
  fetchUserOrganizations,
  fetchOrganizationData,
} from '../utils/js/apiCalls';

export const OrganizationContext = createContext({});

export const OrganizationContextProvider = ({ children }) => {
  const [userOrganizations, setUserOrganizations] = useState([]);
  const [organizationData, setOrganizationData] = useState(null);
  const [selectedOrganization, setSelectedOrganization] = useState(null);

  // TODO: Figure out why organizationData is nulling when refreshing page despite the selectedOragnizationId persisting in localstorage

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

  useEffect(() => {
    if (!userOrganizations.length) return;

    const savedOrgId = localStorage.getItem('selectedOrganizationId');
    if (!savedOrgId) return;

    const foundOrg = userOrganizations.find((org) => org.id === savedOrgId);

    if (foundOrg) {
      setSelectedOrganization(foundOrg);
    }
  }, [userOrganizations]);

  // 3: Persist selection ONLY when user changes it
  const handleSetOrganization = (org) => {
    setSelectedOrganization(org);
    localStorage.setItem('selectedOrganizationId', org.id);
  };

  const handleLoadOrganizationData = async () => {
    if (!selectedOrganization) return;
    const { id } = selectedOrganization;
    try {
      const orgDataRes = await fetchOrganizationData(id);
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
        selectedOrganization,
        handleSetOrganization,
        handleLoadOrganizationData,
        organizationData,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};
