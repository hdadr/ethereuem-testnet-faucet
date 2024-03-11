import ContentCopy from "@mui/icons-material/ContentCopy";
import { Alert, Divider, IconButton, InputBase, Paper, Snackbar } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { FAUCET_PUBLIC_ADDRESS } from "../../constants/faucet";

const FaucetAddress = () => {
  const [showAlert, setShowAlert] = useState(false);

  const copyAddress = async () => {
    setShowAlert(true);
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(FAUCET_PUBLIC_ADDRESS);
    }
  };

  const handleClose = (_event?: SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setShowAlert(false);
  };

  return (
    <>
      <Paper component="form" sx={{ p: "6px 8px", display: "flex", alignItems: "center" }}>
        <InputBase sx={{ ml: 1, flex: 1 }} value={FAUCET_PUBLIC_ADDRESS} disabled />
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton color="primary" sx={{ p: "10px" }} onClick={copyAddress}>
          <ContentCopy />
        </IconButton>
      </Paper>

      <Snackbar
        open={showAlert}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        onClose={handleClose}
        autoHideDuration={1000}>
        <Alert severity="success">Copied to clipboard!</Alert>
      </Snackbar>
    </>
  );
};

export default FaucetAddress;
