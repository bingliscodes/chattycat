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
  console.log('mode is:', mode);
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
    console.log(messageData);
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
      `${import.meta.env.VITE_DEV_API_BASE_URL}users/me/received`,
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
      `${import.meta.env.VITE_DEV_API_BASE_URL}users/me/received/${userId}`,
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
