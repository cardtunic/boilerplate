import {
  type ClientResponse,
  type DetailedError,
  type InferResponseType,
  parseResponse,
} from "hono/client";
import type { ResponseFormat } from "hono/types";
import type {
  ClientErrorStatusCode,
  ServerErrorStatusCode,
  StatusCode,
  SuccessStatusCode,
} from "hono/utils/http-status";
import { type Result, ResultAsync } from "neverthrow";

type InferErrorResponse<T> = NonNullable<
  InferResponseType<T, ClientErrorStatusCode | ServerErrorStatusCode>
>;

type InferSuccessResponse<T> =
  InferResponseType<T, SuccessStatusCode> extends never
    ? undefined
    : InferResponseType<T, SuccessStatusCode>;

type ClientHandler = (
  ...args: never[]
) => Promise<ClientResponse<unknown, StatusCode, ResponseFormat>>;

async function callApi<T extends ClientHandler>(handler: T, ...args: Parameters<T>) {
  const result = await ResultAsync.fromPromise(
    parseResponse(handler(...args)),
    (unknownError: unknown) => {
      const detailedError = unknownError as DetailedError;

      const data = (detailedError.detail as { data: InferErrorResponse<T> } | undefined)?.data;

      return (
        data || {
          code: "UNEXPECTED_ERROR" as const,
        }
      );
    },
  );

  return result as Result<
    InferSuccessResponse<T>,
    | InferErrorResponse<T>
    | {
        code: "UNEXPECTED_ERROR";
      }
  >;
}

export { callApi };
