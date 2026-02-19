import type { CreateTodoInput, Todo, TodoId, UpdateTodoInput } from "./types";

/**
 * Draft backend contract (per Kael):
 * - GET    /api/todos            -> 200 { data: Todo[] }
 * - POST   /api/todos { title }  -> 201 { data: Todo }
 * - PATCH  /api/todos/[id] { title?: string, completed?: boolean } -> 200 { data: Todo }
 * - DELETE /api/todos/[id]       -> 204 (no body)
 *
 * Kael is porting this implementation to `todo_list_v2`.
 */

type ApiOk<T> = { data: T };
type ApiError =
  | { error: "VALIDATION_ERROR"; details?: Array<{ path?: string; message: string }> }
  | { error: "NOT_FOUND" }
  | { error: string; [key: string]: unknown };

export async function listTodos(): Promise<Todo[]> {
  const res = await fetch("/api/todos", { method: "GET" });
  if (!res.ok) throw await toError(res);
  const json = (await res.json()) as ApiOk<Todo[]>;
  return json.data;
}

export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  const res = await fetch("/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) throw await toError(res);
  const json = (await res.json()) as ApiOk<Todo>;
  return json.data;
}

export async function updateTodo(id: TodoId, patch: UpdateTodoInput): Promise<Todo> {
  const res = await fetch(`/api/todos/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    },
  );

  if (!res.ok) throw await toError(res);
  const json = (await res.json()) as ApiOk<Todo>;
  return json.data;
}

export async function deleteTodo(id: TodoId): Promise<void> {
  const res = await fetch(`/api/todos/${encodeURIComponent(id)}`, { method: "DELETE" });
  if (!res.ok) throw await toError(res);
}

async function toError(res: Response): Promise<Error> {
  let payload: ApiError | null = null;
  try {
    payload = (await res.json()) as ApiError;
  } catch {
    // ignore
  }

  const base = `Request failed: ${res.status} ${res.statusText}`;
  if (!payload) return new Error(base);

  if (payload.error === "VALIDATION_ERROR" && Array.isArray(payload.details) && payload.details.length) {
    const details = payload.details
      .map((d: { path?: string; message: string }) =>
        d.path ? `${d.path}: ${d.message}` : d.message,
      )
      .join(", ");
    return new Error(`${base} (${payload.error}) — ${details}`);
  }

  return new Error(`${base} (${payload.error})`);
}
