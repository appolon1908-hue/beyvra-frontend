export type PlatformFeatureFlags = {
  demoTrading: boolean;
  guestDemo: boolean;
  liveTrading: boolean;
  deposits: boolean;
  withdrawals: boolean;
  forexMode: boolean;
  stocksMode: boolean;
  flexMode: boolean;
  quicklerLikeMode: boolean;
  pendingOrders: boolean;
  flipDirection: boolean;
  technicalIndicators: boolean;
  drawingTools: boolean;
  customStrategies: boolean;
  newsStream: boolean;
  rewards: boolean;
  referrals: boolean;
  tournaments: boolean;
  mediaAdmin: boolean;
};

/** Safe staging defaults. The server config endpoint is authoritative when available. */
export const stagingPlatformFeatures: PlatformFeatureFlags = {
  demoTrading: true,
  guestDemo: true,
  liveTrading: false,
  deposits: false,
  withdrawals: false,
  forexMode: false,
  stocksMode: false,
  flexMode: false,
  quicklerLikeMode: false,
  pendingOrders: true,
  flipDirection: false,
  technicalIndicators: false,
  drawingTools: false,
  customStrategies: false,
  newsStream: false,
  rewards: false,
  referrals: false,
  tournaments: false,
  mediaAdmin: false,
};

export function featureEnabled(
  flag: keyof PlatformFeatureFlags,
  features: PlatformFeatureFlags = stagingPlatformFeatures,
): boolean {
  return features[flag] === true;
}
