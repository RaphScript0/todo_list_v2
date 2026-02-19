export type TodoId = string;

export interface Todo {
  id: TodoId;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoInput {
  title: string;
}

export interface UpdateTodoInput {
  title?: string;
  completed?: boolean;
}
