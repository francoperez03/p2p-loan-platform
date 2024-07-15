import { Button, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import ConnectButton from "./ConnectButton";
import { useWeb3 } from "../hooks/useWeb3";

const AddressInput: React.FC = () => {
  const { connectWallet, disconnectWallet, status, address, isConnected } = useWeb3();

  return (
      
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12}>
        {!isConnected?
          <h5>Please, connect your wallet</h5>:
          <h5>Hello {address}</h5>
        }
        
        <ConnectButton
          connectWallet={connectWallet}
          disconnectWallet={disconnectWallet}
          status={status}
        />
      </Grid>
    </Grid>
  );
}

export default AddressInput;