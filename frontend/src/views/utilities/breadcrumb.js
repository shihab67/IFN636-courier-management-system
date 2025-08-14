import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import Typography from '@mui/joy/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export default function Breadcrumb(props) {
  return (
    <JoyCssVarsProvider>
      <CssBaseline enableColorScheme />
      <Breadcrumbs aria-label="breadcrumbs">
        {props.menu.list.map((item) => (
          <Link key={item.title} color="neutral" component={RouterLink} to={item.url}>
            {item.title}
          </Link>
        ))}
        <Typography>{props.menu.active}</Typography>
      </Breadcrumbs>
    </JoyCssVarsProvider>
  );
}
