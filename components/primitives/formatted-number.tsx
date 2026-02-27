import { cn } from '@/lib/utils';

type FormattedNumberProps = {
  value: string | number;
  symbol?: string;
  visibleDecimals?: number;
  className?: string;
  symbolClassName?: string;
};

function FormattedNumber({
  value,
  symbol,
  visibleDecimals,
  className,
  symbolClassName,
  ...props
}: FormattedNumberProps & React.HTMLAttributes<HTMLSpanElement>) {
  const number = Number(value);
  const isUsd = symbol?.toLowerCase() === 'usd';

  const decimals = visibleDecimals ?? (Math.abs(number) >= 1 || isUsd ? 2 : 7);

  const output = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);

  return (
    <span
      className={cn('inline-flex flex-row items-center', className)}
      {...props}
    >
      {isUsd && <span className={cn(symbolClassName)}>$</span>}
      {output}
      {!isUsd && symbol && (
        <span className={cn('ml-1', symbolClassName)}>{symbol}</span>
      )}
    </span>
  );
}

export { FormattedNumber };
export type { FormattedNumberProps };
