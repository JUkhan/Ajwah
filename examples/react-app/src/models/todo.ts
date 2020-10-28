export enum TodoActions {
    loadtodos = 'todos-loadtodo',
    loadEnd = 'todos-loaded',
    addTodo = 'todos-add',
    addEnd = 'todos-added',
    updateTodo = 'todos-update',
    updateEnd = 'todos-update-end',
    removeTodo = 'todos-remove',
    removeEnd = 'todos-remove-end',
    searchCategory = 'todos-search-category',
    error = 'todos-error',
    errorEnd = 'todos-error-end',
    refresh = 'todos-refresh',
};

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
    searchCategory: SearchCategory;
}