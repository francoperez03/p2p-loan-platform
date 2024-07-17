import React from 'react';
import {  Box, Button, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useDeposits } from '../hooks/useDeposits';

const LenderTable: React.FC = () => {
  const { deposits, loading, isConnected, withdraw } = useDeposits();

  return (
    <Box sx={{ m: 4 }}>
      {loading || !isConnected? (
        <Skeleton variant="rectangular" width={800} height={500} />
      ) : (
        <TableContainer>
          <Table
            sx={{
              'th': { backgroundColor: '#3f51b5', color: 'white', px: { xs: 1, sm: 2, md: 4 }, py: { xs: 1, sm: 2, md: 2 } },
              backgroundColor: 'background.paper',
              td: { px: { xs: 1, sm: 2, md: 4 }, py: { xs: 1, sm: 2, md: 3 } },
              'tr:last-child td': { border: 0 },
              'tr:hover': { backgroundColor: '#f5f5f5' },
              'tr.selected': { backgroundColor: '#e0e0e0' },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell align="center">Address</TableCell>
                <TableCell align="center">Tokens available</TableCell>
                <TableCell align="center">Ask</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deposits.map((row) => (
                <TableRow
                  key={row.deposit.id}
                  sx={{ 
                    '&:hover': { backgroundColor: '#f5f5f5' }, 
                    cursor: 'pointer',
                    backgroundColor: 'inherit',
                  }}
                >
                  <TableCell align="center">{row.deposit.id.toString()}</TableCell>
                  <TableCell align="center">{new Date(Number(row.deposit.createdAt) * 1000).toLocaleString()}</TableCell>
                  <TableCell align="center"><Button onClick={()=>{withdraw(row.deposit.id)}}>Ask</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export { LenderTable };
