import { switchMap, map, mergeMap, filter, from, catchError, tap, bindCallback, of } from "rxjs";
import { requestfundsFromFaucet, notifyWhenTxMined, sendSignedTxToMempool, txMined, setTxError, txError } from "./";
import { ethers } from "ethers";
import { INFURA_PROJECT_ID } from "../../constants/infura";
import { refreshFaucetBalance } from "../network";
import { showSnackbar } from "../snackbar";
import { Alert, Link } from "@mui/material";
import { Box } from "@mui/system";

const TxSignedAlert = <Alert severity="info">Transaction was signed.</Alert>;
const TxSentAlert = (networkName, txHash) => {
  return (
    <Alert severity="info">
      <Box sx={{ display: "flex" }}>
        <span>Transaction was sent to the mempool: </span>
        <Link color="secondary" target="_blank" sx={{ paddingLeft: 1 }} href={`https://${networkName}.etherscan.io/tx/${txHash}`}>
          Etherscan
        </Link>
      </Box>
    </Alert>
  );
};
const TxMinedAlert = <Alert severity="success">Transaction mined!</Alert>;
const ErrorAlert = (error) => <Alert severity="error">Error during transaction execution. &apos;{error}&apos;</Alert>;

const requestFundsEpic = (actions$, state$) =>
  actions$.pipe(
    filter(requestfundsFromFaucet.match),
    switchMap((action) => {
      const network = state$.value.network.selectedNetwork;
      return from(
        fetch("/api/receive", {
          method: "POST",
          body: JSON.stringify({ ...action.payload, networkName: network.name }),
          headers: { "Content-Type": "application/json" },
        }).then((response) => response.json())
      ).pipe(
        mergeMap((response) => [
          sendSignedTxToMempool({ signedTx: response.signedTx, network }),
          showSnackbar({ target: "receiveForm", content: TxSignedAlert }),
        ]),
        catchError((error) => {
          console.log(error);
          return of(txError());
        })
      );
    })
  );

const sendSignedTransactionEpic = (actions$) =>
  actions$.pipe(
    filter(sendSignedTxToMempool.match),
    switchMap((action) => {
      const { network, signedTx } = action.payload;
      const provider = new ethers.providers.InfuraProvider(network.name, INFURA_PROJECT_ID);
      return from(provider.sendTransaction(signedTx)).pipe(
        mergeMap((tx) => [
          notifyWhenTxMined({ txHash: tx.hash, network }),
          showSnackbar({ target: "receiveForm", content: TxSentAlert(network.name, tx.hash) }),
        ]),
        catchError((error) => {
          console.error(error);
          return of(txError(), showSnackbar({ target: "receiveForm", content: ErrorAlert(error.code) }));
        })
      );
    })
  );

const txMinedNotificationEpic = (actions$) =>
  actions$.pipe(
    filter(notifyWhenTxMined.match),
    switchMap((action) => {
      const provider = new ethers.providers.InfuraProvider(action.payload.network.name, INFURA_PROJECT_ID);
      const boundNotify = bindCallback(provider.once).bind(provider);
      return boundNotify(action.payload.txHash).pipe(
        mergeMap(() => [
          refreshFaucetBalance(action.payload.network),
          showSnackbar({ target: "receiveForm", content: TxMinedAlert }),
          txMined(),
        ])
      );
    })
  );

export const receiveFormEpics = [requestFundsEpic, sendSignedTransactionEpic, txMinedNotificationEpic];
