import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Skeleton, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TextField
} from '@mui/material';
import { useWeb3 } from '../hooks/useWeb3'; // Asegúrate de importar este hook
import { useAllDepositors } from '../hooks/useInfoToBorrow';

const LenderTable: React.FC = () => {
  const { allDepositors, depositorsLoading } = useAllDepositors();

  const { isConnected } = useWeb3();
  const [loanAmounts, setLoanAmounts] = useState<{ [address: string]: string }>({});

  const handleLoanAmountChange = (address: string, amount: string) => {
    setLoanAmounts(prev => ({ ...prev, [address]: amount }));
  };

  return (
    <Box sx={{ m: 4 }}>
      {depositorsLoading ? (
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
                <TableCell align="center">Lender Address</TableCell>
                <TableCell align="center">Total Tokens Deposited</TableCell>
                <TableCell align="center">Annual interest rate %</TableCell>
                <TableCell align="center">Loan Amount</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allDepositors.map(({ address, amount }) => (
                <TableRow
                  key={address}
                  sx={{ 
                    '&:hover': { backgroundColor: '#f5f5f5' }, 
                    cursor: 'pointer',
                    backgroundColor: 'inherit',
                  }}
                >
                  <TableCell align="center">{address}</TableCell>
                  <TableCell align="center">{amount.toString()}</TableCell>
                  <TableCell align="center">{amount.toString()}</TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      value={loanAmounts[address] || ''}
                      onChange={(e) => handleLoanAmountChange(address, e.target.value)}
                      disabled={!isConnected}
                      size="small"
                      sx={{ width: '120px' }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button 
                      onClick={() => {}}
                      disabled={!isConnected || !loanAmounts[address]}
                    >
                      Request Loan
                    </Button>
                  </TableCell>
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