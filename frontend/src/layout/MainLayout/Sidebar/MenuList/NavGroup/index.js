import PropTypes from 'prop-types';

// material-ui
import { List, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import { useContext } from 'react';
import AuthContext from 'store/modules/authContext';
import NavCollapse from '../NavCollapse';
import NavItem from '../NavItem';

// ==============================|| SIDEBAR MENU LIST GROUP ||============================== //

const NavGroup = ({ item }) => {
  const theme = useTheme();
  const authCtx = useContext(AuthContext);

  // menu list collapse & items
  const items = item.children?.map((menu) => {
    switch (menu.type) {
      case 'collapse':
        return <NavCollapse key={menu.id} menu={menu} level={1} />;
      case 'item':
        return menu.role.includes(authCtx.currentUser.role) ? <NavItem key={menu.id} item={menu} level={1} l /> : null;
      default:
        return (
          <Typography key={menu.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return (
    <>
      <List
        subheader={
          item.title && (
            <Typography variant="caption" sx={{ ...theme.typography.menuCaption }} display="block" gutterBottom>
              {item.title}
              {item.caption && (
                <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
                  {item.caption}
                </Typography>
              )}
            </Typography>
          )
        }
      >
        {items}
      </List>
    </>
  );
};

NavGroup.propTypes = {
  item: PropTypes.object
};

export default NavGroup;
