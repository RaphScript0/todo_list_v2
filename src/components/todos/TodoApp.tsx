"use client";

import { useEffect, useId, useMemo, useState } from "react";

import type { Todo, TodoId } from "@/lib/todos/types";
import { createTodo, deleteTodo, listTodos, updateTodo } from "@/lib/todos/api";

type Filter = "all" | "active" | "completed";

export function TodoApp() {
  const titleId = useId();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>("all");

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [busyId, setBusyId] = useState<TodoId | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setError(null);
        const data = await listTodos();
        if (!isMounted) return;
        setTodos(data);
      } catch (e) {
        if (!isMounted) return;
        setError(getErrorMessage(e));
      } finally {
        if (!isMounted) return;
        setIsInitialLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter((t) => !t.completed);
      case "completed":
        return todos.filter((t) => t.completed);
      default:
        return todos;
    }
  }, [filter, todos]);

  const remainingCount = useMemo(
    () => todos.reduce((acc, t) => acc + (t.completed ? 0 : 1), 0),
    [todos],
  );

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    const nextTitle = title.trim();
    if (!nextTitle) return;

    setIsCreating(true);
    setError(null);

    try {
      const created = await createTodo({ title: nextTitle });
      setTodos((prev) => [created, ...prev]);
      setTitle("");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsCreating(false);
    }
  }

  async function onToggle(todo: Todo) {
    setBusyId(todo.id);
    setError(null);

    try {
      const updated = await updateTodo(todo.id, { completed: !todo.completed });
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  async function onDelete(id: TodoId) {
    setBusyId(id);
    setError(null);

    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  const isMutating = isCreating || busyId !== null;

  return (
    <section className="todoCard">
      <header className="todoHeader">
        <h1 className="todoTitle">Todos</h1>
        <p className="todoSubtitle">Add items, mark them complete, and delete them.</p>
      </header>

      <form onSubmit={onAdd} className="todoForm">
        <div className="todoField">
          <label htmlFor={titleId} className="srOnly">
            Todo title
          </label>
          <input
            id={titleId}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs doing?"
            className="todoInput"
            autoComplete="off"
            disabled={isInitialLoading}
          />
        </div>
        <button
          type="submit"
          className="todoButtonPrimary"
          disabled={isInitialLoading || isMutating || title.trim().length === 0}
        >
          {isCreating ? "Adding…" : "Add"}
        </button>
      </form>

      <div className="todoErrorRegion" aria-live="polite" aria-atomic="true">
        {error ? (
          <div className="todoError">
            <p className="todoErrorTitle">Something went wrong</p>
            <p className="todoErrorMsg">{error}</p>
          </div>
        ) : null}
      </div>

      <div className="todoMeta">
        <p className="todoRemaining">
          {isInitialLoading ? "Loading…" : `${remainingCount} remaining`}
        </p>
        <div className="todoFilters" role="tablist" aria-label="Todo filter">
          <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
            All
          </FilterButton>
          <FilterButton
            active={filter === "active"}
            onClick={() => setFilter("active")}
          >
            Active
          </FilterButton>
          <FilterButton
            active={filter === "completed"}
            onClick={() => setFilter("completed")}
          >
            Completed
          </FilterButton>
        </div>
      </div>

      <div className="todoListWrap">
        {isInitialLoading ? (
          <ul className="todoList" aria-label="Loading todos">
            {Array.from({ length: 4 }).map((_, i) => (
              <li key={i} className="todoSkeleton" />
            ))}
          </ul>
        ) : visibleTodos.length === 0 ? (
          <p className="todoEmpty">No todos yet.</p>
        ) : (
          <ul className="todoList" aria-label="Todo list">
            {visibleTodos.map((todo) => (
              <TodoRow
                key={todo.id}
                todo={todo}
                disabled={isMutating}
                onToggle={() => onToggle(todo)}
                onDelete={() => onDelete(todo.id)}
                isBusy={busyId === todo.id}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={"todoFilter" + (active ? " todoFilterActive" : "")}
    >
      {children}
    </button>
  );
}

function TodoRow({
  todo,
  disabled,
  onToggle,
  onDelete,
  isBusy,
}: {
  todo: Todo;
  disabled: boolean;
  onToggle: () => void;
  onDelete: () => void;
  isBusy: boolean;
}) {
  const checkboxId = useId();

  return (
    <li className="todoRow" aria-busy={isBusy || undefined}>
      <div className="todoRowMain">
        <input
          id={checkboxId}
          type="checkbox"
          checked={todo.completed}
          onChange={onToggle}
          disabled={disabled}
          className="todoCheckbox"
        />
        <label
          htmlFor={checkboxId}
          className={"todoRowLabel" + (todo.completed ? " todoRowLabelDone" : "")}
        >
          {todo.title}
        </label>
      </div>

      <button
        type="button"
        onClick={onDelete}
        disabled={disabled}
        className="todoButtonGhost"
        aria-label={`Delete todo: ${todo.title}`}
      >
        {isBusy ? "Deleting…" : "Delete"}
      </button>
    </li>
  );
}

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Unknown error";
}
