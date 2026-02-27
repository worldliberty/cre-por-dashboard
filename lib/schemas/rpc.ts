import { z } from 'zod';

/** Validates a single RPC URL: must be a valid http(s) URL. */
export const rpcUrlSchema = z
  .string()
  .trim()
  .url()
  .refine((v) => {
    try {
      const { protocol } = new URL(v);
      return protocol === 'http:' || protocol === 'https:';
    } catch {
      return false;
    }
  }, 'URL must use http or https protocol');

const rpcUrlArray = z.array(rpcUrlSchema);

/** Validates the full CustomRpcs shape stored in localStorage. */
export const customRpcsSchema = z.object({
  ethereum: rpcUrlArray,
  bsc: rpcUrlArray,
  tron: rpcUrlArray,
  solana: rpcUrlArray,
  aptos: rpcUrlArray,
});

/** Form-level schema used by react-hook-form. */
export const rpcFormSchema = customRpcsSchema;

export type RpcFormValues = z.infer<typeof rpcFormSchema>;
