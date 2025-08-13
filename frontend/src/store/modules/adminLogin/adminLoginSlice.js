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
    .post(process.env.REACT_APP_API_URL + 'api/login', data, header)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error;
    });
});

export const register = createAsyncThunk('adminLoginSlice/register', async (data) => {
  const header = { headers: { 'Content-Type': 'application/json' } };
  return await axios
    .post(process.env.REACT_APP_API_URL + 'api/register', data, header)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error;
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
      return error;
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

export const createLeave = createAsyncThunk('adminLoginSlice/createLeave', async (data) => {
  const header = { headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + data.token } };
  return await axios
    .post(process.env.REACT_APP_API_URL + 'api/leave-request', data.data, header)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error;
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
    .get(process.env.REACT_APP_API_URL + 'api/user/' + data.id, null, header)
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
    .post(process.env.REACT_APP_API_URL + 'api/user/update-status', data.data, header)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error;
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

export const updateUserPassword = createAsyncThunk('adminLoginSlice/updateUserPassword', async (data) => {
  const header = { headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + data.token } };
  return await axios
    .post(process.env.REACT_APP_API_URL + 'api/user/update-password', data.data, header)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error;
    });
});

export default adminLoginSlice.reducer;
