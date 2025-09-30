import { Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { Box } from '@mui/system';
import { Formik } from 'formik';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { getAllUsers, getTicketById, supportTicketTransition } from 'store/modules/adminLogin/adminLoginSlice';
import AuthContext from 'store/modules/authContext';
import { useAppDispatch } from 'store/reducer';

import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Breadcrumb from 'views/utilities/breadcrumb';

export default function AssignSupportTicketForm({ ...others }) {
  const dispatch = useAppDispatch();
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams(); // ticket id

  const [loading, setLoading] = useState(true);
  const [couriers, setCouriers] = useState([]);
  const [ticket, setTicket] = useState(null);

  const menu = useMemo(
    () => ({
      list: [{ title: 'Support Tickets', url: '/support-tickets' }],
      active: 'Assign Courier'
    }),
    []
  );

  // Gate: only Admins can assign
  useEffect(() => {
    if (authCtx?.currentUser?.role !== 'Admin') {
      toast.warning('Only Admins can assign tickets');
      navigate('/support-tickets', { replace: true });
    }
  }, [authCtx, navigate]);

  // Load ticket + couriers
  useEffect(() => {
    const load = async () => {
      try {
        const [tRes, cRes] = await Promise.all([
          dispatch(getTicketById({ id, token: authCtx.currentUser.token })),
          dispatch(getAllUsers({ role: 'Courier', token: authCtx.currentUser.token }))
        ]);

        if (tRes.payload?.success) setTicket(tRes.payload.data);
        else throw new Error(tRes.payload?.message || 'Failed to load ticket');

        if (cRes.payload?.success) setCouriers(cRes.payload.data || []);
        else throw new Error(cRes.payload?.message || 'Failed to load couriers');
      } catch (err) {
        toast.error(err.message);
        navigate('/support-tickets', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [dispatch, id, authCtx.currentUser.token, navigate]);

  if (loading) return <p>Loading…</p>;

  return (
    <>
      <Breadcrumb menu={menu} />
      <MainCard title={`Assign Courier — ${ticket?.title || ''}`} {...others}>
        <Formik
          initialValues={{
            assigneeId: ticket?.assignedTo?._id || ''
          }}
          validationSchema={Yup.object().shape({
            assigneeId: Yup.string().required('Please select a courier')
          })}
          enableReinitialize
          onSubmit={async ({ assigneeId }, { setSubmitting, setErrors }) => {
            try {
              const res = await dispatch(
                supportTicketTransition({
                  id,
                  data: { action: 'assign', assigneeId },
                  token: authCtx.currentUser.token
                })
              );

              if (res.payload?.success) {
                toast.success('Ticket assigned successfully');
                navigate(`/support-tickets`, { replace: true });
              } else {
                setErrors({ submit: res.payload?.message || 'Assignment failed' });
              }
            } catch (err) {
              setErrors({ submit: err.message });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
            <form noValidate onSubmit={handleSubmit} {...others}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={Boolean(touched.assigneeId && errors.assigneeId)}>
                    <InputLabel id="assignee-select-label">Courier</InputLabel>
                    <Select
                      labelId="assignee-select-label"
                      id="assignee-select"
                      name="assigneeId"
                      label="Courier"
                      value={values.assigneeId}
                      onChange={handleChange}
                    >
                      {couriers.length === 0 && (
                        <MenuItem disabled value="">
                          No couriers found
                        </MenuItem>
                      )}
                      {couriers.map((c) => (
                        <MenuItem key={c._id} value={c._id}>
                          {c.name || c.fullName || c.email}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.assigneeId && errors.assigneeId && <FormHelperText error>{errors.assigneeId}</FormHelperText>}
                  </FormControl>
                </Grid>

                {errors.submit && (
                  <Grid item xs={12}>
                    <Box sx={{ mt: 1 }}>
                      <FormHelperText error>{errors.submit}</FormHelperText>
                    </Box>
                  </Grid>
                )}

                <Grid item xs={12} md={6}>
                  <Box sx={{ mt: { xs: 2, md: 0 } }}>
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
                        Assign
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
