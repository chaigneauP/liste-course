export type RunExclusive = <T>(task: () => Promise<T>) => Promise<T>;

/**
 * Sérialise les accès au stockage. Sans cela, deux mutations rapprochées
 * peuvent lire l'état avant que la précédente n'ait été écrite et se perdre.
 */
export function createMutex(): RunExclusive {
  let tail: Promise<unknown> = Promise.resolve();

  return <T>(task: () => Promise<T>): Promise<T> => {
    const result = tail.then(task, task);
    tail = result.catch(() => undefined);
    return result;
  };
}
