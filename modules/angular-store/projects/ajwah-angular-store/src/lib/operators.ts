import { filter } from 'rxjs/operators';
import { Action } from './model';
import { OperatorFunction } from 'rxjs';

export function ofType<V extends Action>(
    ...allowedTypes: string[]
): OperatorFunction<Action, V>;
export function ofType(
    ...allowedTypes: string[]
): OperatorFunction<Action, Action> {
    return filter((action: Action) =>
        allowedTypes.some(type => type === action.type)
    );
}