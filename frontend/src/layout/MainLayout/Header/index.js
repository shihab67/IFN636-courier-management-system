import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase } from '@mui/material';

// project imports
import LogoSection from '../LogoSection';
import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';
import AuthContext from 'store/modules/authContext';
import { useContext, useEffect, useState } from 'react';
import { useAppDispatch } from 'store/reducer';

// assets
import { IconMenu2 } from '@tabler/icons-react';
import { getNotifications } from 'store/modules/adminLogin/adminLoginSlice';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
  const theme = useTheme();
  const authCtx = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
      const load = async () => {
        try {
          const res = await dispatch(getNotifications({ token: authCtx.currentUser.token }));
          if (res.payload?.success) {
            setNotifications(res.payload.data);
          } else {
            throw new Error(res.payload?.message || 'Failed to fetch notifications');
          }
        } catch (err) {
          toast.error(err.message);
        }
      };
      load();
    }, [dispatch, authCtx.currentUser.token]);

  return (
    <>
      {/* logo & toggler button */}
      <Box
        sx={{
          width: 228,
          display: 'flex',
          [theme.breakpoints.down('md')]: {
            width: 'auto'
          }
        }}
      >
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
          <LogoSection />
        </Box>
        <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }}>
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out',
              background: theme.palette.secondary.light,
              color: theme.palette.secondary.dark,
              '&:hover': {
                background: theme.palette.secondary.dark,
                color: theme.palette.secondary.light
              }
            }}
            onClick={handleLeftDrawerToggle}
            color="inherit"
          >
            <IconMenu2 stroke={1.5} size="1.3rem" />
          </Avatar>
        </ButtonBase>
      </Box>

      {/* header search */}
      <SearchSection />
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />

      {/* notification & profile */}
      <NotificationSection notifications={notifications} />
      <ProfileSection />
    </>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func
};

export default Header;
