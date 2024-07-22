import React from 'react';
import { Box, Button, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { useDeposits } from '../hooks/useDeposits';

const LoanStatusTable: React.FC<{isBorrower: boolean}> = ({isBorrower}: {isBorrower: boolean}) => {
  const { deposits, loading, isConnected } = useDeposits();

  return (
    <Box sx={{ m: 4 }}>
      {loading || !isConnected ? (
        <Skeleton variant="rectangular" width={800} height={500} />
      ) : (
        <>
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
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">{isBorrower ? 'From': 'To'}</TableCell>
                  <TableCell align="center">Current debt</TableCell>
                  <TableCell align="center">Annual interest rate %</TableCell>
                  {isBorrower && <TableCell align="center">Amount to repay</TableCell>}
                  <TableCell align="center">Action</TableCell>
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
                    <TableCell align="center">{'APPROVED'}</TableCell>
                    <TableCell align="center">{'0x3e24adA7AcD59223147b2bbc7BE2fB4cA03303F9'}</TableCell>
                    <TableCell align="center">{row.deposit.interestRate.toString()}</TableCell>
                    <TableCell align="center">{row.deposit.interestRate.toString()}</TableCell>
                    <TableCell align="center">
                      {isBorrower && <TextField
                        type="number"
                        value={''}
                        onChange={()=>{}}
                        disabled={!isConnected}
                        size="small"
                        sx={{ width: '120px' }}
                      />}
                    </TableCell>
                    <TableCell align="center"><Button onClick={() => {  }}>{isBorrower ? 'Repay': 'Approve'}</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export { LoanStatusTable };
