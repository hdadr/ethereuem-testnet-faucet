import { switchMap, map, filter, catchError, of } from "rxjs";
import { from } from "rxjs";
import { donateFundsToFaucet, providerError, txSubmittedToNetwork } from "./";
import { FAUCET_PUBLIC_ADDRESS } from "../../constants/faucet";
import { parseUnits } from "@ethersproject/units";

export const donateToFaucetEpic = (actions$) =>
  actions$.pipe(
    filter(donateFundsToFaucet.match),
    switchMap((action) => {
      return from(
        action.payload.signer.sendTransaction({
          to: FAUCET_PUBLIC_ADDRESS,
          value: parseUnits(action.payload.amount.toString(), "ether"),
        })
      ).pipe(
        map((tx) => txSubmittedToNetwork(tx.hash)),
        catchError((error) => of(providerError(error.message)))
      );
    })
  );
