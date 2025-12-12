import axios from 'axios';

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

    return newUserRes.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      throw new Error(err.response.data.message);
    } else {
      throw new Error('Failed to sign up user: ' + err.message);
    }
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
        'Failed to login user. Make sure email and password are correct.'
      );
    }

    return loggedInUser.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      throw new Error(err.response.data.message);
    } else {
      throw new Error('Failed to sign up user: ' + err.message);
    }
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
    if (!res.status === 200)
      throw new Error(
        'Failed to login user. Make sure email and password are correct.'
      );
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const sendResetEmail = async (formData) => {
  const { email } = formData;
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_DEV_API_BASE_URL}users/forgotPassword`,
      { email },
      { withCredentials: true }
    );
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      throw new Error(err.response.data.message);
    } else {
      throw new Error('Failed to send reset email: ' + err.message);
    }
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
      throw new Error('Failed to get logged in user. Please log in.');

    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
