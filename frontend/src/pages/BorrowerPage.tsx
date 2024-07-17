import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Typography, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AddressInput } from "../components/AddressInput";
import { LenderTable } from "../components/LenderTable";
import { QuoteLoanForm } from "../components/QuoteLoanForm";

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
          Quote a Loan
        </Typography>
        <QuoteLoanForm />
      </Box>
      
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          My Loans
        </Typography>
        <LenderTable />
      </Box>
    </Container>
  );
}

export { BorrowerPage };