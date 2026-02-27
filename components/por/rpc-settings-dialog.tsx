'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom } from 'jotai';
import { Plus, Settings, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CHAIN_META, type ChainName } from '@/lib/contracts/usd1-token';
import {
  type RpcFormValues,
  rpcFormSchema,
  rpcUrlSchema,
} from '@/lib/schemas/rpc';
import { customRpcsAtom } from '@/lib/store/rpc';

const CHAINS = Object.keys(CHAIN_META) as ChainName[];

const emptyInputs = () =>
  Object.fromEntries(CHAINS.map((c) => [c, ''])) as Record<ChainName, string>;

const emptyErrors = () =>
  Object.fromEntries(CHAINS.map((c) => [c, ''])) as Record<ChainName, string>;

export function RpcSettingsDialog() {
  const [customRpcs, setCustomRpcs] = useAtom(customRpcsAtom);
  const [open, setOpen] = useState(false);
  const [inputs, setInputs] = useState(emptyInputs);
  const [inputErrors, setInputErrors] = useState(emptyErrors);

  const form = useForm<RpcFormValues>({
    resolver: zodResolver(rpcFormSchema),
    defaultValues: customRpcs,
  });

  function handleOpen(nextOpen: boolean) {
    if (nextOpen) {
      form.reset(customRpcs);
      setInputs(emptyInputs());
      setInputErrors(emptyErrors());
    }
    setOpen(nextOpen);
  }

  function onSubmit(values: RpcFormValues) {
    setCustomRpcs(values);
    setOpen(false);
  }

  function addRpc(chain: ChainName) {
    const value = inputs[chain].trim();
    if (!value) return;

    const result = rpcUrlSchema.safeParse(value);
    if (!result.success) {
      setInputErrors((prev) => ({
        ...prev,
        [chain]: result.error.issues[0]?.message ?? 'Invalid URL',
      }));
      return;
    }

    const current = form.getValues(chain);
    if (current.includes(result.data)) {
      setInputErrors((prev) => ({
        ...prev,
        [chain]: 'URL already added',
      }));
      return;
    }

    form.setValue(chain, [...current, result.data], {
      shouldDirty: true,
    });
    setInputs((prev) => ({ ...prev, [chain]: '' }));
    setInputErrors((prev) => ({ ...prev, [chain]: '' }));
  }

  function removeRpc(chain: ChainName, index: number) {
    const current = form.getValues(chain);
    form.setValue(
      chain,
      current.filter((_, i) => i !== index),
      { shouldDirty: true },
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="cursor-pointer gap-1.5 text-foreground-secondary hover:text-foreground"
        >
          <Settings className="size-5" />
          <span className="hidden text-sm font-semibold md:inline">
            RPC Settings
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Custom RPC Endpoints</DialogTitle>
          <DialogDescription>
            Add your own RPC URLs per chain. Custom endpoints are tried first
            before falling back to defaults.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex min-w-0 flex-col gap-5"
          >
            {CHAINS.map((chain) => {
              const urls = form.watch(chain);
              return (
                <div key={chain} className="flex min-w-0 flex-col gap-2">
                  <Label className="text-foreground-secondary">
                    {CHAIN_META[chain].label}
                  </Label>

                  {urls.map((url, i) => (
                    <div key={url} className="flex min-w-0 items-center gap-2">
                      <code className="min-w-0 flex-1 truncate rounded-md bg-muted px-2 py-1 text-xs">
                        {url}
                      </code>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => removeRpc(chain, i)}
                        className="shrink-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  ))}

                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="https://..."
                      value={inputs[chain]}
                      onChange={(e) =>
                        setInputs((prev) => ({
                          ...prev,
                          [chain]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addRpc(chain);
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      onClick={() => addRpc(chain)}
                      className="shrink-0"
                    >
                      <Plus />
                      <span className="sr-only">Add</span>
                    </Button>
                  </div>

                  {inputErrors[chain] && (
                    <p className="text-destructive text-xs">
                      {inputErrors[chain]}
                    </p>
                  )}
                </div>
              );
            })}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
