import apiClient, { setAuthToken, clearAuthToken } from './apiClient.js';

export const signup = async (formData) => {
  const { firstName, lastName, email, password, passwordConfirm } = formData;
  try {
    const newUserRes = await apiClient.post('users/signup', {
      firstName,
      lastName,
      email,
      password,
      passwordConfirm,
    });

    if (newUserRes.data.token) setAuthToken(newUserRes.data.token);

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
    const loggedInUser = await apiClient.post('users/login', {
      email,
      password,
    });

    if (!loggedInUser.status === 200) {
      throw new Error(
        'Failed to login user. Make sure email and password are correct.'
      );
    }

    if (loggedInUser.data.token) setAuthToken(loggedInUser.data.token);

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
    const res = await apiClient.get('users/logout');
    if (!res.status === 200)
      throw new Error(
        'Failed to login user. Make sure email and password are correct.'
      );
    clearAuthToken();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const sendResetEmail = async (formData) => {
  const { email } = formData;
  try {
    const res = await apiClient.post('users/forgotPassword', { email });
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      throw new Error(err.response.data.message);
    } else {
      throw new Error('Failed to send reset email: ' + err.message);
    }
  }
};

export const resetPassword = async (formData, resetToken) => {
  const { password, passwordConfirm } = formData;
  try {
    const res = await apiClient.patch(`users/resetPassword/${resetToken}`, {
      password,
      passwordConfirm,
    });

    if (res.data.token) setAuthToken(res.data.token);

    return res.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      throw new Error(err.response.data.message);
    } else {
      throw new Error('Failed to reset password: ' + err.message);
    }
  }
};

export const verifyJWT = async () => {
  try {
    const res = await apiClient.get('auth/me');

    if (!res.status === 200)
      throw new Error('Failed to get logged in user. Please log in.');

    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
