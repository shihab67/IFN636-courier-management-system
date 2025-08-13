import { useContext, useEffect, useState } from 'react';

import { Grid } from '@mui/material';

import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardContent from '@mui/joy/CardContent';
import CircularProgress from '@mui/joy/CircularProgress';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import Typography from '@mui/joy/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import { IconForms } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { getStat } from 'store/modules/adminLogin/adminLoginSlice';
import AuthContext from 'store/modules/authContext';
import { useAppDispatch } from 'store/reducer';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const dispatch = useAppDispatch();
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      const response = await dispatch(
        getStat({
          token: authCtx.currentUser.token
        })
      );
      if (response.payload && response.payload.status && response.payload.status === 'success' && response.payload.data) {
        setStats(response.payload.data);
      }
    };

    fetchData();
  }, [dispatch, authCtx.currentUser.token, setStats]);

  return (
    <>
      <JoyCssVarsProvider>
        <CssBaseline enableColorScheme />
        <Grid container sx={{ gap: 2, flexWrap: 'wrap', p: 0, m: 0 }}>
          <Grid item>
            <Card variant="solid" color="primary" invertedColors sx={{ flexGrow: 1 }}>
              <CardContent orientation="horizontal">
                <CircularProgress size="lg" determinate>
                  <IconForms />
                </CircularProgress>
                <CardContent>
                  <Typography level="body-md">Total Requests</Typography>
                  <Typography level="h2">{stats.all_leaves || 0}</Typography>
                </CardContent>
              </CardContent>
              <CardActions>
                <Button variant="soft" size="sm" component={Link} to="/leave-request/leave-list/all">
                  View
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item>
            <Card variant="solid" color="warning" invertedColors sx={{ flexGrow: 1 }}>
              <CardContent orientation="horizontal">
                <CircularProgress size="lg" determinate>
                  <IconForms />
                </CircularProgress>
                <CardContent>
                  <Typography level="body-md">Pending Requests</Typography>
                  <Typography level="h2">{stats.pending_leaves || 0}</Typography>
                </CardContent>
              </CardContent>
              <CardActions>
                <Button variant="soft" size="sm" component={Link} to="/leave-request/leave-list/pending">
                  View
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item>
            <Card variant="solid" color="success" invertedColors sx={{ flexGrow: 1 }}>
              <CardContent orientation="horizontal">
                <CircularProgress size="lg" determinate>
                  <IconForms />
                </CircularProgress>
                <CardContent>
                  <Typography level="body-md">Approved Requests</Typography>
                  <Typography level="h2">{stats.approved_leaves || 0}</Typography>
                </CardContent>
              </CardContent>
              <CardActions>
                <Button variant="soft" size="sm" component={Link} to="/leave-request/leave-list/approved">
                  View
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item>
            <Card variant="solid" color="danger" invertedColors sx={{ flexGrow: 1 }}>
              <CardContent orientation="horizontal">
                <CircularProgress size="lg" determinate>
                  <IconForms />
                </CircularProgress>
                <CardContent>
                  <Typography level="body-md">Rejected Requests</Typography>
                  <Typography level="h2">{stats.rejected_leaves || 0}</Typography>
                </CardContent>
              </CardContent>
              <CardActions>
                <Button variant="soft" size="sm" component={Link} to="/leave-request/leave-list/rejected">
                  View
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </JoyCssVarsProvider>
    </>
  );
};

export default Dashboard;
