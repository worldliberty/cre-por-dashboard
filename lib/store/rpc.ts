import { atomWithStorage } from 'jotai/utils';
import type { SyncStorage } from 'jotai/vanilla/utils/atomWithStorage';

import type { ChainName } from '@/lib/contracts/usd1-token';
import { customRpcsSchema } from '@/lib/schemas/rpc';

export type CustomRpcs = Record<ChainName, string[]>;

const DEFAULT_CUSTOM_RPCS: CustomRpcs = {
  ethereum: [],
  bsc: [],
  tron: [],
  solana: [],
  aptos: [],
};

const validatedStorage: SyncStorage<CustomRpcs> = {
  getItem(key, initialValue) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return initialValue;
      const parsed = JSON.parse(raw);
      const result = customRpcsSchema.safeParse(parsed);
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
