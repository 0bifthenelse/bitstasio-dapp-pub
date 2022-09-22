import { configureStore } from '@reduxjs/toolkit';
import reducer_web3 from 'slice/web3';
import reducer_currency from 'slice/factory';
import reducer_loading from 'slice/loading';
import reducer_transfer from 'slice/transfer';
import reducer_dispatcher from 'slice/transfer';
import reducer_subscription from 'slice/subscription';
import reducer_jackpot from 'slice/jackpot';

export default configureStore({
  reducer: {
    subscription: reducer_subscription,
    loading: reducer_loading,
    dispatcher: reducer_dispatcher,
    currency: reducer_currency,
    web3: reducer_web3,
    transfer: reducer_transfer,
    jackpot: reducer_jackpot
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
});