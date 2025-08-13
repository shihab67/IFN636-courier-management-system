import { Link, useNavigate } from 'react-router-dom';

import { Divider, Grid, Typography } from '@mui/material';

// project imports
import { useContext, useEffect } from 'react';
import Logo from 'ui-component/Logo';
import AuthFooter from 'ui-component/cards/AuthFooter';
import AuthContext from '../../../../store/modules/authContext';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthWrapper1 from '../AuthWrapper1';
import AuthLogin from '../auth-forms/AuthLogin';

// assets

// ================================|| AUTH3 - LOGIN ||================================ //

const Login = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (authCtx.isLoggedIn) {
      navigate('/dashboard', { replace: true });
    }
  });

  return (
    <>
      {!authCtx.isLoggedIn && (
        <AuthWrapper1>
          <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
            <Grid item xs={12}>
              <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                  <AuthCardWrapper>
                    <Grid container spacing={2} alignItems="center" justifyContent="center">
                      <Grid item sx={{ mb: 3 }}>
                        <Link to="#">
                          <Logo />
                        </Link>
                      </Grid>
                      <Grid item xs={12}>
                        <AuthLogin />
                      </Grid>
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12}>
                        <Grid item container direction="column" alignItems="center" xs={12}>
                          <Typography component={Link} to="/register" variant="subtitle1" sx={{ textDecoration: 'none' }}>
                            Don&apos;t have an account?
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </AuthCardWrapper>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
              <AuthFooter />
            </Grid>
          </Grid>
        </AuthWrapper1>
      )}
    </>
  );
};

export default Login;
