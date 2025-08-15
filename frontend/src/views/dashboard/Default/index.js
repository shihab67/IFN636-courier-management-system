import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardContent from '@mui/joy/CardContent';
import CircularProgress from '@mui/joy/CircularProgress';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import { Grid, Typography } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { IconTruckDelivery } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  return (
    <>
      <CssBaseline />
      <JoyCssVarsProvider>
        <CssBaseline enableColorScheme />
        <Grid container sx={{ gap: 2, flexWrap: 'wrap', p: 0, m: 0 }}>
          <Grid item>
            <Card variant="solid" color="primary" invertedColors sx={{ flexGrow: 1 }}>
              <CardContent orientation="horizontal">
                <CircularProgress size="lg" determinate>
                  <IconTruckDelivery />
                </CircularProgress>
                <CardContent>
                  <Typography level="body-md">Total Deliveries</Typography>
                  <Typography level="h2">13445</Typography>
                </CardContent>
              </CardContent>
              <CardActions>
                <Button variant="soft" size="sm" component={Link} to="/deliveries">
                  View
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item>
            <Card variant="solid" color="warning" invertedColors sx={{ flexGrow: 1 }}>
              <CardContent orientation="horizontal">
                <CircularProgress size="lg" determinate>
                  <IconTruckDelivery />
                </CircularProgress>
                <CardContent>
                  <Typography level="body-md">Pending Deliveries</Typography>
                  <Typography level="h2">67</Typography>
                </CardContent>
              </CardContent>
              <CardActions>
                <Button variant="soft" size="sm" component={Link} to="/deliveries">
                  View
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item>
            <Card variant="solid" color="success" invertedColors sx={{ flexGrow: 1 }}>
              <CardContent orientation="horizontal">
                <CircularProgress size="lg" determinate>
                  <IconTruckDelivery />
                </CircularProgress>
                <CardContent>
                  <Typography level="body-md">Completed Deliveries</Typography>
                  <Typography level="h2">56000</Typography>
                </CardContent>
              </CardContent>
              <CardActions>
                <Button variant="soft" size="sm" component={Link} to="/deliveries">
                  View
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item>
            <Card variant="solid" color="danger" invertedColors sx={{ flexGrow: 1 }}>
              <CardContent orientation="horizontal">
                <CircularProgress size="lg" determinate>
                  <IconTruckDelivery />
                </CircularProgress>
                <CardContent>
                  <Typography level="body-md">Cancelled Deliveries</Typography>
                  <Typography level="h2">5</Typography>
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
