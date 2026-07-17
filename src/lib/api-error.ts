import { isAxiosError } from "axios";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function resolveApiError(
  err: unknown,
  messages: Partial<Record<number, string>>,
  fallback: string,
): ApiError {
  const status = isAxiosError(err) ? err.response?.status : undefined;
  const message = (status !== undefined && messages[status]) || fallback;
  return new ApiError(message, status);
}
