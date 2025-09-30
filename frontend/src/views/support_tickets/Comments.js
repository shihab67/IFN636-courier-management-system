import { CssBaseline, Textarea } from '@mui/joy';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import {
  Avatar,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography
} from '@mui/material';
import { Box } from '@mui/system';
import { Formik } from 'formik';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { addTicketComment, getTicketById, getTicketComments } from 'store/modules/adminLogin/adminLoginSlice';
import AuthContext from 'store/modules/authContext';
import { useAppDispatch } from 'store/reducer';

import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Breadcrumb from 'views/utilities/breadcrumb';

export default function TicketComments({ ...others }) {
  const dispatch = useAppDispatch();
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams(); // ticket id

  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);

  const menu = useMemo(
    () => ({
      list: [{ title: 'Support Tickets', url: '/support-tickets' }],
      active: 'Comments'
    }),
    []
  );

  // Load ticket + comments
  useEffect(() => {
    const load = async () => {
      try {
        const [tRes, cRes] = await Promise.all([
          dispatch(getTicketById({ id, token: authCtx.currentUser.token })),
          dispatch(getTicketComments({ id, token: authCtx.currentUser.token }))
        ]);

        if (tRes.payload?.success) setTicket(tRes.payload.data);
        else throw new Error(tRes.payload?.message || 'Failed to load ticket');

        if (cRes.payload?.success) {
          const sorted = [...(cRes.payload.data || [])].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          setComments(sorted);
        } else {
          throw new Error(cRes.payload?.message || 'Failed to load comments');
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

  // ---- Permission logic ----
  const role = authCtx?.currentUser?.role;
  const meId = authCtx?.currentUser?._id || authCtx?.currentUser?.id;
  const assignedToId = ticket?.assignedTo?._id || ticket?.assignedTo || null;

  const isClosed = ticket?.status === 'CLOSED';
  const canComment =
    !isClosed && (role === 'Admin' || role === 'Customer' || (role === 'Courier' && assignedToId && String(assignedToId) === String(meId)));

  // Helper to pick a display name
  const displayName = (u) => u?.name || u?.fullName || u?.email || 'Unknown User';

  const getAvatarUrl = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=eea61b&color=fff&bold=true`;
  };

  return (
    <>
      <Breadcrumb menu={menu} />
      <MainCard title={`Comments — ${ticket?.title || ''}`} {...others}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {comments.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No comments yet.
              </Typography>
            ) : (
              <List sx={{ width: '100%' }}>
                {comments.map((c, i) => (
                  <React.Fragment key={c._id || i}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar src={getAvatarUrl(c.authorId?.name)} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="subtitle2">{displayName(c.authorId)}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(c.createdAt).toLocaleString()}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" color="text.primary" sx={{ whiteSpace: 'pre-wrap' }}>
                            {c.message}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {i < comments.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Grid>

          {/* Composer */}
          {canComment ? (
            <Grid item xs={12}>
              <Formik
                initialValues={{ message: '' }}
                validationSchema={Yup.object().shape({
                  message: Yup.string().trim().required('Please enter a comment')
                })}
                onSubmit={async ({ message }, { resetForm, setErrors, setSubmitting }) => {
                  try {
                    const res = await dispatch(
                      addTicketComment({
                        id,
                        data: { message },
                        token: authCtx.currentUser.token
                      })
                    );

                    if (res.payload?.success) {
                      // append to list, keep ASC order
                      const newComment = res.payload.data;
                      setComments((prev) => [...prev, newComment].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
                      resetForm();
                    } else {
                      setErrors({ submit: res.payload?.message || 'Failed to add comment' });
                    }
                  } catch (err) {
                    setErrors({ submit: err.message });
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
                  <form noValidate onSubmit={handleSubmit}>
                    <FormControl fullWidth error={Boolean(touched.message && errors.message)}>
                      <JoyCssVarsProvider>
                        <CssBaseline enableColorScheme />
                        <Textarea
                          placeholder="Write a comment..."
                          variant="outlined"
                          minRows={3}
                          name="message"
                          value={values.message}
                          onChange={handleChange}
                        />
                      </JoyCssVarsProvider>
                      {touched.message && errors.message && <FormHelperText error>{errors.message}</FormHelperText>}
                    </FormControl>

                    {errors.submit && (
                      <Box sx={{ mt: 1 }}>
                        <FormHelperText error>{errors.submit}</FormHelperText>
                      </Box>
                    )}

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                      <AnimateButton>
                        <Button disableElevation disabled={isSubmitting} size="large" type="submit" variant="contained" color="secondary">
                          Add Comment
                        </Button>
                      </AnimateButton>
                    </Box>
                  </form>
                )}
              </Formik>
            </Grid>
          ) : (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                {isClosed ? 'This ticket is closed. Comments are disabled.' : 'You do not have permission to comment on this ticket.'}
              </Typography>
            </Grid>
          )}
        </Grid>
      </MainCard>
    </>
  );
}
