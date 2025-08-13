import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import Tab from '@mui/joy/Tab';
import TabList from '@mui/joy/TabList';
import TabPanel from '@mui/joy/TabPanel';
import Tabs from '@mui/joy/Tabs';
import CssBaseline from '@mui/material/CssBaseline';
import * as React from 'react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';

export default function LeaveTabs(props) {
  const handleDefaultValue = () => {
    const type = props.type;
    if (type === 'pending') {
      return 0;
    } else if (type === 'approved') {
      return 1;
    } else if (type === 'rejected') {
      return 2;
    } else if (type === 'all') {
      return 3;
    } else {
      return 0;
    }
  };
  return (
    <JoyCssVarsProvider>
      <CssBaseline enableColorScheme />
      <Tabs aria-label="Basic tabs" defaultValue={handleDefaultValue()}>
        <TabList>
          <Tab component={Link} to="/leave-request/leave-list/pending">
            Pending
          </Tab>
          <Tab component={Link} to="/leave-request/leave-list/approved">
            Approved
          </Tab>
          <Tab component={Link} to="/leave-request/leave-list/rejected">
            Rejected
          </Tab>
          <Tab component={Link} to="/leave-request/leave-list/all">
            All
          </Tab>
        </TabList>
        <TabPanel value={handleDefaultValue()}>
          <DataTable pagination responsive sortIcon={props.sortIcon} columns={props.columns} data={props.data} />
        </TabPanel>
      </Tabs>
    </JoyCssVarsProvider>
  );
}
