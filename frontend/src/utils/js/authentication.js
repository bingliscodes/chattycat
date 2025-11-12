import axios from "axios";

export const signup = async (formData) => {
  const { firstName, lastName, email, password, passwordConfirm } = formData;
  try {
    const newUserRes = await axios.post(
      `${import.meta.env.VITE_DEV_API_BASE_URL}users/signup`,
      {
        firstName,
        lastName,
        email,
        password,
        passwordConfirm,
      },
      { withCredentials: true }
    );

    if (newUserRes.data.status === "success") {
      alert(
        "Signed up successfully! You will now be redirected to the home page."
      );
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const login = async (formData) => {
  const { email, password } = formData;

  try {
    const loggedInUser = await axios.post(
      `${import.meta.env.VITE_DEV_API_BASE_URL}users/login`,
      { email, password },
      {
        withCredentials: true,
      }
    );

    if (!loggedInUser.status === 200) {
      throw new Error(
        "Failed to login user. Make sure email and password are correct."
      );
    }

    if (loggedInUser.data.status === "success") {
      alert(
        "Logged in successfully! You will now be redirected to the home page."
      );
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const logout = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_DEV_API_BASE_URL}users/logout`,
      {
        withCredentials: true,
      }
    );
    if (res.data.status === "success") {
      alert(
        "Logout successfully! You will now be redirected to the home page."
      );
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const verifyJWT = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_DEV_API_BASE_URL}auth/me`,
      {
        withCredentials: true,
      }
    );

    if (!res.status === 200)
      throw new Error("Failed to get logged in user. Please log in.");
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
