import { MoreVert } from '@mui/icons-material';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import Chip from '@mui/joy/Chip';
import Dropdown from '@mui/joy/Dropdown';
import IconButton from '@mui/joy/IconButton';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import { Grid } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import React, { useContext, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Link, useNavigate } from 'react-router-dom';
import { Bounce, toast } from 'react-toastify';
import { getAllUsers } from 'store/modules/adminLogin/adminLoginSlice';
import AuthContext from 'store/modules/authContext';
import { useAppDispatch } from 'store/reducer';
import MainCard from 'ui-component/cards/MainCard';

export default function Users({ ...others }) {
  const sortIcon = <ArrowDownward />;
  const columns = [
    {
      name: '#',
      selector: (row) => row.serial
    },
    {
      name: 'Name',
      selector: (row) => row.name
    },
    {
      name: 'Email',
      selector: (row) => row.email
    },
    {
      name: 'Role',
      selector: (row) => row.role
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      cell: (row) => handleStats(row.status)
    },
    {
      name: 'Action',
      selector: (row) => row.action,
      cell: (row) => handleActions(row.id, row.user_id, row.role_id)
    }
  ];
  const dispatch = useAppDispatch();
  const authCtx = useContext(AuthContext);
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const handleStats = (status) => {
    switch (status) {
      case 'active':
        return (
          <JoyCssVarsProvider>
            <CssBaseline enableColorScheme />
            <Chip color="success" variant="soft">
              Active
            </Chip>
          </JoyCssVarsProvider>
        );
      case 'inactive':
        return (
          <JoyCssVarsProvider>
            <CssBaseline enableColorScheme />
            <Chip color="warning" variant="soft">
              Inactive
            </Chip>
          </JoyCssVarsProvider>
        );
      case 'suspended':
        return (
          <JoyCssVarsProvider>
            <CssBaseline enableColorScheme />
            <Chip color="danger" variant="soft">
              Suspended
            </Chip>
          </JoyCssVarsProvider>
        );
    }
  };

  const handleActions = (id, user_id, role_id) => {
    if (
      (authCtx.currentUser.role.id === 1 && authCtx.currentUser.id !== user_id) ||
      (authCtx.currentUser.role.id === 2 && authCtx.currentUser.id !== user_id && role_id !== 1)
    ) {
      return (
        <JoyCssVarsProvider>
          <CssBaseline enableColorScheme />
          <Dropdown>
            <MenuButton slots={{ root: IconButton }} slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}>
              <MoreVert />
            </MenuButton>
            <Menu>
              <MenuItem component={Link} to={`/users/edit/${id}`}>
                Edit
              </MenuItem>
            </Menu>
          </Dropdown>
        </JoyCssVarsProvider>
      );
    } else {
      return '---';
    }
  };
  useEffect(() => {
    if (authCtx.currentUser.role.id === 3) {
      toast.success('You are not allowed to access this page!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        transition: Bounce
      });

      navigate('/dashboard');
    } else {
      const fetchData = async () => {
        const response = await dispatch(
          getAllUsers({
            token: authCtx.currentUser.token
          })
        );
        if (response.payload && response.payload.data) {
          const users = response.payload.data.map((user, index) => {
            return {
              id: user.id,
              role_id: user.role_id,
              user_id: user.id,
              serial: ++index,
              name: user.name,
              email: user.email,
              role: user.role?.name || '---',
              status: user.status
            };
          });
          setData(users);
        }
      };

      fetchData();
    }
  }, [dispatch, authCtx.currentUser.token, authCtx.currentUser.role.id, navigate]);
  return (
    <>
      <MainCard title="Users" {...others}>
        <Grid container spacing={2}>
          <Grid item md={12} xs={12} mb={3}>
            <DataTable pagination responsive sortIcon={sortIcon} columns={columns} data={data} />
          </Grid>
        </Grid>
      </MainCard>
    </>
  );
}
