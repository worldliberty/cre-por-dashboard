import { atomWithStorage } from 'jotai/utils';
import type { SyncStorage } from 'jotai/vanilla/utils/atomWithStorage';

import type { ChainName } from '@/lib/contracts/usd1-token';
import { customRpcsSchema } from '@/lib/schemas/rpc';

// ⚠️ Trust model: custom RPCs are user-provided and could return incorrect
// supply data (e.g., a malicious RPC reporting inflated balances). URL
// validation (via rpcUrlSchema) prevents scheme-injection attacks, but cannot
// guard against a dishonest node. This is an accepted trade-off — power users
// who add custom RPCs are assumed to trust the endpoints they configure.

export type CustomRpcs = Record<ChainName, string[]>;

const DEFAULT_CUSTOM_RPCS: CustomRpcs = {
  ethereum: [],
  bsc: [],
  tron: [],
  solana: [],
  aptos: [],
  plume: [],
  ab: [],
  monad: [],
  mantle: [],
  morph: [],
  tempo: [],
};

const validatedStorage: SyncStorage<CustomRpcs> = {
  getItem(key, initialValue) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return initialValue;
      const parsed = JSON.parse(raw);
      const merged = { ...DEFAULT_CUSTOM_RPCS, ...parsed };
      const result = customRpcsSchema.safeParse(merged);
      return result.success ? result.data : initialValue;
    } catch {
      return initialValue;
    }
  },
  setItem(key, newValue) {
    localStorage.setItem(key, JSON.stringify(newValue));
  },
  removeItem(key) {
    localStorage.removeItem(key);
  },
};

export const customRpcsAtom = atomWithStorage<CustomRpcs>(
  'custom-rpcs',
  DEFAULT_CUSTOM_RPCS,
  validatedStorage,
  { getOnInit: true },
);
