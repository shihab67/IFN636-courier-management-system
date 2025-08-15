import '@fontsource/inter';
import { CssBaseline, Textarea } from '@mui/joy';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import { Button, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput } from '@mui/material';
import { Box } from '@mui/system';
import { Formik } from 'formik';
import useScriptRef from 'hooks/useScriptRef';
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CreateDelivery } from 'store/modules/adminLogin/adminLoginSlice';
import AuthContext from 'store/modules/authContext';
import { useAppDispatch } from 'store/reducer';
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Breadcrumb from 'views/utilities/breadcrumb';
import * as Yup from 'yup';

export default function CreateDeliveryForm({ ...others }) {
  const scriptedRef = useScriptRef();
  const dispatch = useAppDispatch();
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const menu = {
    list: [{ title: 'Deliveries', url: '/deliveries' }],
    active: 'Create Delivery'
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
      <MainCard title="Create Delivery" {...others}>
        <Formik
          initialValues={{
            packageDescription: '',
            weight: '',
            price: '',
            pickupAddress: '',
            deliveryAddress: ''
          }}
          validationSchema={Yup.object().shape({
            packageDescription: Yup.string().required('Package description is required'),
            weight: Yup.number().required('Weight is required in kg').positive(),
            price: Yup.number().required('Price is required'),
            pickupAddress: Yup.string().required('Pickup Address is required').nullable(false),
            deliveryAddress: Yup.string().required('Delivery Address is required').nullable(false)
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              if (scriptedRef.current) {
                setStatus({ success: true });
                setSubmitting(false);
                const response = await dispatch(CreateDelivery({ data: values, token: authCtx.currentUser.token }));
                if (response.payload && response.payload.success) {
                  toast.success('Delivery created successfully!');
                  setTimeout(() => navigate('/deliveries', { replace: true }), 2000);
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
          {({ values, errors, touched, handleChange, handleSubmit, isSubmitting, setFieldValue }) => (
            <form noValidate onSubmit={handleSubmit} {...others}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth error={Boolean(touched.packageDescription && errors.packageDescription)}>
                    <JoyCssVarsProvider>
                      <CssBaseline enableColorScheme />
                      <Textarea
                        placeholder="Package Description..."
                        variant="outlined"
                        minRows={4}
                        name="packageDescription"
                        value={values.packageDescription}
                        onChange={handleChange}
                      />
                    </JoyCssVarsProvider>
                    {touched.packageDescription && errors.packageDescription && (
                      <FormHelperText error>{errors.packageDescription}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <FormControl fullWidth error={Boolean(touched.weight && errors.weight)}>
                    <InputLabel htmlFor="weight">Weight (kg)</InputLabel>
                    <OutlinedInput
                      id="weight"
                      type="number"
                      name="weight"
                      value={values.weight}
                      onChange={(e) => {
                        handleChange(e);
                        const newWeight = parseFloat(e.target.value) || 0;
                        const calculatedPrice = newWeight * 5; // Example: $5 per kg
                        setFieldValue('price', calculatedPrice);
                      }}
                      label="Weight"
                    />
                    {touched.weight && errors.weight && <FormHelperText error>{errors.weight}</FormHelperText>}
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <FormControl fullWidth error={Boolean(touched.price && errors.price)}>
                    <InputLabel htmlFor="price">Price</InputLabel>
                    <OutlinedInput id="price" type="number" name="price" value={values.price} disabled label="Price" />
                    {touched.price && errors.price && <FormHelperText error>{errors.price}</FormHelperText>}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth error={Boolean(touched.pickupAddress && errors.pickupAddress)}>
                    <JoyCssVarsProvider>
                      <CssBaseline enableColorScheme />
                      <Textarea
                        placeholder="Pickup Address..."
                        variant="outlined"
                        minRows={4}
                        name="pickupAddress"
                        value={values.pickupAddress}
                        onChange={handleChange}
                      />
                    </JoyCssVarsProvider>
                    {touched.pickupAddress && errors.pickupAddress && <FormHelperText error>{errors.pickupAddress}</FormHelperText>}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth error={Boolean(touched.deliveryAddress && errors.deliveryAddress)}>
                    <JoyCssVarsProvider>
                      <CssBaseline enableColorScheme />
                      <Textarea
                        placeholder="Delivery Address..."
                        variant="outlined"
                        minRows={4}
                        name="deliveryAddress"
                        value={values.deliveryAddress}
                        onChange={handleChange}
                      />
                    </JoyCssVarsProvider>
                    {touched.deliveryAddress && errors.deliveryAddress && <FormHelperText error>{errors.deliveryAddress}</FormHelperText>}
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
                        Create Delivery
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
