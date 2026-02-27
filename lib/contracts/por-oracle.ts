export const POR_ORACLE_ADDRESS =
  '0x691b74146cdba162449012aa32d3cbf5df77d4c4' as const;

export const ETHERSCAN_URL =
  `https://etherscan.io/address/${POR_ORACLE_ADDRESS}#readContract` as const;

export const RESERVES_DECIMALS = 18;

export const porOracleAbi = [
  {
    inputs: [],
    name: 'latestBundle',
    outputs: [{ internalType: 'bytes', name: 'bundle', type: 'bytes' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'latestBundleTimestamp',
    outputs: [{ internalType: 'uint256', name: 'timestamp', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'bundleDecimals',
    outputs: [{ internalType: 'uint8[]', name: 'decimals', type: 'uint8[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'description',
    outputs: [
      {
        internalType: 'string',
        name: 'aggregatorDescription',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
