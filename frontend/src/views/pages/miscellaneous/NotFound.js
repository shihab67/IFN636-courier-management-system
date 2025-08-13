import { Button, Grid, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import AuthFooter from 'ui-component/cards/AuthFooter';
import AuthWrapper1 from '../authentication/AuthWrapper1';

// assets
import { IconError404 } from '@tabler/icons-react';

export default function NotFound() {
  return (
    <>
      <AuthWrapper1>
        <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
          <Grid item xs={12}>
            <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
              <Grid item sx={{ m: { xs: 1, sm: 3 }, textAlign: 'center' }}>
                <IconError404 stroke={1.7} size="4rem" />
                <Typography variant="h1" className="mb-2">
                  Page Not Found
                </Typography>

                <Link to="/dashboard">
                  <Button variant="contained" color="secondary">
                    Back to Home
                  </Button>
                </Link>
              </Grid>
            </Grid>
            <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
              <AuthFooter />
            </Grid>
          </Grid>
        </Grid>
      </AuthWrapper1>
    </>
  );
}
