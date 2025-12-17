// OrganizationContext.jsx
import {
  useContext,
  createContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

import { UserContext } from './UserContext';

export const OrganizationContext = createContext({});

export const OrganizationContextProvider = ({ children }) => {
  const [organization, setOrganization] = useState();

  const { userData, userSocket } = useContext(UserContext);

  const handleSetOrganization = (org) => {
    console.log(
      'setting organization to:',
      org.organizationName,
      'org ID:',
      org.id
    );
    setOrganization(org);
    // TODO: get relavent user data such as channels and dms and load the app
    // We need to replace all the isntances where channels and other data comes from the userData obj
  };

  return (
    <OrganizationContext.Provider
      value={{
        organization,
        handleSetOrganization,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};
