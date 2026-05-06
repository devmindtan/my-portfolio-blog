import { useCallback, useMemo, useState } from "react";

interface UseSelectableSetOptions<T> {
  initialValues?: Iterable<T>;
  maxSelections?: number;
}

export function useSelectableSet<T>({
  initialValues,
  maxSelections,
}: UseSelectableSetOptions<T>) {
  const [selected, setSelected] = useState<Set<T>>(
    () => new Set(initialValues ?? []),
  );

  const update = useCallback((updater: (prev: Set<T>) => Set<T>) => {
    setSelected((prev) => updater(new Set(prev)));
  }, []);

  const toggle = useCallback(
    (value: T) => {
      let changed = false;

      update((prev) => {
        if (prev.has(value)) {
          prev.delete(value);
          changed = true;
          return prev;
        }

        if (maxSelections !== undefined && prev.size >= maxSelections) {
          return prev;
        }

        prev.add(value);
        changed = true;
        return prev;
      });

      return changed;
    },
    [maxSelections, update],
  );

  const selectAll = useCallback(
    (values: Iterable<T>) => {
      const allValues = Array.from(values);
      const constrained =
        maxSelections !== undefined
          ? allValues.slice(0, maxSelections)
          : allValues;
      setSelected(new Set(constrained));
    },
    [maxSelections],
  );

  const clear = useCallback(() => {
    setSelected(new Set());
  }, []);

  return useMemo(
    () => ({
      selected,
      setSelected,
      update,
      toggle,
      selectAll,
      clear,
      maxSelections,
    }),
    [selected, update, toggle, selectAll, clear, maxSelections],
  );
}
