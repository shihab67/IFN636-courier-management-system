import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import Typography from '@mui/joy/Typography';
import { Grid } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  return (
    <>
      <CssBaseline />
      <JoyCssVarsProvider>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography level="h1" fontSize="xl3">
              Dashboard
            </Typography>
          </Grid>
        </Grid>
      </JoyCssVarsProvider>
    </>
  );
};

export default Dashboard;
