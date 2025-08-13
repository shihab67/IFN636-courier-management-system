// material-ui
import { Link, Stack, Typography } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
  <Stack direction="row" justifyContent="space-between">
    <Typography
      variant="subtitle2"
      component={Link}
      href="https://github.com/shihab67/IFN636-courier-management-system"
      target="_blank"
      underline="hover"
    >
      SwiftShip
    </Typography>
    <Typography
      variant="subtitle2"
      component={Link}
      href="https://github.com/shihab67/IFN636-courier-management-system"
      target="_blank"
      underline="hover"
    >
      &copy; {new Date().getFullYear()}
      {'.'}
      Created by IFN636 Team
    </Typography>
  </Stack>
);

export default AuthFooter;
