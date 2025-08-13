import { Button, Grid } from '@mui/material';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Link } from 'react-router-dom';
import { getAllLeaves } from 'store/modules/adminLogin/adminLoginSlice';
import AuthContext from 'store/modules/authContext';
import { useAppDispatch } from 'store/reducer';

const localizer = momentLocalizer(moment);

export default function LeaveRequest() {
  const dispatch = useAppDispatch();
  const authCtx = useContext(AuthContext);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await dispatch(
        getAllLeaves({
          token: authCtx.currentUser.token
        })
      );
      if (response.payload && response.payload.data && response.payload.data.length > 0) {
        const events = response.payload.data.map((leave) => {
          const title = leave.leave_type.name.substring(0, 15) + (leave.leave_type.name.length > 15 ? '...' : '');
          return {
            id: leave.id,
            title: title,
            start: new Date(leave.start_date),
            end: new Date(leave.end_date),
            desc: leave.reason
          };
        });
        setEvents(events);
      }
    };

    fetchData();
  }, [dispatch, authCtx.currentUser.token, setEvents]);
  return (
    <>
      <Grid container direction="column">
        <Grid justifyContent={'flex-end'} item xs={12} mb={2}>
          <Button variant="contained" color="secondary" sx={{ float: 'right' }} component={Link} to="/leave-request/create">
            Create New Leave Request
          </Button>
        </Grid>
      </Grid>
      <Calendar localizer={localizer} events={events} startAccessor="start" endAccessor="end" style={{ height: '80vh' }} />
    </>
  );
}
