import { TSearchTermsSchema } from "@workspace/types";

export function replaceKeysWithEntries(
  obj: Record<string, any>,
  arr: TSearchTermsSchema
) {
  const entries = Object.entries(obj);
  const newEntries = entries.map(([_, value], index) => [
    arr.searchTerms[index] || `term${index + 1}`,
    value,
  ]);

  return Object.fromEntries(newEntries);
}
