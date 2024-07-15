import './App.css'
import LenderPage from './pages/lender'
import { WagmiProvider } from 'wagmi'
import { wagmiConfig } from './utils/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


function App() {
  const queryClient = new QueryClient()
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
          <LenderPage />
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
