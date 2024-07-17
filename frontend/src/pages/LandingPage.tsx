// src/components/LandingPage.tsx
import React from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Grid, 
  Paper, 
  ThemeProvider, 
  createTheme,
  useMediaQuery
} from '@mui/material';
import { Link } from 'react-router-dom';
import MoneyIcon from '@mui/icons-material/MonetizationOn';
import HandshakeIcon from '@mui/icons-material/Handshake';
import SecurityIcon from '@mui/icons-material/Security';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#388e3c',
    },
  },
});

const LandingPage: React.FC = () => {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <Box textAlign="center" my={5}>
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Welcome to LendConnect
          </Typography>
          <Typography variant="h5" paragraph  >
            Your Gateway to Secure and Efficient Lending
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center" my={6}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <MoneyIcon sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Competitive Rates
              </Typography>
              <Typography align="center">
                Access competitive interest rates for both lenders and borrowers.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <HandshakeIcon sx={{ fontSize: 60, color: theme.palette.secondary.main, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Easy Matching
              </Typography>
              <Typography align="center">
                Our platform easily connects lenders with suitable borrowers.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <SecurityIcon sx={{ fontSize: 60, color: theme.palette.error.main, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Secure Transactions
              </Typography>
              <Typography align="center">
                State-of-the-art security measures to protect your investments and data.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Box textAlign="center" my={6}>
          <Typography variant="h4" gutterBottom>
            Ready to Get Started?
          </Typography>
          <Typography variant="body1" paragraph>
            Choose your role and join our community of lenders and borrowers today!
          </Typography>
          <Box my={4}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/lender"
              size="large"
              sx={{ mr: isSmallScreen ? 0 : 2, mb: isSmallScreen ? 2 : 0, width: isSmallScreen ? '100%' : 200 }}
            >
              I'm a Lender
            </Button>
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to="/borrower"
              size="large"
              sx={{ width: isSmallScreen ? '100%' : 200 }}
            >
              I'm a Borrower
            </Button>
          </Box>
        </Box>

        <Box component="footer" sx={{ mt: 8, py: 3, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} LendConnect. All rights reserved.
          </Typography>
          <Typography variant="body2" align="center" sx={{ mt: 1 }}>
            <Link to="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</Link>
            {' | '}
            <Link to="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</Link>
            {' | '}
            <Link to="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contact Us</Link>
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export { LandingPage };