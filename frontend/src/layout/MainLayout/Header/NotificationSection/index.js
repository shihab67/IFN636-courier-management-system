import { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  CardActions,
  Chip,
  ClickAwayListener,
  Divider,
  Grid,
  Paper,
  Popper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip
} from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';

// assets
import { IconBell } from '@tabler/icons-react';

// notification status options
const statusOptions = [
  { value: 'all', label: 'All Notification' },
  { value: 'new', label: 'New' },
  { value: 'unread', label: 'Unread' },
  { value: 'other', label: 'Other' }
];

function humanizeType(type = '') {
  return type
    .toLowerCase() // ticket_created
    .replace(/_/g, ' ') // ticket created
    .replace(/\b\w/g, (c) => c.toUpperCase()); // Ticket Created
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// ==============================|| NOTIFICATION ||============================== //

const NotificationSection = ({ notifications = [] }) => {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  // anchorRef is used on different components and specifying one type leads to other components throwing an error
  const anchorRef = useRef(null);

  const handleToggle = () => setOpen((prevOpen) => !prevOpen);

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) return;
    setOpen(false);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current?.focus();
    }
    prevOpen.current = open;
  }, [open]);

  const unreadCount = useMemo(() => (notifications || []).filter((n) => !n.isRead).length, [notifications]);

  const filtered = useMemo(() => {
    const list = Array.isArray(notifications) ? notifications : [];
    if (filter === 'unread') return list.filter((n) => !n.isRead);
    if (filter === 'new') {
      const since = Date.now() - ONE_DAY_MS;
      return list.filter((n) => new Date(n.createdAt).getTime() >= since);
    }
    if (filter === 'other') {
      return list.filter((n) => !['TICKET_CREATED', 'TICKET_STATUS_CHANGED', 'TICKET_COMMENT'].includes(n.type));
    }
    return list;
  }, [notifications, filter]);

  const sorted = useMemo(() => [...filtered].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)), [filtered]);

  return (
    <>
      {/* bell */}
      <Box
        sx={{
          ml: 2,
          mr: 3,
          [theme.breakpoints.down('md')]: { mr: 2 }
        }}
      >
        <ButtonBase sx={{ borderRadius: '12px', position: 'relative' }}>
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out',
              background: theme.palette.secondary.light,
              color: theme.palette.secondary.dark,
              '&[aria-controls="menu-list-grow"],&:hover': {
                background: theme.palette.secondary.dark,
                color: theme.palette.secondary.light
              }
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            color="inherit"
          >
            <IconBell stroke={1.5} size="1.3rem" />
          </Avatar>
          {/* unread dot */}
          {unreadCount > 0 && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: theme.palette.error.main,
                border: `2px solid ${theme.palette.background.paper}`
              }}
            />
          )}
        </ButtonBase>
      </Box>

      {/* popper */}
      <Popper
        placement={matchesXs ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [{ name: 'offset', options: { offset: [matchesXs ? 5 : 0, 20] } }]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                  <Grid container direction="column" spacing={2}>
                    <Grid item xs={12}>
                      <Grid container alignItems="center" justifyContent="space-between" sx={{ pt: 2, px: 2 }}>
                        <Grid item>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Typography variant="subtitle1">All Notification</Typography>
                            <Chip
                              size="small"
                              label={String(unreadCount).padStart(2, '0')}
                              sx={{ color: theme.palette.background.default, bgcolor: theme.palette.warning.dark }}
                            />
                          </Stack>
                        </Grid>
                        <Grid item>
                          <Typography
                            component="button"
                            type="button"
                            style={{ background: 'transparent', border: 0, cursor: 'pointer' }}
                            variant="subtitle2"
                            color="primary"
                          >
                            Mark all as read
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 205px)', overflowX: 'hidden' }}>
                        <Grid container direction="column" spacing={2}>
                          <Grid item xs={12}>
                            <Box sx={{ px: 2, pt: 0.25 }}>
                              <TextField
                                id="notification-filter"
                                select
                                fullWidth
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                SelectProps={{ native: true }}
                              >
                                {statusOptions.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </TextField>
                            </Box>
                          </Grid>
                          <Grid item xs={12} p={0}>
                            <Divider sx={{ my: 0 }} />
                          </Grid>
                        </Grid>

                        {/* List */}
                        <List dense disablePadding>
                          {sorted.length === 0 ? (
                            <Box sx={{ px: 2, py: 1.5 }}>
                              <Typography variant="body2" color="text.secondary">
                                No notifications to show.
                              </Typography>
                            </Box>
                          ) : (
                            sorted.map((n, idx) => {
                              const title =
                                n.type === 'TICKET_CREATED'
                                  ? n.payload?.title || 'Ticket created'
                                  : n.type === 'TICKET_STATUS_CHANGED'
                                    ? `Status: ${n.payload?.status || ''}`
                                    : n.type === 'TICKET_COMMENT'
                                      ? n.payload?.message || 'New comment'
                                      : humanizeType(n.type);

                              const time = new Date(n.createdAt).toLocaleString();

                              return (
                                <Box key={n._id || idx}>
                                  <ListItem
                                    button
                                    alignItems="flex-start"
                                    sx={{
                                      opacity: n.isRead ? 0.7 : 1,
                                      bgcolor: n.isRead ? 'transparent' : 'action.hover'
                                    }}
                                  >
                                    <ListItemAvatar>
                                      <Avatar sx={{ width: 32, height: 32 }}>{(title?.[0] || 'N').toUpperCase()}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                      primary={
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                          <Typography variant="subtitle2">{title}</Typography>
                                          {!n.isRead && (
                                            <Tooltip title="Unread">
                                              <Box
                                                sx={{
                                                  width: 8,
                                                  height: 8,
                                                  borderRadius: '50%',
                                                  bgcolor: 'primary.main'
                                                }}
                                              />
                                            </Tooltip>
                                          )}
                                        </Stack>
                                      }
                                      secondary={
                                        <Stack spacing={0.5}>
                                          {n.payload?.status && (
                                            <Typography variant="caption" color="text.secondary">
                                              {humanizeType(n.type)} • {n.payload.status}
                                            </Typography>
                                          )}
                                          <Typography variant="caption" color="text.secondary">
                                            {time}
                                          </Typography>
                                          {n.ticketId && (
                                            <Typography
                                              component={Link}
                                              to={`/support-tickets/${n.ticketId}`}
                                              variant="caption"
                                              color="primary"
                                            >
                                              View ticket
                                            </Typography>
                                          )}
                                        </Stack>
                                      }
                                    />
                                  </ListItem>
                                  {idx < sorted.length - 1 && <Divider component="li" />}
                                </Box>
                              );
                            })
                          )}
                        </List>
                      </PerfectScrollbar>
                    </Grid>
                  </Grid>

                  <Divider />
                  <CardActions sx={{ p: 1.25, justifyContent: 'center' }}>
                    <Button size="small" disableElevation component={Link} to="/support-tickets">
                      View All
                    </Button>
                  </CardActions>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  );
};

export default NotificationSection;
