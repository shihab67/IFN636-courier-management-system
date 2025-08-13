import { useSelector } from 'react-redux';

import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import axios from 'axios';
import NavigationScroll from 'layout/NavigationScroll';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './store/modules/authContext';

// ==============================|| APP ||============================== //

const App = () => {
  const customization = useSelector((state) => state.customization);

  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  // SET HEADER
  authCtx.header();
  useEffect(() => {
    // SET AUTHORIZATION REQUEST

    // IS NOT LOGGED IN
    const requestedRoute = window.location.pathname;
    if (!authCtx.isLoggedIn && requestedRoute !== '/register') {
      return navigate('/');
    }
    // HAS ERROR ON REQUEST
    axios.interceptors.response.use(null, (error) => {
      if (!error.response) {
        return;
      }
      if (error.response.status === 403) {
        authCtx.logout();
        return navigate('/');
      }

      return Promise.reject(error);
    });
  }, [authCtx, navigate]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        <NavigationScroll>
          <Routes />
        </NavigationScroll>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
