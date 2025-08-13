import { Typography } from '@mui/joy';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import { Grid } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getLeave } from 'store/modules/adminLogin/adminLoginSlice';
import AuthContext from 'store/modules/authContext';
import { useAppDispatch } from 'store/reducer';
import MainCard from 'ui-component/cards/MainCard';
import Breadcrumb from './partials/breadcrumb';

export default function LeaveDetails({ others }) {
  const menu = {
    list: [
      {
        title: 'Leave Request',
        url: '/leave-request/leave-list/pending'
      }
    ],
    active: 'Leave Details'
  };

  const authCtx = useContext(AuthContext);
  const dispatch = useAppDispatch();
  const params = useParams();
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await dispatch(
        getLeave({
          id: params.id,
          token: authCtx.currentUser.token
        })
      );
      if (response.payload && response.payload.status && response.payload.status === 'success' && response.payload.data) {
        setData(response.payload.data);
      }
    };

    fetchData();
  }, [dispatch, authCtx.currentUser.token, params.id]);
  return (
    <>
      <Breadcrumb menu={menu} />

      <MainCard title="Leave Details" {...others}>
        <JoyCssVarsProvider>
          <CssBaseline enableColorScheme />
          {data && (
            <Grid container spacing={2}>
              <Grid md={12} xs={12} item display={'flex'} alignItems={'center'}>
                <Typography level="h4" fontSize="xl" mr={2} textTransform={'uppercase'}>
                  Applier:
                </Typography>
                <Typography level="body-lg" fontSize="xl">
                  {data.user?.name}
                </Typography>
              </Grid>

              <Grid md={12} xs={12} item display={'flex'} alignItems={'center'}>
                <Typography level="h4" mr={2} fontSize="xl" textTransform={'uppercase'}>
                  Leave Type:
                </Typography>
                <Typography level="body-lg" fontSize="xl">
                  {data.leave_type?.name}
                </Typography>
              </Grid>

              <Grid md={12} xs={12} item display={'flex'} alignItems={'center'}>
                <Typography level="h4" mr={2} fontSize="xl" textTransform={'uppercase'}>
                  Start Date:
                </Typography>
                <Typography level="body-lg" fontSize="xl">
                  {data.start_date}
                </Typography>
              </Grid>

              <Grid md={12} xs={12} item display={'flex'} alignItems={'center'}>
                <Typography level="h4" mr={2} fontSize="xl" textTransform={'uppercase'}>
                  End Date:
                </Typography>
                <Typography level="body-lg" fontSize="xl">
                  {data.end_date}
                </Typography>
              </Grid>

              <Grid md={12} xs={12} item display={'flex'} alignItems={'center'}>
                <Typography level="h4" mr={2} fontSize="xl" textTransform={'uppercase'}>
                  Reason:
                </Typography>
                <Typography level="body-lg" fontSize="xl">
                  {data.reason}
                </Typography>
              </Grid>

              <Grid md={12} xs={12} item display={'flex'} alignItems={'center'}>
                <Typography level="h4" mr={2} fontSize="xl" textTransform={'uppercase'}>
                  Status:
                </Typography>
                <Typography level="body-lg" fontSize="xl">
                  {data.status}
                </Typography>
              </Grid>

              <Grid md={12} xs={12} item display={'flex'} alignItems={'center'}>
                <Typography level="h4" mr={2} fontSize="xl" textTransform={'uppercase'}>
                  Approved By:
                </Typography>
                <Typography level="body-lg" fontSize="xl">
                  {data.approved_by?.name || '---'}
                </Typography>
              </Grid>

              <Grid md={12} xs={12} item display={'flex'} alignItems={'center'}>
                <Typography level="h4" mr={2} fontSize="xl" textTransform={'uppercase'}>
                  Remarks:
                </Typography>
                <Typography level="body-lg" fontSize="xl">
                  {data.remarks}
                </Typography>
              </Grid>
            </Grid>
          )}
        </JoyCssVarsProvider>
      </MainCard>
    </>
  );
}
