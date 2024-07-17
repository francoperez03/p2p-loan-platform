import './App.css'
import { WagmiProvider } from 'wagmi'
import { wagmiConfig } from './utils/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LandingPage } from './pages/LandingPage';
import { LenderPage } from './pages/LenderPage';
import { BorrowerPage }from './pages/BorrowerPage';
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import theme from './theme'


function App() {  
  const queryClient = new QueryClient()
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>  
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/lender" element={<LenderPage />} />
            <Route path="/borrower" element={<BorrowerPage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App



