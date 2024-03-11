import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/system";
import Skeleton from "@mui/material/Skeleton";
import { TESTNETS } from "../../constants/testnets";
import TestnetSelector from "./TestnetSelector";
import { selectFaucetBalance, selectIsLoading, selectSelectedNetwork } from "../../store/network/selectors";
import { changeNetwork } from "../../store/network";

const formatFaucetBalance = (balance: number) => {
  if (!balance) return 0;
  return balance >= 1000 ? (+balance.toFixed(0) / 1000).toString() + "k" : balance.toFixed(4);
};

const TestnetAddressInfo = () => {
  const dispatch = useDispatch();
  const network = useSelector(selectSelectedNetwork);
  const faucetBalance = useSelector(selectFaucetBalance);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    dispatch(changeNetwork(TESTNETS[0]));
  }, [dispatch]);

  return (
    <Box
      sx={{
        bgcolor: "opaqueBg",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        width: 520,
        borderRadius: 5,
        marginBottom: 2,
      }}>
      <TestnetSelector testnets={TESTNETS} initial={0} onTestnetSelection={(value) => dispatch(changeNetwork(value))} />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 520,
          borderRadius: 5,
          marginBottom: 2,
        }}>
        <Box component="span" sx={{ color: "text.secondary", marginRight: 1 }}>
          Network id:
        </Box>
        <Box component="span" sx={{ marginRight: 2 }}>
          {network?.id}
        </Box>

        <Box component="span" sx={{ color: "text.secondary", marginRight: 1 }}>
          Faucet Balance:
        </Box>
        <Box component="span">
          {!isLoading && !isNaN(faucetBalance) ? formatFaucetBalance(faucetBalance) + " ETH" : <Skeleton variant="text" width={80} />}
        </Box>
      </Box>
    </Box>
  );
};

export default TestnetAddressInfo;
