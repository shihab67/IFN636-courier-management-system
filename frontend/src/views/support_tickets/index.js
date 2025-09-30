import { ArrowDownward, MoreVert } from '@mui/icons-material';
import Dropdown from '@mui/joy/Dropdown';
import IconButton from '@mui/joy/IconButton';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import { CssVarsProvider } from '@mui/joy/styles';
import { Button, Chip, Grid, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import { getAllSupportTickets } from 'store/modules/adminLogin/adminLoginSlice';
import AuthContext from 'store/modules/authContext';
import { useAppDispatch } from 'store/reducer';
import MainCard from 'ui-component/cards/MainCard';

export default function Users({ ...others }) {
  const sortIcon = <ArrowDownward />;
  const dispatch = useAppDispatch();
  const authCtx = useContext(AuthContext);
  const [data, setData] = useState([]);

  // Status chip
  const handleStats = (status) => {
    let color;

    switch (status) {
      case 'OPEN':
        color = 'secondary';
        break;
      case 'ASSIGNED':
        color = 'primary';
        break;
      case 'IN_PROGRESS':
      case 'REQUEST_INFO':
        color = 'warning';
        break;
      case 'RESOLVED':
      case 'CLOSED':
        color = 'success';
        break;
      default:
        break;
    }

    let formattedStatus = status
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

    return <Chip size="small" color={color} label={formattedStatus} />;
  };

  const handleDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // 2-digit day
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 2-digit month (months are 0-indexed)
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  // Actions column
  const handleActions = (row) => {
	console.log(row)
    return (
      <CssVarsProvider>
        <Dropdown>
          <MenuButton slots={{ root: IconButton }} slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}>
            <MoreVert />
          </MenuButton>
          <Menu>
            {['Admin', 'Customer'].includes(authCtx.currentUser.role) && (
              <MenuItem component={Link} to={`/support-tickets/edit/${row.id}`}>
                Edit
              </MenuItem>
            )}
            {row.status === 'OPEN' && ['Admin'].includes(authCtx.currentUser.role) && (
              <MenuItem component={Link} to={`/support-tickets/assign/${row.id}`}>
                Assign
              </MenuItem>
            )}
            {['Admin'].includes(authCtx.currentUser.role) && (
              <MenuItem component={Link} to={`/support-tickets/update-status/${row.id}`}>
                Update status
              </MenuItem>
            )}
            <MenuItem component={Link} to={`/support-tickets/comments/${row.id}`}>
              Comments
            </MenuItem>
          </Menu>
        </Dropdown>
      </CssVarsProvider>
    );
  };

  // Fetch support tickets
  const fetchSupportTickets = async () => {
    const response = await dispatch(getAllSupportTickets({ token: authCtx.currentUser.token }));
    if (response.payload && response.payload.data) {
      const supportTickets = response.payload.data.map((supportTicket, index) => ({
        id: supportTicket._id,
        status: supportTicket.status,
        title: supportTicket.title,
        category: supportTicket.category
          .toLowerCase()
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        priority: supportTicket.priority
          .toLowerCase()
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        date: handleDate(supportTicket.createdAt),
        serial: ++index
      }));
      setData(supportTickets);
    }
  };

  useEffect(() => {
    fetchSupportTickets();
  }, [dispatch]);

  return (
    <>
      <MainCard {...others}>
        <Grid container md={12} xs={12} mb={2} justifyContent="space-between" alignItems="center">
          <Typography variant="h3">Support Tickets</Typography>

          {!['Admin', 'Courier'].includes(authCtx.currentUser.role) && (
            <Button variant="contained" color="secondary" component={Link} to="/support-tickets/create">
              Create New
            </Button>
          )}
        </Grid>

        <Grid container spacing={2}>
          <Grid item md={12} xs={12} mb={3}>
            <DataTable
              pagination
              responsive
              sortIcon={sortIcon}
              columns={[
                { name: '#', selector: (row) => row.serial },
                { name: 'Title', selector: (row) => row.title },
                { name: 'Status', selector: (row) => row.status, cell: (row) => handleStats(row.status) },
                { name: 'Category', selector: (row) => row.category },
                { name: 'Priority', selector: (row) => row.priority },
                { name: 'Date', selector: (row) => row.date },
                { name: 'Action', selector: (row) => row.action, cell: (row) => handleActions(row) }
              ]}
              data={data}
            />
          </Grid>
        </Grid>
      </MainCard>
    </>
  );
}
