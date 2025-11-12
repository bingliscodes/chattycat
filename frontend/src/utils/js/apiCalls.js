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
