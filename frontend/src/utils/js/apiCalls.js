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

export const sendMessage = async (messageData, mode) => {
  if (mode === 'ch') {
    const { messageContent, userId, channelId } = messageData;
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_DEV_API_BASE_URL}messages/channelMessage`,
        {
          messageContent,
          userId,
          channelId,
        },
        { withCredentials: true }
      );

      if (res.status !== 201)
        throw new Error('Failed to create channel message');

      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  if (mode === 'dm') {
    const { messageContent, senderId, receiverId, roomId } = messageData;
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_DEV_API_BASE_URL}messages/directMessage`,
        {
          messageContent,
          senderId,
          receiverId,
          roomId,
        },
        { withCredentials: true }
      );

      if (res.status !== 201)
        throw new Error('Failed to create direct message');

      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
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

export const fetchDirectMessageHistory = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_DEV_API_BASE_URL}users/received`,
      { withCredentials: true }
    );

    if (res.status !== 200)
      throw new Error('Failed to fetch direct message history');
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

    console.log(res.data);
    if (res.status !== 200)
      throw new Error('Failed to fetch direct message history');

    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const fetchDirectMessageList = async (userId) => {
  try {
    const res = await axios.get(
      `${
        import.meta.env.VITE_DEV_API_BASE_URL
      }users/${userId}/directMessageList`,
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

export const fetchOrganizationUsers = async (organizationId) => {
  // Retrieves a list of all users within an organization

  try {
    const users = axios.get(`${import.meta.env.VITE_DEV_API_BASE_URL}users`);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
