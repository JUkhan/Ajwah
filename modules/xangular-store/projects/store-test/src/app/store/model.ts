export interface ITodoState {
    message: string;
    data: any[];
}

export interface ICounterState {
    count: number;
    msg: string;
}

export interface ISearchState {
    loading: boolean;
    error: string;
    res: any[];
}

export interface ITutorialState {
    data: any[];
}

export interface AppState {
    todo: ITodoState;
    counter: ICounterState;
    search: ISearchState;
    tutorial: ITutorialState;
}