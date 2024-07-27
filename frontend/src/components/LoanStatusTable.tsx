import React, { useEffect, useState } from 'react';
import { Box, Button, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { useLoans } from '../hooks/useLoans';
import { Loan, LoanState, LoanStateEnum } from '../types/loan';

const LoanStatusTable: React.FC<{isBorrower: boolean}> = ({isBorrower}: {isBorrower: boolean}) => {
  const { loansRequested, loading, loansIssued, isConnected, repayLoan, approveLoan } = useLoans();
  const [loans, setLoans] = useState<Loan[]>();
  useEffect(()=>{
    if(isBorrower){
      setLoans(loansRequested)
    } else{
      setLoans(loansIssued)
    }
  }, [isBorrower, loansRequested, loansIssued])

  useEffect(()=>{
    if(isBorrower){
      setLoans(loansRequested)
    } else{
      setLoans(loansIssued)
    }
  }, [loans, isBorrower, loansIssued, loansRequested])

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
                  <TableCell align="center">Annual interest rate</TableCell>
                  {isBorrower && <TableCell align="center">Amount to repay</TableCell>}
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loans?.map((loan: Loan) => (
                  <TableRow
                    key={loan.id}
                    sx={{
                      '&:hover': { backgroundColor: '#f5f5f5' },
                      cursor: 'pointer',
                      backgroundColor: 'inherit',
                    }}
                  >
                    <TableCell align="center">{LoanStateEnum[loan.state]}</TableCell>
                    <TableCell align="center">{loan.lender}</TableCell>
                    <TableCell align="center">{loan.principal.toString()}</TableCell>
                    <TableCell align="center">{loan.interestRate.toString()}</TableCell>
                    {isBorrower && <TableCell align="center">
                      <TextField
                        type="number"
                        value={''}
                        onChange={()=>{}}
                        disabled={!isConnected}
                        size="small"
                        sx={{ width: '120px' }}
                      />
                    </TableCell>}
                    {isBorrower &&
                      <TableCell align="center">
                        <Button disabled={loan.state !== LoanState.ACTIVE} onClick={() => { repayLoan(loan.id, 100n) }}>Repay</Button>
                      </TableCell>
                    }
                    {!isBorrower && 
                      <TableCell align="center">
                        <Button disabled={loan.state !== LoanState.PENDING} onClick={() => { approveLoan(loan.id) }}>Approve</Button>
                      </TableCell>
                    }
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
