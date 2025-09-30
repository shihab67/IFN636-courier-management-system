import '@fontsource/inter';
import { CssBaseline, Textarea } from '@mui/joy';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import { Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import { Box } from '@mui/system';
import { Formik } from 'formik';
import useScriptRef from 'hooks/useScriptRef';
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createSupportTicket } from 'store/modules/adminLogin/adminLoginSlice';
import AuthContext from 'store/modules/authContext';
import { useAppDispatch } from 'store/reducer';
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Breadcrumb from 'views/utilities/breadcrumb';
import * as Yup from 'yup';

export default function CreateSupportTicketForm({ ...others }) {
  const scriptedRef = useScriptRef();
  const dispatch = useAppDispatch();
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const menu = {
    list: [{ title: 'support Tickets', url: '/support-tickets' }],
    active: 'Create Ticket'
  };

  useEffect(() => {
    if (['Admin', 'Courier'].includes(authCtx.currentUser.role)) {
      toast.warning('You do not have permission to access this page');
      navigate('/dashboard', { replace: true });
    }
  }, [authCtx, navigate]);

  return (
    <>
      <Breadcrumb menu={menu} />
      <MainCard title="Create Support Ticket" {...others}>
        <Formik
          initialValues={{
            title: '',
            category: '',
            description: '',
            priority: ''
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string().required('Title is required'),
            category: Yup.string().required('Category is required'),
            description: Yup.string().required('Description is required'),
            priority: Yup.string().required('Priority is required')
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              if (scriptedRef.current) {
                setStatus({ success: true });
                setSubmitting(false);
                const response = await dispatch(createSupportTicket({ data: values, token: authCtx.currentUser.token }));
                if (response.payload && response.payload.success) {
                  toast.success('Ticket created successfully!');
                  setTimeout(() => navigate('/support-tickets', { replace: true }), 2000);
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
          {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
            <form noValidate onSubmit={handleSubmit} {...others}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth error={Boolean(touched.title && errors.title)}>
                    <InputLabel htmlFor="title">Title</InputLabel>
                    <OutlinedInput
                      id="title"
                      type="text"
                      name="title"
                      value={values.title}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      label="Title"
                    />
                    {touched.title && errors.title && <FormHelperText error>{errors.title}</FormHelperText>}
                  </FormControl>
                </Grid>

                <Grid md={6} xs={12} item>
                  <FormControl fullWidth error={Boolean(touched.category && errors.category)}>
                    <InputLabel id="demo-simple-select-label">Category</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="category"
                      label="Category"
                      onChange={handleChange}
                    >
                      <MenuItem value={'DELIVERY'}>Delivery</MenuItem>
                      <MenuItem value={'BILLING'}>Billing</MenuItem>
                      <MenuItem value={'TECH'}>Tech</MenuItem>
                      <MenuItem value={'GENERAL'}>General</MenuItem>
                    </Select>
                    {touched.category && errors.category && (
                      <FormHelperText error id="standard-weight-helper-text-leave-type">
                        {errors.category}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid md={6} xs={12} item>
                  <FormControl fullWidth error={Boolean(touched.priority && errors.priority)}>
                    <InputLabel id="demo-simple-select-label">Priority</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="priority"
                      label="Priority"
                      onChange={handleChange}
                    >
                      <MenuItem value={'LOW'}>Low</MenuItem>
                      <MenuItem value={'MEDIUM'}>Medium</MenuItem>
                      <MenuItem value={'HIGH'}>High</MenuItem>
                      <MenuItem value={'URGENT'}>Urgent</MenuItem>
                    </Select>
                    {touched.priority && errors.priority && (
                      <FormHelperText error id="standard-weight-helper-text-leave-type">
                        {errors.priority}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth error={Boolean(touched.description && errors.description)}>
                    <JoyCssVarsProvider>
                      <CssBaseline enableColorScheme />
                      <Textarea
                        placeholder="Description..."
                        variant="outlined"
                        minRows={4}
                        name="description"
                        value={values.description}
                        onChange={handleChange}
                      />
                    </JoyCssVarsProvider>
                    {touched.description && errors.description && (
                      <FormHelperText error>{errors.description}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {errors.submit && (
                  <Grid item xs={12}>
                    <Box sx={{ mt: 1 }}>
                      <FormHelperText error>{errors.submit}</FormHelperText>
                    </Box>
                  </Grid>
                )}

                <Grid item xs={12}>
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
                        Create Ticket
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
