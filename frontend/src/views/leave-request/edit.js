import { Textarea } from '@mui/joy';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import { Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/system';
import { Formik } from 'formik';
import useScriptRef from 'hooks/useScriptRef';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Bounce, toast } from 'react-toastify';
import { approveLeave, getLeave } from 'store/modules/adminLogin/adminLoginSlice';
import AuthContext from 'store/modules/authContext';
import { useAppDispatch } from 'store/reducer';
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import * as Yup from 'yup';
import Breadcrumb from '../utilities/breadcrumb';

export default function EditLeave({ others }) {
  const scriptedRef = useScriptRef();
  const [remarks, setRemarks] = useState('');
  const dispatch = useAppDispatch();
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const params = useParams();
  const [leaveStatus, setLeaveStatus] = useState('');
  const menu = {
    list: [
      {
        title: 'Leave Request',
        url: '/leave-request/leave-list/pending'
      }
    ],
    active: 'Edit Leave Request'
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await dispatch(
        getLeave({
          id: params.id,
          token: authCtx.currentUser.token
        })
      );
      if (response.payload && response.payload.status && response.payload.status === 'success' && response.payload.data) {
        setLeaveStatus(response.payload.data.status);
        setRemarks(response.payload.data.remarks);
      }
    };

    fetchData();
  }, [dispatch, authCtx.currentUser.token, params.id]);

  return (
    <>
      <Breadcrumb menu={menu} />

      <MainCard title="Edit Leave Request" {...others}>
        <Formik
          initialValues={{
            status: '',
            remarks: '',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            status: Yup.string().required('Status required')
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              if (scriptedRef.current) {
                setStatus({ success: true });
                setSubmitting(false);
                try {
                  // DISPATCH
                  const response = await dispatch(
                    approveLeave({
                      data: { leave_request_id: params.id, status: values.status, remarks },
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
                      navigate('/leave-request/leave-list/pending', { replace: true });
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
                      value={leaveStatus}
                      onChange={(newValue) => {
                        setLeaveStatus(newValue.target.value);
                        handleChange({ target: { name: 'status', value: newValue.target.value } });
                      }}
                    >
                      <MenuItem value={'pending'}>Pending</MenuItem>
                      <MenuItem value={'approved'}>Approved</MenuItem>
                      <MenuItem value={'rejected'}>Rejected</MenuItem>
                    </Select>
                  </FormControl>
                  {touched.status && errors.status && (
                    <FormHelperText error id="standard-weight-helper-text-leave-type">
                      {errors.status}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid md={12} xs={12} item>
                  <FormControl fullWidth error={Boolean(touched.remarks && errors.remarks)}>
                    <JoyCssVarsProvider>
                      <CssBaseline enableColorScheme />
                      <Textarea
                        placeholder="Remarks..."
                        variant="outlined"
                        minRows={4}
                        name="remarks"
                        value={remarks}
                        onChange={(newValue) => {
                          setRemarks(newValue.target.value);
                          handleChange({ target: { name: 'remarks', value: newValue.target.value } });
                        }}
                      />
                    </JoyCssVarsProvider>
                    {touched.remarks && errors.remarks && (
                      <FormHelperText error id="standard-weight-helper-text-start-date">
                        {errors.remarks}
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
