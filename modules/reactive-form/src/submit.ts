import {PureComponent} from 'react';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SubmitProps, SubmitState } from './formModel';

export class Submit extends PureComponent<SubmitProps, SubmitState>{
    subs?: Subscription;
    constructor(props: SubmitProps) {
        super(props);
        this.state = { valid: false, formData: {} } as SubmitState;

    }
    componentDidMount() {
        if (typeof this.props.observer === 'undefined') {
            throw new Error('observer prop is not defined');
        }
        this.subs = this.props.observer.hasError$.pipe(debounceTime(450)).subscribe(hasError => {
            this.setState({ valid: this.props.observer.isValid, formData: this.props.observer.state });
        });
    }
    componentWillUnmount() {
        this.subs?.unsubscribe();
    }

    render() {
        return this.props.render(this.state.valid, this.state.formData);
    }
}