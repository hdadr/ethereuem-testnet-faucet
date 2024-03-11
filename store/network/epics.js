import { ethers } from 'ethers';
import { EMPTY, from } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

import { FAUCET_PUBLIC_ADDRESS } from '../../constants/faucet';
import { INFURA_PROJECT_ID } from '../../constants/infura';
import { changeNetwork, changeNetworkFullfilled, refreshFaucetBalance } from './';

export const getFaucetBalanceEpic = (actions$) =>
  actions$.pipe(
    filter((action) => changeNetwork.match(action) || refreshFaucetBalance.match(action)),
    switchMap((action) => {
      const provider = new ethers.providers.InfuraProvider(action.payload.name, INFURA_PROJECT_ID);
      return from(provider.getBalance(FAUCET_PUBLIC_ADDRESS)).pipe(
        map((balanceBigNumber) => {
          return changeNetworkFullfilled(parseFloat(ethers.utils.formatEther(balanceBigNumber)));
        }),
        catchError((error) => {
          return EMPTY;
        })
      );
    })
  );
