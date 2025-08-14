import '@fontsource/inter';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Switch
} from '@mui/material';
import { Box } from '@mui/system';
import { Formik } from 'formik';
import useScriptRef from 'hooks/useScriptRef';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createUser } from 'store/modules/adminLogin/adminLoginSlice';
import AuthContext from 'store/modules/authContext';
import { useAppDispatch } from 'store/reducer';
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Breadcrumb from 'views/utilities/breadcrumb';
import * as Yup from 'yup';

export default function CreateLeave({ ...others }) {
  const scriptedRef = useScriptRef();
  const dispatch = useAppDispatch();
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const menu = {
    list: [
      {
        title: 'Users',
        url: '/users'
      }
    ],
    active: 'Create new user'
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowPasswordConfirm = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Breadcrumb menu={menu} />

      <MainCard title="Create new user" {...others}>
        <Formik
          initialValues={{
            name: '',
            email: '',
            role: '',
            password: '',
            password_confirmation: '',
            status: true,
            submit: null
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required('Name is required'),
            email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
            role: Yup.string().required('Role is required'),
            password: Yup.string().max(255).required('Password is required'),
            password_confirmation: Yup.string()
              .max(255)
              .required('Password Confirmation is required')
              .oneOf([Yup.ref('password'), null], 'Passwords must match')
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              if (scriptedRef.current) {
                setStatus({ success: true });
                setSubmitting(false);

                try {
                  // DISPATCH
                  const response = await dispatch(createUser({ data: values, token: authCtx.currentUser.token }));
                  if (response.payload && response.payload.success) {
                    toast.success('User created successfully!');

                    // Navigate to '/users' after delay
                    setTimeout(() => {
                      navigate('/users', { replace: true });
                    }, 3000);
                  } else {
                    setErrors({ submit: response.payload?.message || 'Something went wrong' });
                  }
                } catch (error) {
                  console.error(error);
                }
              }
            } catch (err) {
              console.error(err);
              // Set status, errors, and submitting state
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }}
        >
          {({ values, errors, handleChange, handleSubmit, isSubmitting, touched, setFieldValue }) => (
            <form noValidate onSubmit={handleSubmit} {...others}>
              <Grid container spacing={2}>
                <Grid md={6} xs={12} item>
                  <FormControl fullWidth error={Boolean(touched.name && errors.name)}>
                    <InputLabel htmlFor="name">Name</InputLabel>
                    <OutlinedInput id="name" type="text" name="name" onChange={handleChange} label="Name" inputProps={{}} />
                    {touched.name && errors.name && (
                      <FormHelperText error id="standard-weight-helper-text-leave-type">
                        {errors.name}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid md={6} xs={12} item>
                  <FormControl fullWidth error={Boolean(touched.email && errors.email)}>
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <OutlinedInput id="email" type="email" name="email" onChange={handleChange} label="Email" inputProps={{}} />
                    {touched.email && errors.email && (
                      <FormHelperText error id="standard-weight-helper-text-leave-type">
                        {errors.email}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid md={6} xs={12} item>
                  <FormControl fullWidth error={Boolean(touched.password && errors.password)}>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <OutlinedInput
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      label="Password"
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            size="large"
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                      inputProps={{}}
                    />
                    {touched.password && errors.password && (
                      <FormHelperText error id="standard-weight-helper-text-password-register">
                        {errors.password}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid md={6} xs={12} item>
                  <FormControl fullWidth error={Boolean(touched.password_confirmation && errors.password_confirmation)}>
                    <InputLabel htmlFor="password-confirmation">Confirm Password</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password-confirmation-register"
                      type={showPasswordConfirm ? 'text' : 'password'}
                      name="password_confirmation"
                      label="Confirm Password"
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPasswordConfirm}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            size="large"
                          >
                            {showPasswordConfirm ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                      inputProps={{}}
                    />
                    {touched.password_confirmation && errors.password_confirmation && (
                      <FormHelperText error id="standard-weight-helper-text-password-confirmation-register">
                        {errors.password_confirmation}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid md={6} xs={12} item>
                  <FormControl fullWidth error={Boolean(touched.role && errors.role)}>
                    <InputLabel id="demo-simple-select-label">Role</InputLabel>
                    <Select labelId="demo-simple-select-label" id="demo-simple-select" name="role" label="Role" onChange={handleChange}>
                      <MenuItem value={'Admin'}>Admin</MenuItem>
                    </Select>
                    {touched.role && errors.role && (
                      <FormHelperText error id="standard-weight-helper-text-leave-type">
                        {errors.role}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid md={12} xs={12} item>
                  <FormControlLabel
                    control={<Switch name="status" checked={values.status} onChange={(e) => setFieldValue('status', e.target.checked)} />}
                    label="Status"
                  />
                  {touched.status && errors.status && (
                    <FormHelperText error id="standard-weight-helper-text-leave-type">
                      {errors.status}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid md={12} xs={12} item>
                  {errors.submit && (
                    <Box sx={{ mt: 3 }}>
                      <FormHelperText error>{errors.submit}</FormHelperText>
                    </Box>
                  )}
                </Grid>

                <Grid item>
                  <Box sx={{ mt: 2 }}>
                    <AnimateButton>
                      <Button
                        disableElevation
                        disabled={isSubmitting}
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        color="secondary"
                      >
                        Submit
                      </Button>
                    </AnimateButton>
                  </Box>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </MainCard>
    </>
  );
}
