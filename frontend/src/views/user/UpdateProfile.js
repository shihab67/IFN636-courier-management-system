import '@fontsource/inter';
import { CssBaseline, Textarea } from '@mui/joy';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import { Button, CircularProgress, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput } from '@mui/material';
import { Box } from '@mui/system';
import { Formik } from 'formik';
import useScriptRef from 'hooks/useScriptRef';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProfile, updateProfile } from 'store/modules/adminLogin/adminLoginSlice';
import AuthContext from 'store/modules/authContext';
import { useAppDispatch } from 'store/reducer';
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Breadcrumb from 'views/utilities/breadcrumb';
import * as Yup from 'yup';

export default function EditUser({ ...others }) {
  const { id } = useParams();
  const [address, setAddress] = useState(null);
  const scriptedRef = useScriptRef();
  const dispatch = useAppDispatch();
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const phoneRegExp = /^(\+61|0)[2-478](\d{8})$/;

  const [initialValues, setInitialValues] = useState(null);

  const menu = {
    list: [{ title: 'My Profile', url: '/user/profile' }],
    active: 'Update Profile'
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await dispatch(getProfile({ id: id, token: authCtx.currentUser.token }));
        if (res.payload?.success) {
          setInitialValues({
            name: res.payload.data.name || '',
            email: res.payload.data.email || '',
            phone_number: res.payload.data.phone_number || ''
          });
          setAddress(res.payload.data.address || '');
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch user data');
      }
    };
    fetchUser();
  }, [id, authCtx]);

  if (!initialValues) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Breadcrumb menu={menu} />

      <MainCard title="Update Profile" {...others}>
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={Yup.object().shape({
            name: Yup.string().required('Name is required'),
            email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
            phone_number: Yup.string().matches(phoneRegExp, 'Invalid Australian phone number').required('Phone number is required'),
            address: Yup.string().required('Address is required').nullable(false)
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              if (scriptedRef.current) {
                setStatus({ success: true });
                setSubmitting(false);

                const response = await dispatch(updateProfile({ id, data: values, token: authCtx.currentUser.token }));

                if (response.payload && response.payload.success) {
                  toast.success('Profile updated successfully!');
                  setTimeout(() => navigate('/user/profile', { replace: true }), 2000);
                } else {
                  setErrors({ submit: response.payload?.message || 'Something went wrong' });
                }
              }
            } catch (err) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }}
        >
          {({ values, errors, handleChange, handleSubmit, isSubmitting, touched }) => (
            <form noValidate onSubmit={handleSubmit} {...others}>
              <Grid container spacing={2}>
                <Grid md={6} xs={12} item>
                  <FormControl fullWidth error={Boolean(touched.name && errors.name)}>
                    <InputLabel htmlFor="name">Name</InputLabel>
                    <OutlinedInput id="name" type="text" name="name" value={values.name} onChange={handleChange} label="Name" />
                    {touched.name && errors.name && <FormHelperText error>{errors.name}</FormHelperText>}
                  </FormControl>
                </Grid>

                <Grid md={6} xs={12} item>
                  <FormControl fullWidth error={Boolean(touched.email && errors.email)}>
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <OutlinedInput id="email" type="email" name="email" value={values.email} onChange={handleChange} label="Email" />
                    {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
                  </FormControl>
                </Grid>

                <Grid md={6} xs={12} item>
                  <FormControl fullWidth error={Boolean(touched.phone_number && errors.phone_number)}>
                    <InputLabel htmlFor="phone_number">Phone Number</InputLabel>
                    <OutlinedInput
                      id="phone_number"
                      type="text"
                      name="phone_number"
                      value={values.phone_number}
                      onChange={handleChange}
                      label="Phone Number"
                    />
                    {touched.phone_number && errors.phone_number && <FormHelperText error>{errors.phone_number}</FormHelperText>}
                  </FormControl>
                </Grid>

                <Grid md={12} xs={12} item>
                  <FormControl fullWidth error={Boolean(touched.address && errors.address)}>
                    <JoyCssVarsProvider>
                      <CssBaseline enableColorScheme />
                      <Textarea
                        placeholder="Address..."
                        variant="outlined"
                        minRows={4}
                        name="address"
                        value={address}
                        onChange={(newValue) => {
                          setAddress(newValue.target.value);
                          handleChange({ target: { name: 'address', value: newValue.target.value } });
                        }}
                      />
                    </JoyCssVarsProvider>
                    {touched.address && errors.address && (
                      <FormHelperText error id="standard-weight-helper-text-start-date">
                        {errors.address}
                      </FormHelperText>
                    )}
                  </FormControl>
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
                        Update
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
