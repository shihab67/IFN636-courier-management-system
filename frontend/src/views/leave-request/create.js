import '@fontsource/inter';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import Textarea from '@mui/joy/Textarea';
import { Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Formik } from 'formik';
import useScriptRef from 'hooks/useScriptRef';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bounce, toast } from 'react-toastify';
import { createLeave } from 'store/modules/adminLogin/adminLoginSlice';
import AuthContext from 'store/modules/authContext';
import { useAppDispatch } from 'store/reducer';
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import * as Yup from 'yup';

export default function CreateLeave({ ...others }) {
  const scriptedRef = useScriptRef();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [reason, setReason] = useState();
  const dispatch = useAppDispatch();
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <>
      <MainCard title="Create Leave Request" {...others}>
        <Formik
          initialValues={{
            leave_type: '',
            start_date: '',
            end_date: '',
            reason: '',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            leave_type: Yup.number().required('Leave Type is required'),
            start_date: Yup.date().required('Start Date is required'),
            end_date: Yup.date().required('End Date is required'),
            reason: Yup.string().max(255).required('Reason is required')
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              if (scriptedRef.current) {
                setStatus({ success: true });
                setSubmitting(false);

                try {
                  // DISPATCH
                  const response = await dispatch(createLeave({ data: values, token: authCtx.currentUser.token }));
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
                    toast.success('Leave Request created successfully!', {
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
                      navigate('/leave-request/leave-calendar', { replace: true });
                    }, 3000);
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
                  <FormControl fullWidth error={Boolean(touched.leave_type && errors.leave_type)}>
                    <InputLabel id="demo-simple-select-label">Leave Type</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="leave_type"
                      label="Leave Type"
                      onChange={handleChange}
                    >
                      <MenuItem value={1}>Casual Leave</MenuItem>
                      <MenuItem value={2}>Sick Leave</MenuItem>
                      <MenuItem value={3}>Emergency Leave</MenuItem>
                    </Select>
                  </FormControl>
                  {touched.leave_type && errors.leave_type && (
                    <FormHelperText error id="standard-weight-helper-text-leave-type">
                      {errors.leave_type}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid md={6} xs={12} item>
                  <FormControl fullWidth error={Boolean(touched.start_date && errors.start_date)}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        id="start_date"
                        label="Start Date"
                        name="start_date"
                        value={startDate}
                        onChange={(newValue) => {
                          setStartDate(newValue);
                          handleChange({ target: { name: 'start_date', value: newValue.$d.toISOString() } });
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                    {touched.start_date && errors.start_date && (
                      <FormHelperText error id="standard-weight-helper-text-start-date">
                        {errors.start_date}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid md={6} xs={12} item>
                  <FormControl fullWidth error={Boolean(touched.end_date && errors.end_date)}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        id="end_date"
                        label="End Date"
                        name="end_date"
                        value={endDate}
                        onChange={(newValue) => {
                          setEndDate(newValue);
                          handleChange({ target: { name: 'end_date', value: newValue.$d.toISOString() } });
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                    {touched.end_date && errors.end_date && (
                      <FormHelperText error id="standard-weight-helper-text-start-date">
                        {errors.end_date}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid md={12} xs={12} item>
                  <FormControl fullWidth error={Boolean(touched.reason && errors.reason)}>
                    <JoyCssVarsProvider>
                      <CssBaseline enableColorScheme />
                      <Textarea
                        placeholder="Reason..."
                        variant="outlined"
                        minRows={4}
                        name="reason"
                        value={reason}
                        onChange={(newValue) => {
                          setReason(newValue.target.value);
                          handleChange({ target: { name: 'reason', value: newValue.target.value } });
                        }}
                      />
                    </JoyCssVarsProvider>
                    {touched.reason && errors.reason && (
                      <FormHelperText error id="standard-weight-helper-text-start-date">
                        {errors.reason}
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
