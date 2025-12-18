import axios from 'axios';

export const fetchUserData = async () => {
  try {
    const userData = await axios.get(
      `${import.meta.env.VITE_DEV_API_BASE_URL}users/me`,
      {
        withCredentials: true,
      }
    );

    if (userData.status !== 200) throw new Error('Failed to fetch user data.');

    return userData.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const fetchUserOrganizations = async () => {
  try {
    const organizationData = await axios.get(
      `${import.meta.env.VITE_DEV_API_BASE_URL}users/myOrganizations`,
      {
        withCredentials: true,
      }
    );

    if (organizationData.status !== 200)
      throw new Error('Failed to fetch organization data.');

    return organizationData.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const fetchOrganizationData = async (orgId) => {
  try {
    const channelRes = await axios.get(
      `${import.meta.env.VITE_DEV_API_BASE_URL}organizations/${orgId}/channels`,
      { withCredentials: true }
    );

    const userRes = await axios.get(
      `${import.meta.env.VITE_DEV_API_BASE_URL}organizations/${orgId}/users`,
      { withCredentials: true }
    );

    return { channels: channelRes.data.data, users: userRes.data.data };
  } catch (err) {
    console.error(err);
    throw err;
  }
};
export const sendMessage = async (messageData) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_DEV_API_BASE_URL}messages`,
      messageData,
      { withCredentials: true }
    );

    if (res.status !== 201) throw new Error('Failed to create channel message');

    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const fetchChannelMessageHistory = async (channelId) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_DEV_API_BASE_URL}channels/${channelId}/messages`,
      { withCredentials: true }
    );

    if (res.status !== 200)
      throw new Error('Failed to fetch channel message history');

    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const fetchUserMessageHistory = async (userId) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_DEV_API_BASE_URL}users/received/${userId}`,
      { withCredentials: true }
    );
    if (res.status !== 200)
      throw new Error('Failed to fetch direct message history');

    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const fetchThreadMessageHistory = async (messageId) => {
  /* Returns an array of message objects containing all messages associated with the parent messageId*/
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_DEV_API_BASE_URL}messages/${messageId}`,
      { withCredentials: true }
    );

    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const fetchDirectMessageList = async (userId, orgId) => {
  console.log('orgId', orgId);
  try {
    const res = await axios.get(
      `${
        import.meta.env.VITE_DEV_API_BASE_URL
      }users/${userId}/directMessageList?orgId=${orgId}`,
      { withCredentials: true }
    );

    if (res.status !== 200)
      throw new Error('Failed to fetch direct message history');

    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const updateAvatar = async (file) => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);

    const res = await axios.post(
      `${import.meta.env.VITE_DEV_API_BASE_URL}users/avatar`,
      formData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (res.status !== 200) throw new Error('Failed to update avatar');

    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const updateSettings = async (formData) => {
  const filteredFormData = removeBlankAttributes({ ...formData });
  try {
    const updatedUser = await axios.patch(
      `${import.meta.env.VITE_DEV_API_BASE_URL}users/updateMe`,
      filteredFormData,
      { withCredentials: true }
    );

    if (!updatedUser.status === 200) {
      throw new Error('Failed to update settings. Please try again later!');
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

function removeBlankAttributes(obj) {
  const result = {};
  for (const key in obj) {
    if (obj[key] !== '' && obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }
  return result;
}

export const fetchOrganizationUsers = async (orgId) => {
  // Retrieves a list of all users within an organization

  try {
    const users = await axios.get(
      `${import.meta.env.VITE_DEV_API_BASE_URL}users?orgId=${orgId}`,
      { withCredentials: true }
    );

    if (!users.status === 200) {
      throw new Error(`Failed to retrieve users in organization ${orgId}`);
    }

    return users.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const addUserToChannel = async (userId, channelId, orgId) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_DEV_API_BASE_URL}users/addToChannel`,
      { userId, channelId },
      {
        withCredentials: true,
        headers: {
          'x-organization-id': orgId,
        },
      }
    );

    if (res.status === 200) {
      throw new Error('Failed to add user to channel!');
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const fetchChannelUsers = async (channelId) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_DEV_API_BASE_URL}channels/${channelId}/allUsers`,
      { withCredentials: true }
    );
    if (!res.status === 200) {
      throw new Error('Failed to fetch users!');
    }
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const findOrCreateDMRoom = async (user1Id, user2Id, orgId) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_DEV_API_BASE_URL}messages/privateRoomId`,
      { user1Id, user2Id, orgId },
      { withCredentials: true }
    );

    if (!res.status === 200) {
      throw new Error('Failed to get private room id!');
    }

    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const createOrganization = async (formData) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_DEV_API_BASE_URL}organizations`,
      formData,
      { withCredentials: true }
    );

    return res.data.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      throw new Error(err.response.data.message);
    } else {
      throw new Error('Failed to create new organization: ' + err.message);
    }
  }
};
