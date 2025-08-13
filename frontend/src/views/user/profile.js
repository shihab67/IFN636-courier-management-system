import { Typography } from '@mui/joy';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import { Grid } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import React, { useContext, useEffect, useState } from 'react';
import { getUser } from 'store/modules/adminLogin/adminLoginSlice';
import AuthContext from 'store/modules/authContext';
import { useAppDispatch } from 'store/reducer';
import MainCard from 'ui-component/cards/MainCard';
import Breadcrumb from 'views/leave-request/partials/breadcrumb';
export default function UserProfile({ others }) {
  const menu = {
    list: [
      {
        title: 'Dashboard',
        url: '/dashboard'
      }
    ],
    active: 'User Profile'
  };

  const authCtx = useContext(AuthContext);
  const dispatch = useAppDispatch();
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await dispatch(
        getUser({
          id: authCtx.currentUser.id,
          token: authCtx.currentUser.token
        })
      );
      if (response.payload && response.payload.status && response.payload.status === 'success' && response.payload.data) {
        setData(response.payload.data);
      }
    };

    fetchData();
  }, [dispatch, authCtx.currentUser.token, authCtx.currentUser.id, setData]);
  return (
    <>
      <Breadcrumb menu={menu} />

      <MainCard title="User Profile" {...others}>
        <JoyCssVarsProvider>
          <CssBaseline enableColorScheme />
          {data && (
            <Grid container spacing={2}>
              <Grid md={12} xs={12} item display={'flex'} alignItems={'center'}>
                <Typography level="h4" fontSize="xl" mr={2} textTransform={'uppercase'}>
                  Name:
                </Typography>
                <Typography level="body-lg" fontSize="xl">
                  {data.name}
                </Typography>
              </Grid>

              <Grid md={12} xs={12} item display={'flex'} alignItems={'center'}>
                <Typography level="h4" fontSize="xl" mr={2} textTransform={'uppercase'}>
                  Email:
                </Typography>
                <Typography level="body-lg" fontSize="xl">
                  {data.email}
                </Typography>
              </Grid>

              <Grid md={12} xs={12} item display={'flex'} alignItems={'center'}>
                <Typography level="h4" fontSize="xl" mr={2} textTransform={'uppercase'}>
                  Role:
                </Typography>
                <Typography level="body-lg" fontSize="xl">
                  {data.role?.name || '---'}
                </Typography>
              </Grid>

              <Grid md={12} xs={12} item display={'flex'} alignItems={'center'}>
                <Typography level="h4" fontSize="xl" mr={2} textTransform={'uppercase'}>
                  Status:
                </Typography>
                <Typography level="body-lg" fontSize="xl">
                  {data.status}
                </Typography>
              </Grid>

              <Grid md={12} xs={12} item display={'flex'} alignItems={'center'}>
                <Typography level="h4" fontSize="xl" mr={2} textTransform={'uppercase'}>
                  Leaves Taken:
                </Typography>
                <Typography level="body-lg" fontSize="xl">
                  {data.all_leaves?.length || 0}
                </Typography>
              </Grid>

              <Grid md={12} xs={12} item display={'flex'} alignItems={'center'}>
                <Typography level="h4" fontSize="xl" mr={2} textTransform={'uppercase'}>
                  Pending Leaves:
                </Typography>
                <Typography level="body-lg" fontSize="xl">
                  {data.pending_leaves?.length || 0}
                </Typography>
              </Grid>

              <Grid md={12} xs={12} item display={'flex'} alignItems={'center'}>
                <Typography level="h4" fontSize="xl" mr={2} textTransform={'uppercase'}>
                  Approved Leaves:
                </Typography>
                <Typography level="body-lg" fontSize="xl">
                  {data.approved_leaves?.length || 0}
                </Typography>
              </Grid>

              <Grid md={12} xs={12} item display={'flex'} alignItems={'center'}>
                <Typography level="h4" fontSize="xl" mr={2} textTransform={'uppercase'}>
                  Rejected Leaves:
                </Typography>
                <Typography level="body-lg" fontSize="xl">
                  {data.rejected_leaves?.length || 0}
                </Typography>
              </Grid>
            </Grid>
          )}
        </JoyCssVarsProvider>
      </MainCard>
    </>
  );
}
