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
import { Link, useParams } from 'react-router-dom';
import { getAllLeaves } from 'store/modules/adminLogin/adminLoginSlice';
import AuthContext from 'store/modules/authContext';
import { useAppDispatch } from 'store/reducer';
import MainCard from 'ui-component/cards/MainCard';
import LeaveTabs from './partials/tab';

export default function LeaveList({ ...others }) {
  const params = useParams();
  const sortIcon = <ArrowDownward />;
  const columns = [
    {
      name: '#',
      selector: (row) => row.serial
    },
    {
      name: 'Employee',
      selector: (row) => row.employee
    },
    {
      name: 'Leave Type',
      selector: (row) => row.leaveType
    },
    {
      name: 'Start Date',
      selector: (row) => row.startDate
    },
    {
      name: 'End Date',
      selector: (row) => row.endDate
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      cell: (row) => handleStats(row.status)
    },
    {
      name: 'Approved By',
      selector: (row) => row.approvedBy
    },
    {
      name: 'Action',
      selector: (row) => row.action,
      cell: (row) => handleActions(row.id, row.user_id)
    }
  ];
  const dispatch = useAppDispatch();
  const authCtx = useContext(AuthContext);
  const [data, setData] = useState([]);

  const handleStats = (status) => {
    switch (status) {
      case 'pending':
        return (
          <JoyCssVarsProvider>
            <CssBaseline enableColorScheme />
            <Chip color="warning" variant="soft">
              Pending
            </Chip>
          </JoyCssVarsProvider>
        );
      case 'approved':
        return (
          <JoyCssVarsProvider>
            <CssBaseline enableColorScheme />
            <Chip color="success" variant="soft">
              Approved
            </Chip>
          </JoyCssVarsProvider>
        );
      case 'rejected':
        return (
          <JoyCssVarsProvider>
            <CssBaseline enableColorScheme />
            <Chip color="danger" variant="soft">
              Rejected
            </Chip>
          </JoyCssVarsProvider>
        );
      default:
        return (
          <JoyCssVarsProvider>
            <CssBaseline enableColorScheme />
            <Chip color="warning" variant="soft">
              Pending
            </Chip>
          </JoyCssVarsProvider>
        );
    }
  };

  const handleActions = (id, user_id) => {
    return (
      <JoyCssVarsProvider>
        <CssBaseline enableColorScheme />
        <Dropdown>
          <MenuButton slots={{ root: IconButton }} slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}>
            <MoreVert />
          </MenuButton>
          <Menu>
            <MenuItem component={Link} to={`/leave-request/view/${id}`}>
              View
            </MenuItem>
            {authCtx.currentUser.role.id === 1 ||
              (authCtx.currentUser.role.id === 2 && user_id !== authCtx.currentUser.id && (
                <MenuItem component={Link} to={`/leave-request/edit/${id}`}>
                  Edit
                </MenuItem>
              ))}
          </Menu>
        </Dropdown>
      </JoyCssVarsProvider>
    );
  };
  useEffect(() => {
    const fetchData = async () => {
      const response = await dispatch(
        getAllLeaves({
          type: params.type || 'pending',
          token: authCtx.currentUser.token
        })
      );
      if (response.payload && response.payload.data) {
        const events = response.payload.data.map((leave, index) => {
          return {
            id: leave.id,
            user_id: leave.user_id,
            serial: ++index,
            employee: leave.user.name,
            leaveType: leave.leave_type.name,
            startDate: leave.start_date,
            endDate: leave.end_date,
            status: leave.status,
            approvedBy: leave.approved_by?.name || '---'
          };
        });
        setData(events);
      }
    };

    fetchData();
  }, [dispatch, authCtx.currentUser.token, setData, params.type]);
  return (
    <>
      <MainCard title="Leave List" {...others}>
        <Grid container>
          <Grid md={12} xs={12} mb={3}>
            <LeaveTabs sortIcon={sortIcon} data={data} columns={columns} type={params.type} />
          </Grid>
        </Grid>
      </MainCard>
    </>
  );
}
