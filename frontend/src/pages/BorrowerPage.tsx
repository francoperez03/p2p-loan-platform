import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Typography, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AddressInput } from "../components/AddressInput";
import { LenderTable } from "../components/LenderTable";
import { LoanStatusTable } from '../components/LoanStatusTable';

const BorrowerPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ position: 'relative', paddingTop: '60px' }}>
      <Box 
        sx={{ 
          position: 'absolute', 
          top: 20, 
          left: 20,
        }}  
      >
        <Button
          component={Link}
          to="/"
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          size="small"
        >
          Back to Home
        </Button>
      </Box>
      
      <Typography variant="h2" component="h1" gutterBottom textAlign="center">
        Borrower Dashboard
      </Typography>
      <Box my={3}>
        <AddressInput />
      </Box>
      
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Ask for a loan
        </Typography>
        <LenderTable />
      </Box>
      <Box my={8}>
        <Typography variant="h4" gutterBottom>
          My loans
        </Typography>
        <LoanStatusTable isBorrower={true} />
      </Box>
    </Container>
  );
}

export { BorrowerPage };