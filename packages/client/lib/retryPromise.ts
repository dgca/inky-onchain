const delays = [1000, 2000, 3000];

export async function retryPromise<T>(fn: () => Promise<T>): Promise<T> {
  let lastError: unknown;

  // First attempt
  try {
    return await fn();
  } catch (error) {
    lastError = error;
  }

  // Retry attempts with delays
  for (let i = 0; i < delays.length; i++) {
    try {
      await new Promise((resolve) => setTimeout(resolve, delays[i]));
      return await fn();
    } catch (error) {
      lastError = error;
    }
  }

  // If we get here, all attempts failed
  throw lastError;
}
