import { MoreVert, ArrowDownward } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Typography } from '@mui/material';
import { CssVarsProvider } from '@mui/joy/styles';
import Chip from '@mui/joy/Chip';
import Dropdown from '@mui/joy/Dropdown';
import IconButton from '@mui/joy/IconButton';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component';
import { useAppDispatch } from 'store/reducer';
import AuthContext from 'store/modules/authContext';
import { deleteUser, getAllUsers } from 'store/modules/adminLogin/adminLoginSlice';
import MainCard from 'ui-component/cards/MainCard';
import Loader from 'ui-component/Loader';

export default function Users({ ...others }) {
  const sortIcon = <ArrowDownward />;
  const dispatch = useAppDispatch();
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Status chip
  const handleStats = (status) => (
    <CssVarsProvider>
      <Chip color={status ? 'success' : 'warning'} variant="soft">
        {status ? 'Active' : 'Inactive'}
      </Chip>
    </CssVarsProvider>
  );

  // Actions column
  const handleActions = (row) => {
    if (authCtx.currentUser.role === 'Admin' && authCtx.currentUser.id !== row.id) {
      return (
        <CssVarsProvider>
          <Dropdown>
            <MenuButton slots={{ root: IconButton }} slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}>
              <MoreVert />
            </MenuButton>
            <Menu>
              <MenuItem component={Link} to={`/users/edit/${row.id}`}>
                Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setSelectedUser(row);
                  setDeleteDialogOpen(true);
                }}
              >
                Delete
              </MenuItem>
            </Menu>
          </Dropdown>
        </CssVarsProvider>
      );
    }
    return '---';
  };

  // Fetch users
  const fetchUsers = async () => {
    const response = await dispatch(getAllUsers({ token: authCtx.currentUser.token }));
    if (response.payload && response.payload.data) {
      const users = response.payload.data.map((user, index) => ({
        id: user._id,
        serial: ++index,
        name: user.name,
        email: user.email,
        role: user.role?.name || '---',
        status: user.status
      }));
      setData(users);
    }
  };

  useEffect(() => {
    if (authCtx.currentUser.role.id === 3) {
      toast.error('You are not allowed to access this page!');
      navigate('/dashboard');
    } else {
      fetchUsers();
    }
  }, [authCtx.currentUser, navigate, dispatch]);

  // Handle delete confirmation
  const handleDelete = async () => {
    if (!selectedUser) return;
    const response = await dispatch(deleteUser({ id: selectedUser.id, token: authCtx.currentUser.token }));
    if (response.payload?.success) {
      toast.success('User deleted successfully!');
      setDeleteDialogOpen(false);
      setSelectedUser(null);
      fetchUsers(); // Refresh list
    } else {
      toast.error(response.payload?.message || 'Failed to delete user');
    }
  };

  return (
    <>
      <MainCard {...others}>
        <Grid container md={12} xs={12} mb={2} justifyContent="space-between" alignItems="center">
          <Typography variant="h3">Users</Typography>
          <Button variant="contained" color="secondary" component={Link} to="/users/create">
            Create New
          </Button>
        </Grid>

        <Grid container spacing={2}>
          <Grid item md={12} xs={12} mb={3}>
            {data.length === 0 && <Loader />}
            <DataTable
              pagination
              responsive
              sortIcon={sortIcon}
              columns={[
                { name: '#', selector: (row) => row.serial },
                { name: 'Name', selector: (row) => row.name },
                { name: 'Email', selector: (row) => row.email },
                { name: 'Role', selector: (row) => row.role },
                { name: 'Status', selector: (row) => row.status, cell: (row) => handleStats(row.status) },
                { name: 'Action', selector: (row) => row.action, cell: (row) => handleActions(row) }
              ]}
              data={data}
            />
          </Grid>
        </Grid>
      </MainCard>

      {/* Delete confirmation modal */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{selectedUser?.name}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
