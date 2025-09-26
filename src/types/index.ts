export interface Recipient {
  id: string;
  address: string;
  amount: string;
}

export interface WalletState {
  isConnected: boolean;
  address?: string;
  chainId?: number;
}

export interface FormData {
  address: string;
  amount: string;
}

export interface AppState {
  recipients: Recipient[];
  isWalletConnected: boolean;
  walletAddress?: string;
  isSubmitting: boolean;
}

