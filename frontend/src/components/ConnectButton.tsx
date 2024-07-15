import { Button } from "@mui/material";
import { useWeb3 } from "../hooks/useWeb3";

type ConnectButtonProps = {
  connectWallet: () => void;
  disconnectWallet: () => void;
  status: string;
};

const ConnectButton: React.FC<ConnectButtonProps> = ({connectWallet, disconnectWallet}) => {
  const { isConnected } = useWeb3();
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {
        isConnected ? 
            <Button onClick={disconnectWallet} variant={'outlined'}>
              Disconnect
            </Button> :
            <Button onClick={connectWallet} variant={'outlined'}>
              Connect
            </Button>
      }
    </div>
  );
}

export default ConnectButton;