import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  mainnet,
  polygon,
  arbitrum,
  optimism,
  base,
  sepolia,
  rootstockTestnet
} from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Batch Chain",
  projectId:
    process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "your-project-id",
  chains: [rootstockTestnet],
  ssr: true,
});

