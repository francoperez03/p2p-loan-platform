import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useDeposits } from '../hooks/useDeposits';

const DepositForm: React.FC = () => {
  const { 
    address,
    interestRate,
    isConnected,
    deposit,
    depositLoading,
    depositIsConfirming,
    depositConfirmed
  } = useDeposits();

  const [amount, setAmount] = useState<bigint>(0n);
  // const [depositArgs, setDepositArgs] = useState<[bigint] | null>(null);
  const handleDeposit = () => {
    if (amount && address) {
      deposit(amount);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <>{depositLoading}</>
      <>{depositIsConfirming}</>
      <>{depositConfirmed}</>
      <Typography variant="h6" gutterBottom>
        Make a Deposit
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Yearly Interest Rate: {interestRate.toString()}%
      </Typography>
      <TextField
        label="Amount"
        variant="outlined"
        value={amount}
        onChange={(e) => setAmount(e.target.value as unknown as bigint)}
        sx={{ 
          mr: 2, 
          input: { 
            color: 'white'
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'white',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'white',
            },
          },
          '& .MuiInputBase-input::placeholder': {
            color: 'white',
          },
        }}
        InputProps={{
          style: { color: 'white' },
        }}
        InputLabelProps={{
          style: { color: 'white' },
        }}
      />
      <Button disabled={!isConnected} variant="outlined" onClick={handleDeposit}>
        Deposit
      </Button>
      <Typography variant="body1" sx={{ mt: 2 }}>
      </Typography>
    </Box>
  );
};

export { DepositForm };
