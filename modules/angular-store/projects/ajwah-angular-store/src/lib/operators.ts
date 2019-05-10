import { filter } from 'rxjs/operators';
import { IAction } from './model';
import { OperatorFunction } from 'rxjs';

export function ofType<V extends IAction>(
    ...allowedTypes: string[]
): OperatorFunction<IAction, V>;
export function ofType(
    ...allowedTypes: string[]
): OperatorFunction<IAction, IAction> {
    return filter((action: IAction) =>
        allowedTypes.some(type => type === action.type)
    );
}