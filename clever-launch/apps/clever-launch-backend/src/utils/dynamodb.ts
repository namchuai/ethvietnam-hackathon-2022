import { unmarshall } from '@aws-sdk/util-dynamodb';

export function parseArray<T>(
  input: Record<string, any>[] | undefined
): Array<T> {
  if (!input || !input.length) {
    return [];
  }

  const ret: T[] = [];
  for (const item of input) {
    ret.push(unmarshall(item) as T);
  }

  return ret;
}

export const ConditionalCheckFailedException =
  'ConditionalCheckFailedException';

export type PaginatedArray<T> = {
  data: Array<T>;
  lastEvaluatedKey?: Record<string, unknown>;
};
