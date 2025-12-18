// OrganizationContext.jsx
import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import {
  fetchUserOrganizations,
  fetchOrganizationData,
} from '../utils/js/apiCalls';
import { UserContext } from './UserContext';

export const OrganizationContext = createContext({});

export const OrganizationContextProvider = ({ children }) => {
  const { isLoggedIn } = useContext(UserContext);

  const [userOrganizations, setUserOrganizations] = useState([]);
  const [isLoadingUserOrganizations, setIsLoadingUserOrganizations] =
    useState(true);
  const [organizationData, setOrganizationData] = useState(null);
  const [selectedOrganization, setSelectedOrganization] = useState(null);

  // 1. Load user's organizations
  const loadUserOrganizations = useCallback(async () => {
    try {
      const response = await fetchUserOrganizations();
      console.log(response);
      setUserOrganizations(response.data);
    } catch (err) {
      console.error('Failed to fetch organizations:', err);
      setUserOrganizations([]);
    } finally {
      setIsLoadingUserOrganizations(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    loadUserOrganizations();
  }, [loadUserOrganizations, isLoggedIn]);

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
    try {
      const res = await fetchOrganizationData(orgId);
      setOrganizationData(res);
    } catch (err) {
      console.error('Failed to load organization data:', err);
      setOrganizationData(null);
    }
  };

  const refreshOrganizationData = async () => {
    try {
      const res = await fetchOrganizationData(selectedOrganization.id);
      setOrganizationData(res);
    } catch (err) {
      console.error(
        'An error occurred when refreshing organization data: ',
        err
      );
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
        isLoadingUserOrganizations,
        refreshOrganizationData,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};
