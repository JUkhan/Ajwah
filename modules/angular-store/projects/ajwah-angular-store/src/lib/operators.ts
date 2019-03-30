import { filter } from 'rxjs/operators';

export const ofType = (...types: any[]) => (source) => source.pipe(
    filter(({ type }) => {
        return types.some(_type => _type === type);
    })
);