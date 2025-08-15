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
import { getAllDeliveries } from 'store/modules/adminLogin/adminLoginSlice';
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
    console.log(status);

    switch (status) {
      case 'Pending':
        color = 'warning';
        break;
      case 'In Transit':
        color = 'secondary';
        break;
      case 'Out For Delivery':
      case 'Delivered':
        color = 'success';
        break;
      case 'Cancelled':
        color = 'error';
        break;
      default:
        break;
    }

    return <Chip size="small" color={color} label={status} />;
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
    return (
      <CssVarsProvider>
        <Dropdown>
          <MenuButton slots={{ root: IconButton }} slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}>
            <MoreVert />
          </MenuButton>
          <Menu>
            {['Admin', 'Courier'].includes(authCtx.currentUser.role) && (
              <MenuItem component={Link} to={`/deliveries/edit/${row.id}`}>
                Edit
              </MenuItem>
            )}
            <MenuItem component={Link} to={`/deliveries/track/${row.id}`}>
              Track
            </MenuItem>
          </Menu>
        </Dropdown>
      </CssVarsProvider>
    );
  };

  // Fetch deliveries
  const fetchDeliveries = async () => {
    const response = await dispatch(getAllDeliveries({ token: authCtx.currentUser.token }));
    if (response.payload && response.payload.data) {
      const deliveries = response.payload.data.map((delivery, index) => ({
        id: delivery._id,
        status: delivery.status,
        customerName: delivery.customerId.name,
        courierName: delivery.courierId !== null ? delivery.courierId.name : '---',
        date: delivery.created_at,
        weight: delivery.weight,
        price: delivery.price,
        serial: ++index
      }));
      setData(deliveries);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, [dispatch]);

  return (
    <>
      <MainCard {...others}>
        <Grid container md={12} xs={12} mb={2} justifyContent="space-between" alignItems="center">
          <Typography variant="h3">Deliveries</Typography>

          {!['Admin', 'Courier'].includes(authCtx.currentUser.role) && (
            <Button variant="contained" color="secondary" component={Link} to="/deliveries/create">
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
                { name: 'Customer Name', selector: (row) => row.customerName },
                { name: 'Courier Name', selector: (row) => row.courierName },
                { name: 'Status', selector: (row) => row.status, cell: (row) => handleStats(row.status) },
                { name: 'Weight', selector: (row) => row.weight },
                { name: 'Price', selector: (row) => row.price },
                { name: 'Placed At', selector: (row) => handleDate(row.date) },
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
