import { Grid, Typography, Box } from "@mui/material";
import React from "react";
import ConnectButton from "./ConnectButton";
import { useWeb3 } from "../hooks/useWeb3";
import { useTokenBalance } from '../hooks/useTokenBalance';

const AddressInput: React.FC = () => {
  const { connectWallet, disconnectWallet, status, address, isConnected } = useWeb3();
  const { myBalance } = useTokenBalance();

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12}>
        {!isConnected ? (
          <Typography variant="h5">Please, connect your wallet</Typography>
        ) : (
          <Box>
            <Typography variant="h5">
              Hello {address}
            </Typography>
            <Typography variant="h6">
              Your balance is {myBalance.toString()}
            </Typography>
          </Box>
        )}
        <Box mt={2}>
          <ConnectButton
            connectWallet={connectWallet}
            disconnectWallet={disconnectWallet}
            status={status}
          />
        </Box>
      </Grid>
    </Grid>
  );
}

export { AddressInput };
