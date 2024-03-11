import React, { SyntheticEvent, useEffect } from "react";
import { Alert } from "@mui/material";
import { useState } from "react";
import { Button, Snackbar, TextField } from "@mui/material";
import { Box } from "@mui/system";
import WalletConnector from "../WalletConnector";
import { useWeb3React } from "@web3-react/core";
import { selectSelectedNetwork } from "../../store/network/selectors";
import { useDispatch, useSelector } from "react-redux";
import FaucetAddress from "./FaucetAddress";
import { donateFundsToFaucet, donateTxMined } from "../../store/donateForm/";
import { selectDonationTxHash, selectIsLoading } from "../../store/donateForm/selectors";
import { refreshFaucetBalance } from "../../store/network";
import Grow from "@mui/material/Grow";
import { Network } from "../../constants/testnets";

const DonateForm = () => {
  const [amount, setAmount] = useState(0.5);
  const [unmatchedChainId, setUnmatchedChainId] = useState(false);
  const [showSnackbar, setShowsnackbar] = useState(false);
  const { account, library, chainId: userWalletChainId } = useWeb3React();
  const selectedNetwork = useSelector(selectSelectedNetwork);
  const txHash = useSelector(selectDonationTxHash);
  const isLoading = useSelector(selectIsLoading);
  const dispatch = useDispatch();

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();

    const signer = library.getSigner();
    dispatch(donateFundsToFaucet({ signer, amount }));
  };

  useEffect(() => {
    if (selectedNetwork && selectedNetwork.id !== userWalletChainId) {
      setUnmatchedChainId(true);
    } else {
      setUnmatchedChainId(false);
    }
  }, [selectedNetwork, userWalletChainId]);

  useEffect(() => {
    if (library && txHash && selectedNetwork) {
      library.once(txHash, () => {
        dispatch(donateTxMined());
        dispatch(refreshFaucetBalance(selectedNetwork));
        setShowsnackbar(true);
      });
    }
  }, [txHash, library, dispatch, selectedNetwork]);

  return (
    <>
      <FaucetAddress />

      {!account && (
        <Box sx={{ marginTop: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <WalletConnector connectText="Use Wallet" />
        </Box>
      )}

      <Grow in={!!account} unmountOnExit>
        <div>
          {account && (
            <form onSubmit={handleSubmit}>
              <TextField
                sx={{ marginTop: 2 }}
                value={amount}
                onChange={(e) => setAmount(+e.target.value)}
                fullWidth
                label="Amount"
                variant="outlined"
                type="number"
                inputProps={{ step: 0.01 }}
              />
              <Box sx={{ marginTop: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {account && unmatchedChainId ? (
                  <Alert sx={{ bgcolor: "transparent" }} severity="info">
                    Please change your wallet network to: {selectedNetwork?.label}
                  </Alert>
                ) : (
                  <Button disabled={unmatchedChainId} variant="contained" type="submit">
                    Donate
                  </Button>
                )}
              </Box>
            </form>
          )}
        </div>
      </Grow>

      <Snackbar
        open={showSnackbar || isLoading}
        autoHideDuration={6000}
        onClose={() => setShowsnackbar(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}>
        {isLoading ? (
          <Alert severity="info">Waiting for transaction to be confirmed...</Alert>
        ) : (
          <Alert severity="success">Thank you for topping up the faucet balance! ❤️</Alert>
        )}
      </Snackbar>
    </>
  );
};

export default DonateForm;
