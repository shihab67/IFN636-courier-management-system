import '@fontsource/inter';
import { Button, CircularProgress, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { Box } from '@mui/system';
import { Formik } from 'formik';
import useScriptRef from 'hooks/useScriptRef';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllUsers, GetDeliveryById, UpdateDelivery } from 'store/modules/adminLogin/adminLoginSlice';
import AuthContext from 'store/modules/authContext';
import { useAppDispatch } from 'store/reducer';
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Breadcrumb from 'views/utilities/breadcrumb';
import * as Yup from 'yup';

export default function EditDelivery({ ...others }) {
  const { id } = useParams();
  const scriptedRef = useScriptRef();
  const dispatch = useAppDispatch();
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const [deliveryMen, setDeliveryMen] = useState([]);
  const [initialData, setInitialData] = useState(null);

  const menu = {
    list: [{ title: 'Deliveries', url: '/deliveries' }],
    active: 'Edit Delivery'
  };

  // Load delivery men list
  useEffect(() => {
    const fetchDeliveryMen = async () => {
      const res = await dispatch(getAllUsers({ role: 'Courier', token: authCtx.currentUser.token }));
      if (res.payload && res.payload.success) {
        setDeliveryMen(res.payload.data);
      }
    };

    if (authCtx.currentUser.role === 'Admin') fetchDeliveryMen();
  }, [dispatch, authCtx.currentUser.token]);

  // Load existing delivery data
  useEffect(() => {
    const fetchDelivery = async () => {
      const res = await dispatch(GetDeliveryById({ id, token: authCtx.currentUser.token }));
      if (res.payload && res.payload.success) {
        setInitialData(res.payload.data);
      }
    };
    fetchDelivery();
  }, [dispatch, id, authCtx.currentUser.token]);

  if (!initialData)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );

  return (
    <>
      <Breadcrumb menu={menu} />

      <MainCard title="Edit Delivery" {...others}>
        <Formik
          enableReinitialize
          initialValues={{
            deliveryManId: initialData.courierId._id || '',
            status: initialData.status || ''
          }}
          validationSchema={Yup.object().shape({
            deliveryManId: Yup.string().required('Delivery man is required'),
            status: Yup.string().required('Status is required')
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              if (scriptedRef.current) {
                setStatus({ success: true });
                setSubmitting(false);

                const response = await dispatch(
                  UpdateDelivery({
                    id,
                    data: values,
                    token: authCtx.currentUser.token
                  })
                );

                if (response.payload && response.payload.success) {
                  toast.success('Delivery updated successfully!');
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
          {({ values, errors, touched, handleSubmit, isSubmitting, setFieldValue }) => (
            <form noValidate onSubmit={handleSubmit} {...others}>
              <Grid container spacing={2}>
                {authCtx.currentUser.role === 'Admin' && (
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={Boolean(touched.deliveryManId && errors.deliveryManId)}>
                      <InputLabel id="delivery-man">Delivery Man</InputLabel>
                      <Select
                        labelId="delivery-man"
                        id="deliveryManId"
                        name="deliveryManId"
                        label="Delivery Man"
                        value={values.deliveryManId}
                        onChange={(e) => setFieldValue('deliveryManId', e.target.value)}
                      >
                        {deliveryMen.map((man) => (
                          <MenuItem key={man._id} value={man._id}>
                            {man.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.deliveryManId && errors.deliveryManId && <FormHelperText error>{errors.deliveryManId}</FormHelperText>}
                    </FormControl>
                  </Grid>
                )}

                {/* Status Dropdown */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={Boolean(touched.status && errors.status)}>
                    <InputLabel id="status">Status</InputLabel>
                    <Select
                      labelId="status"
                      id="statusId"
                      name="status"
                      label="Status"
                      value={values.status}
                      onChange={(e) => setFieldValue('status', e.target.value)}
                    >
                      {authCtx.currentUser.role === 'Admin' && (
                        <>
                          <MenuItem value="Pending">Pending</MenuItem>
                          <MenuItem value="In Transit">In Transit</MenuItem>
                        </>
                      )}
                      <MenuItem value="Out For Delivery">Out for Delivery</MenuItem>
                      <MenuItem value="Delivered">Delivered</MenuItem>

                      {authCtx.currentUser.role === 'Admin' && <MenuItem value="Cancelled">Cancelled</MenuItem>}
                    </Select>
                    {touched.status && errors.status && <FormHelperText error>{errors.status}</FormHelperText>}
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
                      <Button disableElevation disabled={isSubmitting} size="large" type="submit" variant="contained" color="secondary">
                        Update Delivery
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
