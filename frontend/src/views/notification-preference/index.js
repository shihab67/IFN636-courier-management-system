import { CssBaseline } from '@mui/joy';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import { Box, Button, FormControl, FormHelperText, Grid, Switch, Typography } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import useScriptRef from 'hooks/useScriptRef';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import AuthContext from 'store/modules/authContext';
import { useAppDispatch } from 'store/reducer';
import { getNotificationPreference, updateNotificationPreference } from 'store/modules/adminLogin/adminLoginSlice';

import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Breadcrumb from 'views/utilities/breadcrumb';

export default function NotificationPreference({ ...others }) {
  const scriptedRef = useScriptRef();
  const dispatch = useAppDispatch();
  const authCtx = useContext(AuthContext);

  const [initialLoading, setInitialLoading] = useState(true);
  const [initialEnabled, setInitialEnabled] = useState(true);

  const menu = {
    list: [{ title: 'Dashboard', url: '/dashboard' }],
    active: 'Notification Preference'
  };

  // fetch current pref on mount
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await dispatch(getNotificationPreference({ token: authCtx.currentUser.token }));
        if (mounted) {
          if (res.payload?.success) {
            setInitialEnabled(!!res.payload.data.enabled);
          } else {
            toast.error(res.payload?.message || 'Failed to load preference');
          }
        }
      } catch (e) {
        toast.error(e.message || 'Failed to load preference');
      } finally {
        if (mounted) setInitialLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [dispatch, authCtx.currentUser.token]);

  return (
    <>
      <Breadcrumb menu={menu} />
      <MainCard title="Notification Preference" {...others}>
        <JoyCssVarsProvider>
          <CssBaseline enableColorScheme />
        </JoyCssVarsProvider>

        {initialLoading ? (
          <Typography variant="body2">Loading…</Typography>
        ) : (
          <Formik
            enableReinitialize
            initialValues={{ enabled: initialEnabled }}
            validationSchema={Yup.object().shape({
              enabled: Yup.boolean().required()
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
              try {
                if (scriptedRef.current) {
                  setStatus({ success: true });
                  setSubmitting(false);

                  const res = await dispatch(
                    updateNotificationPreference({
                      data: values,
                      token: authCtx.currentUser.token
                    })
                  );

                  if (res.payload?.success) {
                    toast.success(`Notifications ${res.payload.data.enabled ? 'enabled' : 'disabled'}`);
                  } else {
                    setErrors({ submit: res.payload?.message || 'Update failed' });
                  }
                }
              } catch (err) {
                setStatus({ success: false });
                setErrors({ submit: err.message });
                setSubmitting(false);
              }
            }}
          >
            {({ values, errors, touched, handleSubmit, setFieldValue, isSubmitting }) => (
              <form noValidate onSubmit={handleSubmit} {...others}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={Boolean(touched.enabled && errors.enabled)}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          p: 2,
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider'
                        }}
                      >
                        <Box>
                          <Typography variant="subtitle1">In-app notifications</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Toggle to mute or enable all in-app notifications.
                          </Typography>
                        </Box>
                        <Switch checked={values.enabled} onChange={(e) => setFieldValue('enabled', e.target.checked)} color="secondary" />
                      </Box>
                      {touched.enabled && errors.enabled && <FormHelperText error>{errors.enabled}</FormHelperText>}
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
                    <Box sx={{ mt: 2, maxWidth: 360 }}>
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
                          Save Preference
                        </Button>
                      </AnimateButton>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        )}
      </MainCard>
    </>
  );
}
