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
      console.log('User information updated successfully:', responseData);
      return responseData;
    } else if (response.status === 401) {
      throw new Error(
        'Unauthorized: Only authenticated users can update their information.'
      );
    } else {
      throw new Error(
        `Failed to update user information: ${responseData.message}`
      );
    }
  } catch (error) {
    console.error('Error updating user information:', error.message);
    throw error;
  }
};

const getUserToken = async (accessToken) => {
  const url = 'https://10.120.32.94/restaurant/api/v1/users/token';

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 200) {
      const userData = await response.json();
      return userData;
    } else if (response.status === 403) {
      throw new Error('Token is not valid.');
    } else {
      throw new Error(
        `Failed to fetch user information: ${response.statusText}`
      );
    }
  } catch (error) {
    console.error('Error fetching user information:', error.message);
    throw error;
  }
};

const uploadAvatar = async (avatarFile, jwtToken) => {
  const url = 'https://10.120.32.94/restaurant/api/v1/users/avatar';

  const formData = new FormData();
  formData.append('avatar', avatarFile);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (response.ok) {
      console.log('Avatar uploaded successfully', data);
      return data;
    } else {
      console.log('Error uploading avatar: ', data.error);
      throw new Error(data.error);
    }
  } catch (error) {
    console.log('Failed to upload avatar:', error.message);
    throw error;
  }
};

export {
  fetchData,
  weeklyMenu,
  dailyMenu,
  uploadAvatar,
  createUser,
  checkUsernameAvailability,
  getUserToken,
  updateUser,
};
