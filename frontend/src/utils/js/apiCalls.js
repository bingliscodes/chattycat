import axios from "axios";

export const fetchUserData = async () => {
  try {
    const userData = await axios.get(
      `${import.meta.env.VITE_DEV_API_BASE_URL}users/me`,
      {
        withCredentials: true,
      }
    );

    if (userData.status !== 200) throw new Error("Failed to fetch user data.");

    return userData.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const sendMessage = async (messageContent, userId, channelId) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_DEV_API_BASE_URL}messages`,
      {
        messageContent,
        userId,
        channelId,
      },
      { withCredentials: true }
    );

    if (res.status !== 201) throw new Error("Failed to create message");

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

    console.log(res);
    if (res.status !== 200) throw new Error("Failed to fetch message history");

    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
