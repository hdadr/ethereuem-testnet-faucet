import { Alert, Backdrop, Box, Button, CircularProgress, FormHelperText, TextField } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { MAXIMUM_AMOUNT_ALLOWED_PER_TX } from '../../constants/faucet';
import useENS from '../../hooks/useENS';
import { requestfundsFromFaucet } from '../../store/receiveForm';
import { selectIsLoading } from '../../store/receiveForm/selectors';
import { hideSnackbar, selectSnackbarState, showSnackbar } from '../../store/snackbar';
import { validate } from '../../utils/ethereumAddress';
import StatusSnackbar from './StatusSnackbar';

const ReceiveForm = () => {
  const { account } = useWeb3React();
  const { ensName, resolveNameToAddress } = useENS(account ?? "");
  const [amount, setAmount] = useState(0.001);
  const [address, setAddress] = useState("");
  const [invalidEthAddress, setInvalidEthAddress] = useState(false);
  const snackbar = useSelector(selectSnackbarState);
  const isLoading = useSelector(selectIsLoading);
  const dispatch = useDispatch();

  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value: newValue } = event.target;

    const invalidAmountValue = !newValue || +newValue <= 0;
    if (invalidAmountValue) return;

    const overMaximumAllowed = +newValue > MAXIMUM_AMOUNT_ALLOWED_PER_TX;
    overMaximumAllowed ? setAmount(MAXIMUM_AMOUNT_ALLOWED_PER_TX) : setAmount(+newValue);
  };

  const handleSnackbarClose = () => {
    dispatch(hideSnackbar());
  };

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setInvalidEthAddress(false);

    const result = validate(address);
    if (!result.isOk) {
      setInvalidEthAddress(true);
      return;
    }

    let ensResolvedAddress;
    if (result.addressType === "ENS") {
      ensResolvedAddress = await resolveNameToAddress(address);
    }

    dispatch(requestfundsFromFaucet({ amount, address: ensResolvedAddress ?? address }));

    const SigningTxAlert = <Alert severity="info">Signing transaction...</Alert>;
    dispatch(showSnackbar({ show: true, target: "receiveForm", content: SigningTxAlert }));
  };

  useEffect(() => {
    if (ensName) {
      setAddress(ensName);
    } else if (account) {
      setAddress(account);
    } else {
      setAddress("");
    }
  }, [account, ensName]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Box sx={{ paddingBottom: 2 }}>
          <TextField
            name="amount"
            value={amount}
            onChange={handleAmountChange}
            fullWidth
            label="Amount"
            variant="outlined"
            type="number"
            inputProps={{ step: 0.01 }}
          />
          <FormHelperText>Maximum allowed: {MAXIMUM_AMOUNT_ALLOWED_PER_TX}</FormHelperText>
        </Box>

        <Box sx={{ paddingBottom: 2 }}>
          <TextField
            name="address"
            error={invalidEthAddress}
            fullWidth
            label="Your Address (or ENS)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            variant="outlined"
          />
          {invalidEthAddress && <FormHelperText error>Not a valid ethereum address</FormHelperText>}
        </Box>

        <Box sx={{ marginTop: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Button type="submit" variant="contained">
            Receive
          </Button>
        </Box>
        <Backdrop sx={{ position: "absolute", display: "flex", flexDirection: "column", borderRadius: 5 }} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </form>

      {snackbar.target === "receiveForm" && (
        <StatusSnackbar show={snackbar.show} onClose={handleSnackbarClose}>
          <div>{snackbar.content}</div>
        </StatusSnackbar>
      )}
    </>
  );
};

export default ReceiveForm;
