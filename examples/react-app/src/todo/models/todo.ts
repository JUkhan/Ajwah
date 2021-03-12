import { TodoStateController } from "../services/todoStateController";

export enum SearchCategory {
    all = 1, active, completed
}
export interface Todo {
    id: number;
    description: string;
    completed: boolean;
}
export interface TodoState {
    todos: Todo[];
    searchCategory?: SearchCategory;
}
export const TodoActions = {
  SPINNING_START : "SPINNING_START",
  SPINNING_END   : "SPINNING_END",
  TODOS_ERROR    : "TODOS_ERROR",
  TODOS_UPDATED  : "TODOS_UPDATED",
  TODOS_ADDED  : "TODOS_ADDED" 

};
export interface Props {
    controller: TodoStateController
}