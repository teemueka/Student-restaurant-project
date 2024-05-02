const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.log('Error fetching restaurant data', error);
  }
};

const weeklyMenu = async (id) => {
  try {
    const response = await fetch(
      `https://10.120.32.94/restaurant/api/v1/restaurants/weekly/${id}/fi`
    );
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.log('Error fetching weekly menu', error);
  }
};

const dailyMenu = async (id) => {
  try {
    const response = await fetch(
      `https://10.120.32.94/restaurant/api/v1/restaurants/daily/${id}/fi`
    );
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.log('Error fetching weekly menu', error);
  }
};

const userLogin = async (username, password) => {
  const url = 'https://10.120.32.94/restaurant/api/v1/auth/login';

  const requestData = {
    username: username,
    password: password,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    const responseData = await response.json();
    if (response.ok) {
      await localStorage.setItem('user', JSON.stringify(responseData.data));
      await localStorage.setItem('token', responseData.token);
      return responseData;
    } else {
      throw new Error(responseData.message || 'Failed to log in.');
    }
  } catch (error) {
    console.error('Error logging in:', error.message);
    throw error;
  }
};

const createUser = async (userData) => {
  const url = 'https://10.120.32.94/restaurant/api/v1/users';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const responseData = await response.json();
    if (response.ok) {
      console.log('New user created successfully:', responseData);
      return responseData;
    } else {
      throw new Error(`Failed to create new user: ${responseData.message}`);
    }
  } catch (error) {
    console.error('Error creating new user:', error.message);
    throw error;
  }
};

const checkUsernameAvailability = async (username) => {
  const url = `https://10.120.32.94/restaurant/api/v1/users/available/${username}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = await response.json();
    if (response.ok) {
      return responseData.available;
    } else {
      throw new Error(
        `Error checking username availability: ${response.statusText}`
      );
    }
  } catch (error) {
    console.error('Error checking username availability:', error.message);
    throw error;
  }
};

const updateUser = async (userData, accessToken) => {
  const url = 'https://10.120.32.94/restaurant/api/v1/users';

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(userData),
    });

    const responseData = await response.json();
    if (response.ok) {
      console.log(responseData);
      await localStorage.setItem('user', JSON.stringify(responseData.data));
      return responseData;
    }
  } catch (error) {
    console.error('Error updating user information:', error.message);
    throw error;
  }
};

const deleteUser = async (accessToken) => {
  const url = 'https://10.120.32.94/restaurant/api/v1/users';

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const responseData = await response.json();
    if (response.ok) {
      localStorage.clear();
      console.log(responseData);
      return responseData;
    }
  } catch (error) {
    console.error('Error deleting user:', error.message);
    throw error;
  }
};

const uploadAvatar = async (avatarFile, token) => {
  const url = 'https://10.120.32.94/restaurant/api/v1/users/avatar';

  const formData = new FormData();
  formData.append('avatar', avatarFile);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (response.ok) {
      console.log('Avatar uploaded successfully', data);
      localStorage.setItem('AVATAR_KEY', data.data.avatar);
      return data;
    }
  } catch (error) {
    console.log('Failed to upload avatar:', error.message);
    throw error;
  }
};

const getCurrentUserByToken = async (accessToken) => {
  const url = `https://10.120.32.94/restaurant/api/v1/users/token`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const responseData = await response.json();
    if (response.ok) {
      return responseData;
    }
  } catch (error) {
    console.log('error getting current user', error.message);
  }
};

const getAvatar = async (avatarKey) => {
  const url = `https://10.120.32.94/restaurant/uploads/${avatarKey}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const imageData = await response.blob();
      return URL.createObjectURL(imageData);
    } else {
      throw new Error('Failed to fetch avatar image');
    }
  } catch (error) {
    throw error;
  }
};

export {
  getAvatar,
  fetchData,
  weeklyMenu,
  dailyMenu,
  userLogin,
  uploadAvatar,
  createUser,
  checkUsernameAvailability,
  updateUser,
  deleteUser,
  getCurrentUserByToken,
};
