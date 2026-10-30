import type { ApiResult } from "@/lib/types";

/**
 * Turn a failed response into an ApiResult error.
 * The backend (FastAPI) puts the message in `detail`, which is a string for
 * our own errors and a list of issues for request validation errors.
 */
export async function readError<T>(res: Response): Promise<ApiResult<T>> {
  const body = await res.json().catch(() => null);
  const detail = body?.detail ?? body?.message;
  let error: string = res.statusText;
  if (typeof detail === "string") {
    error = detail;
  } else if (Array.isArray(detail) && detail.length > 0) {
    error = detail.map((issue) => issue?.msg ?? String(issue)).join("; ");
  }
  return { ok: false, error, status: res.status };
}
