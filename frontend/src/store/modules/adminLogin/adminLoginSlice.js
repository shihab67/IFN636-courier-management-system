import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
const initialState = [{}];

const adminLoginSlice = createSlice({
  name: 'adminLogin',
  initialState,
  reducers: {}
});

export const store = createAsyncThunk('adminLoginSlice/store', async (data) => {
  const header = { headers: { 'Content-Type': 'application/json' } };
  return await axios
    .post(process.env.REACT_APP_API_URL + 'api/auth/login', data, header)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      if (error.response) {
        return rejectWithValue({
          status: error.response.status,
          message: error.response?.data?.message || 'Something went wrong'
        });
      }
      return rejectWithValue({ message: error.message });
    });
});

export const register = createAsyncThunk('adminLoginSlice/register', async (data, { rejectWithValue }) => {
  const header = { headers: { 'Content-Type': 'application/json' } };
  return await axios
    .post(process.env.REACT_APP_API_URL + 'api/auth/register', data, header)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      if (error.response) {
        return rejectWithValue({
          status: error.response.status,
          message: error.response.data.message || 'Something went wrong'
        });
      }
      return rejectWithValue({ message: error.message });
    });
});

export const createUser = createAsyncThunk('adminLoginSlice/createUser', async (data) => {
  const header = { headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + data.token } };
  return await axios
    .post(process.env.REACT_APP_API_URL + 'api/users', data.data, header)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      if (error.response) {
        return rejectWithValue({
          status: error.response.status,
          message: error.response.data.message || 'Something went wrong'
        });
      }
      return rejectWithValue({ message: error.message });
    });
});

export const getAllUsers = createAsyncThunk('adminLoginSlice/getAllUsers', async (data) => {
  const header = { headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + data.token } };

  let endpoint = 'api/users/';
  if (data.role) {
    endpoint += '?role=' + data.role;
  }
  return await axios
    .get(process.env.REACT_APP_API_URL + endpoint, null, header)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      if (error.response) {
        return rejectWithValue({
          status: error.response.status,
          message: error.response.data.message || 'Something went wrong'
        });
      }
      return rejectWithValue({ message: error.message });
    });
});

export const getAllDeliveries = createAsyncThunk('adminLoginSlice/getAllDeliveries', async (data) => {
  const header = { headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + data.token } };
  return await axios
    .get(process.env.REACT_APP_API_URL + 'api/delivery', header)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      if (error.response) {
        return rejectWithValue({
          status: error.response.status,
          message: error.response.data.message || 'Something went wrong'
        });
      }
      return rejectWithValue({ message: error.message });
    });
});

export const CreateDelivery = createAsyncThunk('adminLoginSlice/CreateDelivery', async (data) => {
  const header = { headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + data.token } };
  return await axios
    .post(process.env.REACT_APP_API_URL + 'api/delivery', data.data, header)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      if (error.response) {
        return rejectWithValue({
          status: error.response.status,
          message: error.response.data.message || 'Something went wrong'
        });
      }
      return rejectWithValue({ message: error.message });
    });
});

export const UpdateDelivery = createAsyncThunk('adminLoginSlice/UpdateDelivery', async (data) => {
  console.log(data, "data")
  const header = { headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + data.token } };
  return await axios
    .patch(process.env.REACT_APP_API_URL + 'api/delivery/' + data.id, data.data, header)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      if (error.response) {
        return rejectWithValue({
          status: error.response.status,
          message: error.response.data.message || 'Something went wrong'
        });
      }
      return rejectWithValue({ message: error.message });
    });
});

export const GetDeliveryById = createAsyncThunk('adminLoginSlice/GetDeliveryById', async (data) => {
  const header = { headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + data.token } };
  return await axios
    .get(process.env.REACT_APP_API_URL + 'api/delivery/' + data.id, data.data, header)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      if (error.response) {
        return rejectWithValue({
          status: error.response.status,
          message: error.response.data.message || 'Something went wrong'
        });
      }
      return rejectWithValue({ message: error.message });
    });
});

export const getUser = createAsyncThunk('adminLoginSlice/getUser', async (data) => {
  const header = { headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + data.token } };
  return await axios
    .get(process.env.REACT_APP_API_URL + 'api/users/' + data.id, header)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      if (error.response) {
        return rejectWithValue({
          status: error.response.status,
          message: error.response.data.message || 'Something went wrong'
        });
      }
      return rejectWithValue({ message: error.message });
    });
});

export const updateUser = createAsyncThunk('adminLoginSlice/updateUser', async (data) => {
  const header = { headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + data.token } };
  return await axios
    .patch(process.env.REACT_APP_API_URL + 'api/users/' + data.id, data.data, header)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      if (error.response) {
        return rejectWithValue({
          status: error.response.status,
          message: error.response.data.message || 'Something went wrong'
        });
      }
      return rejectWithValue({ message: error.message });
    });
});

export const updateProfile = createAsyncThunk('adminLoginSlice/updateProfile', async (data) => {
  const header = { headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + data.token } };
  return await axios
    .patch(process.env.REACT_APP_API_URL + 'api/auth/profile', data.data, header)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      if (error.response) {
        return rejectWithValue({
          status: error.response.status,
          message: error.response.data.message || 'Something went wrong'
        });
      }
      return rejectWithValue({ message: error.message });
    });
});

export const deactivateUser = createAsyncThunk('adminLoginSlice/deleteUser', async (data) => {
  const header = { headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + data.token } };
  return await axios
    .post(process.env.REACT_APP_API_URL + 'api/users/' + data.id, header)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      if (error.response) {
        return rejectWithValue({
          status: error.response.status,
          message: error.response.data.message || 'Something went wrong'
        });
      }
      return rejectWithValue({ message: error.message });
    });
});

export const getProfile = createAsyncThunk('adminLoginSlice/getUser', async (data) => {
  const header = { headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + data.token } };
  return await axios
    .get(process.env.REACT_APP_API_URL + 'api/users/me/profile', header)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      if (error.response) {
        return rejectWithValue({
          status: error.response.status,
          message: error.response.data.message || 'Something went wrong'
        });
      }
      return rejectWithValue({ message: error.message });
    });
});

export const updateUserPassword = createAsyncThunk('adminLoginSlice/updateUserPassword', async (data, { rejectWithValue }) => {
  const header = { headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + data.token } };
  return await axios
    .patch(process.env.REACT_APP_API_URL + 'api/auth/update-password', data.data, header)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      if (error.response) {
        return rejectWithValue({
          status: error.response.status,
          message: error.response.data.message || 'Something went wrong'
        });
      }
      return rejectWithValue({ message: error.message });
    });
});

export default adminLoginSlice.reducer;
