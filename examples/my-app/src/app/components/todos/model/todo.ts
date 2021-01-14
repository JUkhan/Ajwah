export type Todo={
    id?: number;
    description: string;
    completed: boolean;
}
export  enum SearchCategory { all = 1, active, completed}
export interface TodoState{
    todos:Array<Todo>,
    searchCategory?: SearchCategory
}

