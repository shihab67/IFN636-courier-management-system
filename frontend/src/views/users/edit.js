import { Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { Box } from '@mui/system';
import { Formik } from 'formik';
import useScriptRef from 'hooks/useScriptRef';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Bounce, toast } from 'react-toastify';
import { getUser, updateUser } from 'store/modules/adminLogin/adminLoginSlice';
import AuthContext from 'store/modules/authContext';
import { useAppDispatch } from 'store/reducer';
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Breadcrumb from 'views/leave-request/partials/breadcrumb';
import * as Yup from 'yup';

export default function EditUser({ others }) {
  const scriptedRef = useScriptRef();
  const dispatch = useAppDispatch();
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const params = useParams();
  const [status, setStatus] = useState('');
  const menu = {
    list: [
      {
        title: 'Users',
        url: '/users'
      }
    ],
    active: 'Edit User'
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await dispatch(
        getUser({
          id: params.id,
          token: authCtx.currentUser.token
        })
      );
      if (response.payload && response.payload.status && response.payload.status === 'success' && response.payload.data) {
        setStatus(response.payload.data.status);
      }
    };

    fetchData();
  }, [dispatch, authCtx.currentUser.token, params.id]);

  return (
    <>
      <Breadcrumb menu={menu} />

      <MainCard title="Edit User" {...others}>
        <Formik
          initialValues={{
            status: '',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            status: Yup.string().required('Status is required')
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              if (scriptedRef.current) {
                setStatus({ success: true });
                setSubmitting(false);
                try {
                  // DISPATCH
                  const response = await dispatch(
                    updateUser({
                      data: { user_id: params.id, status: values.status },
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
                    toast.success(response.payload.message, {
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

                    // Navigate to '/leave-request' after login
                    setTimeout(() => {
                      navigate('/users', { replace: true });
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
              // Set status, errors, and submitting state
              setStatus({ success: false });
              setErrors({ submit: error.message });
              setSubmitting(false);
            }
          }}
        >
          {({ errors, handleChange, handleSubmit, isSubmitting, touched }) => (
            <form noValidate onSubmit={handleSubmit} {...others}>
              <Grid container spacing={2}>
                <Grid md={6} xs={12} item>
                  <FormControl fullWidth error={Boolean(touched.status && errors.status)}>
                    <InputLabel id="demo-simple-select-label">Status</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="status"
                      label="Status"
                      value={status}
                      onChange={(newValue) => {
                        setStatus(newValue.target.value);
                        handleChange({ target: { name: 'status', value: newValue.target.value } });
                      }}
                    >
                      <MenuItem value={'active'}>Active</MenuItem>
                      <MenuItem value={'inactive'}>Inactive</MenuItem>
                      <MenuItem value={'suspended'}>Suspended</MenuItem>
                    </Select>
                  </FormControl>
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
