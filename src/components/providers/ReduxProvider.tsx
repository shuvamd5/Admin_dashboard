'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/redux/store';

interface ReduxProviderProps {
  children: React.ReactNode;
}

function ReduxProvider({ children }: ReduxProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}

export default ReduxProvider;