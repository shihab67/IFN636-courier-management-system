import { Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { Box } from '@mui/system';
import { Formik } from 'formik';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { getTicketById, supportTicketTransition } from 'store/modules/adminLogin/adminLoginSlice';
import AuthContext from 'store/modules/authContext';
import { useAppDispatch } from 'store/reducer';

import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Breadcrumb from 'views/utilities/breadcrumb';

const STATUS_OPTIONS = [
  { value: 'OPEN', label: 'Open' },
  { value: 'ASSIGNED', label: 'Assigned' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'REQUEST_INFO', label: 'Request Info' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'CLOSED', label: 'Closed' }
];

export default function UpdateSupportTicketStatus({ ...others }) {
  const dispatch = useAppDispatch();
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState(null);

  const menu = useMemo(
    () => ({
      list: [{ title: 'Support Tickets', url: '/support-tickets' }],
      active: 'Update Status'
    }),
    []
  );

  // Gate: only Admins can update status
  useEffect(() => {
    if (authCtx?.currentUser?.role !== 'Admin') {
      toast.warning('Only Admins can update status');
      navigate('/support-tickets', { replace: true });
    }
  }, [authCtx, navigate]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await dispatch(getTicketById({ id, token: authCtx.currentUser.token }));
        if (res.payload?.success) {
          setTicket(res.payload.data);
        } else {
          throw new Error(res.payload?.message || 'Failed to load ticket');
        }
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
      <MainCard title={`Update Status — ${ticket?.title || ''}`} {...others}>
        <Formik
          initialValues={{
            status: ticket?.status || 'OPEN'
          }}
          validationSchema={Yup.object().shape({
            status: Yup.string().required('Please select a status')
          })}
          enableReinitialize
          onSubmit={async ({ status }, { setSubmitting, setErrors }) => {
            try {
              const res = await dispatch(
                supportTicketTransition({
                  id,
                  data: { action: status.toLowerCase() }, // backend expects "start_progress", "resolve", etc
                  token: authCtx.currentUser.token
                })
              );

              if (res.payload?.success) {
                toast.success('Ticket status updated');
                navigate('/support-tickets', { replace: true });
              } else {
                setErrors({ submit: res.payload?.message || 'Status update failed' });
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
                  <FormControl fullWidth error={Boolean(touched.status && errors.status)}>
                    <InputLabel id="status-select-label">Status</InputLabel>
                    <Select
                      labelId="status-select-label"
                      id="status-select"
                      name="status"
                      value={values.status}
                      label="Status"
                      onChange={handleChange}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <MenuItem key={s.value} value={s.value}>
                          {s.label}
                        </MenuItem>
                      ))}
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
                        Update Status
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
