import React from 'react';
import { Alert, Box, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useDeposits } from '../hooks/useDeposits';

const DepositTable: React.FC = () => {
  const { deposits, loading, error } = useDeposits();

  return (
    <Box sx={{ m: 4 }}>
      {loading ? (
        <Skeleton variant="rectangular" width={800} height={500} />
      ) : error ? (
        <Alert severity="error">{}</Alert>
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
                <TableCell align="center">Number</TableCell>
                <TableCell align="center">Created at</TableCell>
                <TableCell align="center">Amount</TableCell>
                <TableCell align="center">Earned</TableCell>
                <TableCell align="center">InterestRate</TableCell>
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
                  <TableCell align="center">{row.deposit.id}</TableCell>
                  <TableCell align="center">{new Date(Number(row.deposit.createdAt) * 1000).toLocaleString()}</TableCell>
                  <TableCell align="center">{row.deposit.amount.toString()}</TableCell>
                  <TableCell align="center">{row.interestEarned.toString()}</TableCell>
                  <TableCell align="center">{row.deposit.interestRate.toString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export { DepositTable };
