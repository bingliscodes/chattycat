import apiClient from './apiClient.js';

export const fetchUserData = async () => {
  try {
    const userData = await apiClient.get('users/me');

    if (userData.status !== 200) throw new Error('Failed to fetch user data.');

    return userData.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const fetchUserOrganizations = async () => {
  try {
    const organizationData = await apiClient.get('users/myOrganizations');

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
    const channelRes = await apiClient.get(
      `organizations/${orgId}/channels`
    );

    const userRes = await apiClient.get(`organizations/${orgId}/users`);

    return { channels: channelRes.data.data, users: userRes.data.data };
  } catch (err) {
    console.error(err);
    throw err;
  }
};
export const sendMessage = async (messageData) => {
  try {
    const res = await apiClient.post('messages', messageData);

    if (res.status !== 201) throw new Error('Failed to create channel message');

    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const fetchChannelMessageHistory = async (channelId, orgId) => {
  try {
    const res = await apiClient.get(`channels/${channelId}/messages`, {
      headers: {
        'x-organization-id': orgId,
      },
    });

    if (res.status !== 200)
      throw new Error('Failed to fetch channel message history');

    return res.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      throw new Error(err.response.data.message);
    } else {
      throw new Error('Failed to create new organization: ' + err.message);
    }
  }
};

export const fetchUserMessageHistory = async (userId) => {
  try {
    const res = await apiClient.get(`users/received/${userId}`);
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
    const res = await apiClient.get(`messages/${messageId}`);

    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const fetchDirectMessageList = async (userId, orgId) => {
  try {
    const res = await apiClient.get(
      `users/${userId}/directMessageList?orgId=${orgId}`
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

    const res = await apiClient.post('users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (res.status !== 200) throw new Error('Failed to update avatar');

    return res.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      throw new Error(err.response.data.message);
    } else {
      throw new Error('Failed to update user avatar: ', err.message);
    }
  }
};

export const uploadMessageFiles = async (files) => {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    const res = await apiClient.post('messages/messageFiles', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      throw new Error(err.response.data.message);
    } else {
      throw new Error(`Failed to upload message attachments: ${err.message}`);
    }
  }
};

export const updateSettings = async (formData) => {
  const filteredFormData = removeBlankAttributes({ ...formData });
  try {
    const updatedUser = await apiClient.patch(
      'users/updateMe',
      filteredFormData
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
    const users = await apiClient.get('users', {
      headers: {
        'x-organization-id': orgId,
      },
    });

    if (!users.status === 200) {
      throw new Error(`Failed to retrieve users in organization ${orgId}`);
    }

    return users.data.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      throw new Error(err.response.data.message);
    } else {
      throw new Error('Failed to create new organization: ' + err.message);
    }
  }
};

export const addUserToOrganization = async (formData, orgId) => {
  try {
    const res = await apiClient.post('organizations/addUser', formData, {
      headers: {
        'x-organization-id': orgId,
      },
    });
    return res.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      throw new Error(err.response.data.message);
    } else {
      throw new Error('Failed to add user to organization: ', err.message);
    }
  }
};

export const addUserToChannel = async (userId, channelId, orgId) => {
  try {
    const res = await apiClient.post(
      'users/addToChannel',
      { userId, channelId },
      {
        headers: {
          'x-organization-id': orgId,
        },
      }
    );

    return res.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      throw new Error(err.response.data.message);
    } else {
      throw new Error('Failed to add user to channel: ', err.message);
    }
  }
};

export const fetchChannelUsers = async (channelId, orgId) => {
  try {
    const res = await apiClient.get(`channels/${channelId}/allUsers`, {
      headers: {
        'x-organization-id': orgId,
      },
    });
    if (!res.status === 200) {
      throw new Error('Failed to fetch users!');
    }
    return res.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      throw new Error(err.response.data.message);
    } else {
      throw new Error('Failed to fetch channel users: ', err.message);
    }
  }
};

export const findOrCreateDMRoom = async (user1Id, user2Id, orgId) => {
  try {
    const res = await apiClient.post('messages/privateRoomId', {
      user1Id,
      user2Id,
      orgId,
    });

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
    const res = await apiClient.post('organizations', formData);

    return res.data.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      throw new Error(err.response.data.message);
    } else {
      throw new Error('Failed to create new organization: ' + err.message);
    }
  }
};

export const createChannel = async (formData, orgId) => {
  try {
    const res = await apiClient.post('channels', formData, {
      headers: {
        'x-organization-id': orgId,
      },
    });
    return res.data.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      throw new Error(err.response.data.message);
    } else {
      throw new Error('Failed to create new channel: ', err.message);
    }
  }
};
