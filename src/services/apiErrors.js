import axios from "axios";

export function getApiErrorMessage(error) {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Unable to connect. Check your internet connection and try again.";
    }

    if (error.response.status === 404) {
      return "The requested product could not be found.";
    }

    if (error.response.status >= 500) {
      return "The product service is temporarily unavailable. Please try again.";
    }

    return error.response.data?.message
      ? `Request failed: ${error.response.data.message}`
      : `Unable to load data (error ${error.response.status}). Please try again.`;
  }

  return error instanceof Error && error.message
    ? error.message
    : "Something went wrong. Please try again.";
}

export function shouldRetryQuery(failureCount, error) {
  const status = error?.response?.status;
  const isClientError = status >= 400 && status < 500;
  const isRetryableClientError = status === 408 || status === 429;
  return failureCount < 2 && (!isClientError || isRetryableClientError);
}

export function queryRetryDelay(attempt) {
  return Math.min(1000 * 2 ** attempt, 5000);
}
