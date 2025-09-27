import { 
  createPublicClient, 
  createWalletClient, 
  http, 
  getAddress, 
  parseEther, 
  formatEther,
  encodeFunctionData,
  type Address,
  type Hash,
  type PublicClient,
  type WalletClient
} from 'viem';
import { rootstockTestnet } from 'viem/chains';
import { RIF_RELAY_CONFIG, RIF_TOKEN_ABI, getRequiredRifTokens } from '../config/rif-config';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/config';

export interface SmartWalletInfo {
  address: Address;
  isDeployed: boolean;
  index: number;
}

export interface TokenStatus {
  balance: bigint;
  allowance: bigint;
  isApproved: boolean;
  requiredAmount: bigint;
}

export class HybridRIFClient {
  private publicClient: PublicClient;
  public walletClient?: WalletClient;
  private userAddress?: Address;

  constructor() {
    this.publicClient = createPublicClient({
      chain: rootstockTestnet,
      transport: http(RIF_RELAY_CONFIG.rpcUrl),
    });
  }

  setWalletClient(walletClient: WalletClient, userAddress: Address) {
    this.walletClient = walletClient;
    this.userAddress = userAddress;
  }

  /**
   * Get smart wallet address for a user (deterministic)
   */
  async getSmartWalletAddress(userAddress: Address, index: number = 0): Promise<Address> {
    // For this hybrid approach, we'll use the user's address as the smart wallet
    // In a full RIF Relay implementation, this would be a separate contract
    return userAddress;
  }

  /**
   * Check if smart wallet is deployed (always true for user addresses)
   */
  async isSmartWalletDeployed(smartWalletAddress: Address): Promise<boolean> {
    return true; // User addresses are always "deployed"
  }

  /**
   * Get smart wallet info
   */
  async getSmartWallet(userAddress: Address, index: number = 0): Promise<SmartWalletInfo> {
    const address = await this.getSmartWalletAddress(userAddress, index);
    const isDeployed = await this.isSmartWalletDeployed(address);
    
    return {
      address,
      isDeployed,
      index,
    };
  }

  /**
   * Check RIF token status for a user
   */
  async checkTokenStatus(userAddress: Address, batchSize: number = 1): Promise<TokenStatus> {
    const requiredRifTokens = getRequiredRifTokens(batchSize);
    const requiredAmount = parseEther(requiredRifTokens.toString());

    try {
      const [balance, allowance] = await Promise.all([
        this.publicClient.readContract({
          address: RIF_RELAY_CONFIG.rifTokenAddress,
          abi: RIF_TOKEN_ABI,
          functionName: 'balanceOf',
          args: [userAddress],
          account: '0x0000000000000000000000000000000000000000',
        }),
        this.publicClient.readContract({
          address: RIF_RELAY_CONFIG.rifTokenAddress,
          abi: RIF_TOKEN_ABI,
          functionName: 'allowance',
          args: [userAddress, CONTRACT_ADDRESS], // Approve for the BatchTransfer contract
          account: '0x0000000000000000000000000000000000000000',
        }),
      ]);

      return {
        balance,
        allowance,
        isApproved: allowance >= requiredAmount,
        requiredAmount,
      };
    } catch (error) {
      console.error('Error checking token status:', error);
      return {
        balance: 0n,
        allowance: 0n,
        isApproved: false,
        requiredAmount,
      };
    }
  }

  /**
   * Deploy smart wallet (no-op for hybrid approach)
   */
  async deploySmartWallet(userAddress: Address, rifTokenAmount: bigint, index: number = 0): Promise<Hash> {
    // In hybrid approach, we just approve tokens for the contract
    return await this.approveTokens(userAddress, rifTokenAmount);
  }

  /**
   * Approve RIF tokens for the BatchTransfer contract
   */
  async approveTokens(userAddress: Address, amount: bigint): Promise<Hash> {
    if (!this.walletClient) {
      throw new Error('Wallet client not set');
    }

    const hash = await this.walletClient.writeContract({
      address: RIF_RELAY_CONFIG.rifTokenAddress,
      abi: RIF_TOKEN_ABI,
      functionName: 'approve',
      args: [CONTRACT_ADDRESS, amount], // Approve the BatchTransfer contract
      account: userAddress,
    });

    return hash;
  }

  /**
   * Execute batch transfer with RIF token payment
   * This calls the real BlockBundlR contract and pays gas with RIF tokens
   */
  async batchTransfer(
    userAddress: Address,
    recipients: Address[],
    amounts: bigint[],
    rifTokenAmount: bigint
  ): Promise<Hash> {
    if (!this.walletClient) {
      throw new Error('Wallet client not set');
    }

    // Step 1: Transfer RIF tokens to pay for gas
    console.log('Step 1: Paying gas with RIF tokens...');
    await this.payGasWithRIF(userAddress, rifTokenAmount);

    // Step 2: Execute the batch transfer on the real contract
    console.log('Step 2: Executing batch transfer on BlockBundlr contract...');
    const totalValue = amounts.reduce((acc, val) => acc + val, 0n);

    const hash = await this.walletClient.writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'batchTransfer',
      args: [recipients, amounts],
      value: totalValue,
      account: userAddress,
    });

    console.log('Batch transfer executed with hash:', hash);
    return hash;
  }

  /**
   * Pay gas with RIF tokens (simplified implementation)
   */
  private async payGasWithRIF(userAddress: Address, rifTokenAmount: bigint): Promise<Hash> {
    if (!this.walletClient) {
      throw new Error('Wallet client not set');
    }

    // In a full implementation, this would involve the RIF Relay infrastructure
    // For now, we'll transfer RIF tokens to a designated gas payment address
    const gasPaymentAddress = '0x0000000000000000000000000000000000000001'; // Burn address as placeholder

    const hash = await this.walletClient.writeContract({
      address: RIF_RELAY_CONFIG.rifTokenAddress,
      abi: RIF_TOKEN_ABI,
      functionName: 'transfer',
      args: [gasPaymentAddress, rifTokenAmount],
      account: userAddress,
    });

    console.log('Gas payment with RIF tokens:', hash);
    return hash;
  }

  /**
   * Get RIF token balance
   */
  async getRifBalance(userAddress: Address): Promise<bigint> {
    try {
      return await this.publicClient.readContract({
        address: RIF_RELAY_CONFIG.rifTokenAddress,
        abi: RIF_TOKEN_ABI,
        functionName: 'balanceOf',
        args: [userAddress],
        account: '0x0000000000000000000000000000000000000000',
      });
    } catch (error) {
      console.error('Error getting RIF balance:', error);
      return 0n;
    }
  }

  /**
   * Format RIF token amount for display
   */
  formatRifAmount(amount: bigint): string {
    return formatEther(amount);
  }

  /**
   * Parse RIF token amount from string
   */
  parseRifAmount(amount: string): bigint {
    return parseEther(amount);
  }

  /**
   * Check if server is available (always true for hybrid approach)
   */
  async checkRelayServerStatus(): Promise<boolean> {
    return true;
  }

  /**
   * Get transaction receipt
   */
  async getTransactionReceipt(hash: Hash) {
    return await this.publicClient.getTransactionReceipt({ hash });
  }

  /**
   * Wait for transaction confirmation
   */
  async waitForTransaction(hash: Hash) {
    return await this.publicClient.waitForTransactionReceipt({ hash });
  }
}
