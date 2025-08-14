import { Typography } from '@mui/joy';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import { Grid } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import React, { useContext, useEffect, useState } from 'react';
import { getProfile } from 'store/modules/adminLogin/adminLoginSlice';
import AuthContext from 'store/modules/authContext';
import { useAppDispatch } from 'store/reducer';
import MainCard from 'ui-component/cards/MainCard';
import Breadcrumb from 'views/utilities/breadcrumb';
export default function UserProfile({ others }) {
  const menu = {
    list: [
      {
        title: 'Dashboard',
        url: '/dashboard'
      }
    ],
    active: 'My Profile'
  };

  const authCtx = useContext(AuthContext);
  const dispatch = useAppDispatch();
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await dispatch(
        getProfile({
          id: authCtx.currentUser.id,
          token: authCtx.currentUser.token
        })
      );
      if (response.payload && response.payload?.success) {
        setData(response.payload.data);
      }
    };

    fetchData();
  }, [dispatch, authCtx.currentUser.token, authCtx.currentUser.id, setData]);
  return (
    <>
      <Breadcrumb menu={menu} />

      <MainCard title="My Profile" {...others}>
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
                  {data.status === true ? 'Active' : 'Inactive'}
                </Typography>
              </Grid>
            </Grid>
          )}
        </JoyCssVarsProvider>
      </MainCard>
    </>
  );
}
