import {
  columnSizingFeature,
  columnVisibilityFeature,
  createSortedRowModel,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/react-table';

/**
 * react-table v9 requires each used feature to be registered explicitly (v8
 * bundled them all). This table sorts, toggles column visibility and sets a
 * couple of fixed column widths, so only those three features are registered —
 * the rest stay out of the bundle.
 *
 * ⚠️ Order matters — a feature must be declared before the row-model slot that
 * depends on it, so `rowSortingFeature` precedes `sortedRowModel`.
 * `columnSizingFeature` is what provides `columnDef.size` and `column.getSize()`
 * (interactive resizing would additionally need `columnResizingFeature`).
 */
export const supplyTableFeatures = tableFeatures({
  rowSortingFeature,
  columnVisibilityFeature,
  columnSizingFeature,
  sortedRowModel: createSortedRowModel(),
});

export type SupplyTableFeatures = typeof supplyTableFeatures;
