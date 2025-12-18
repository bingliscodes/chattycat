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
  // Should I be using the org ID in the url?

  // 1. Load user's organizations
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

  // 2. Restore selected organization AFTER orgs are loaded
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

  // 4: Load org-specific data
  const handleLoadOrganizationData = async (orgId) => {
    console.log('Manually loading organization data for', orgId);
    try {
      const res = await fetchOrganizationData(orgId);
      setOrganizationData(res);
    } catch (err) {
      console.error('Failed to load organization data:', err);
      setOrganizationData(null);
    }
  };

  useEffect(() => {
    if (!selectedOrganization?.id) return;
    handleLoadOrganizationData(selectedOrganization.id);
  }, [selectedOrganization]);

  return (
    <OrganizationContext.Provider
      value={{
        userOrganizations,
        selectedOrganization,
        handleSetOrganization,
        organizationData,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};
