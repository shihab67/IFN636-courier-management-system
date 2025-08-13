import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Button, FormControl, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/system';
import { Formik } from 'formik';
import useScriptRef from 'hooks/useScriptRef';
import React, { useContext, useState } from 'react';
import { Bounce, toast } from 'react-toastify';
import { updateUserPassword } from 'store/modules/adminLogin/adminLoginSlice';
import AuthContext from 'store/modules/authContext';
import { useAppDispatch } from 'store/reducer';
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Breadcrumb from 'views/leave-request/partials/breadcrumb';
import * as Yup from 'yup';

export default function UserSettings({ others }) {
  const menu = {
    list: [
      {
        title: 'Dashboard',
        url: '/dashboard'
      }
    ],
    active: 'Account Settings'
  };

  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const dispatch = useAppDispatch();
  const authCtx = useContext(AuthContext);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowPasswordConfirm = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };

  const handleClickCurrentPassword = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <>
      <Breadcrumb menu={menu} />

      <MainCard title="Update Password" {...others}>
        <Formik
          initialValues={{
            current_password: '',
            password: '',
            password_confirmation: '',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            current_password: Yup.string().max(255).required('Current password is required'),
            password: Yup.string().max(255).required('Password is required').min(6, 'Password must be at least 6 characters'),
            password_confirmation: Yup.string()
              .max(255)
              .required('Password confirm is required')
              .oneOf([Yup.ref('password'), null], 'Password does not match')
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              if (scriptedRef.current) {
                setStatus({ success: true });
                setSubmitting(false);
                console.log(values);

                try {
                  // DISPATCH
                  const response = await dispatch(
                    updateUserPassword({
                      data: {
                        current_password: values.current_password,
                        password: values.password,
                        password_confirmation: values.password_confirmation
                      },
                      token: authCtx.currentUser.token
                    })
                  );
                  if (
                    response.payload &&
                    response.payload.response &&
                    response.payload.response.data &&
                    response.payload.response.data.message
                  ) {
                    setErrors({ submit: response.payload.response.data.message });
                    return;
                  } else if (
                    response.payload &&
                    response.payload.response &&
                    response.payload.response.data &&
                    response.payload.response.data.errors &&
                    response.payload.response.data.errors.length > 0
                  ) {
                    setErrors({ submit: response.payload.response.data.errors[0] });
                  } else if (response.payload && response.payload.status && response.payload.status === 'success') {
                    toast.success('Password updated successfully!', {
                      position: 'top-right',
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: 'colored',
                      transition: Bounce
                    });

                    toast.success('Use your new password to login', {
                      position: 'top-right',
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: 'colored',
                      transition: Bounce
                    });

                    // Navigate to '/' after password is updated
                    setTimeout(() => {
                      authCtx.logout();
                    }, 1000);
                  } else {
                    setErrors({ submit: 'Something went wrong' });
                  }
                } catch (error) {
                  console.log(error);
                }
              }
            } catch (err) {
              console.error(err);
              if (scriptedRef.current) {
                setStatus({ success: false });
                setErrors({ submit: err.message });
                setSubmitting(false);
              }
            }
          }}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <form noValidate onSubmit={handleSubmit} {...others}>
              <Grid container>
                <Grid item xs={12} md={6}>
                  <FormControl
                    fullWidth
                    error={Boolean(touched.current_password && errors.current_password)}
                    sx={{ ...theme.typography.customInput }}
                  >
                    <InputLabel htmlFor="outlined-adornment-current-password-register">Current Password</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-current-password-register"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={values.current_password}
                      name="current_password"
                      label="Current Password"
                      onBlur={handleBlur}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickCurrentPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            size="large"
                          >
                            {showCurrentPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                      inputProps={{}}
                    />
                    {touched.current_password && errors.current_password && (
                      <FormHelperText error id="standard-weight-helper-text-current-password-register">
                        {errors.current_password}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password-register"
                      type={showPassword ? 'text' : 'password'}
                      value={values.password}
                      name="password"
                      label="Password"
                      onBlur={handleBlur}
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
              </Grid>

              <Grid container>
                <Grid item xs={12} md={6}>
                  <FormControl
                    fullWidth
                    error={Boolean(touched.password_confirmation && errors.password_confirmation)}
                    sx={{ ...theme.typography.customInput }}
                  >
                    <InputLabel htmlFor="outlined-adornment-password-confirmation-register">Confirm Password</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password-confirmation-register"
                      type={showPasswordConfirm ? 'text' : 'password'}
                      value={values.password_confirmation}
                      name="password_confirmation"
                      label="Confirm Password"
                      onBlur={handleBlur}
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
              </Grid>

              <Grid container>
                <Grid item xs={12} md={12}>
                  {errors.submit && (
                    <Box sx={{ mt: 3 }}>
                      <FormHelperText error>{errors.submit}</FormHelperText>
                    </Box>
                  )}
                </Grid>
              </Grid>

              <Grid container sx={{ mt: 2 }}>
                <Grid item xs={2} md={2}>
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
                      Update
                    </Button>
                  </AnimateButton>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </MainCard>
    </>
  );
}
