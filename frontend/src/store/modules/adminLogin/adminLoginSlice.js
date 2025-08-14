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

export const getAllLeaves = createAsyncThunk('adminLoginSlice/getAllLeaves', async (data) => {
  const header = { headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + data.token } };
  return await axios
    .get(process.env.REACT_APP_API_URL + 'api/leave-request/all/' + data.type, null, header)
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

export const getLeave = createAsyncThunk('adminLoginSlice/getLeave', async (data) => {
  const header = { headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + data.token } };
  return await axios
    .get(process.env.REACT_APP_API_URL + 'api/leave-request/' + data.id, null, header)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error;
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

export const approveLeave = createAsyncThunk('adminLoginSlice/approveLeave', async (data) => {
  const header = { headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + data.token } };
  return await axios
    .post(process.env.REACT_APP_API_URL + 'api/leave-request/update', data.data, header)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error;
    });
});

export const getAllUsers = createAsyncThunk('adminLoginSlice/getAllUsers', async (data) => {
  const header = { headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + data.token } };
  return await axios
    .get(process.env.REACT_APP_API_URL + 'api/users/', null, header)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error;
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
      return error;
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

export const getStat = createAsyncThunk('adminLoginSlice/getStat', async (data) => {
  const header = { headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + data.token } };
  return await axios
    .get(process.env.REACT_APP_API_URL + 'api/stats/', null, header)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error;
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
