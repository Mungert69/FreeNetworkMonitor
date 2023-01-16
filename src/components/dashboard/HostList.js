import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import BarChartIcon from '@mui/icons-material/BarChart';
import ErrorIcon from '@mui/icons-material/ErrorOutlineTwoTone';

import Title from './Title';


export default function HostList({ data, clickViewChart, resetHostAlert }) {


  return (
    <React.Fragment>
      <Title>Monitored Hosts</Title>
      <Table size="small">
        <TableHead>
          <TableRow >
            <TableCell>View Chart</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Packets Sent</TableCell>
            <TableCell>Packets Lost</TableCell>
            <TableCell>% Packets Lost</TableCell>
            <TableCell align="right">Average Round Trip</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (

            <TableRow key={row.id} >
              <TableCell >
                <Tooltip title="View Chart">
                  <span>
                  <Button onClick={() => clickViewChart(row)} key={row.id}>
                    <BarChartIcon colour='action' />
                  </Button>
                  </span>
                </Tooltip>
                <Tooltip title="Reset Alert">
                  <span>
                  <Button hidden={!row.monitorStatus.alertFlag} onClick={() => resetHostAlert(row.monitorIPID)} key={row.id}>
                    <ErrorIcon color='error' />
                  </Button>
                  </span>
                </Tooltip>



              </TableCell>
              <TableCell>{row.address}</TableCell>
              <TableCell>{row.monitorStatus.message}</TableCell>
              <TableCell>{row.packetsSent}</TableCell>
              <TableCell>{row.packetsLost}</TableCell>
              <TableCell>{row.percentageLost}</TableCell>
              <TableCell align="right">{row.roundTripAverage}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

    </React.Fragment>
  );
}
