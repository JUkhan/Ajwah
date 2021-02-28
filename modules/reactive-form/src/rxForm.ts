
import { PureComponent } from 'react';
import { Subscription } from 'rxjs';
import { debounceTime, take } from 'rxjs/operators';
import { FormProps} from './formModel';
import { StateObserver } from './stateObserver';
import { toMultiKeys} from './utility';

export class RxForm extends PureComponent<FormProps, any>{

    observer: StateObserver;
    subs?: Subscription;

    constructor(props: FormProps) {
        super(props);
        this.state = {};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.observer = new StateObserver(props.initialValues);
    }

    componentDidMount() {
        this.subs = this.observer.hasError$.pipe(debounceTime(230)).subscribe(hasError => {
            if (hasError) {
                this.props?.consumeErrors?.call(null, this.observer.errorState)
            }
        });
        this.subs.add(this.observer.state$.pipe(debounceTime(200)).subscribe(state => {
            this.props?.consumeState?.call(null, toMultiKeys(state));
        }));
    }

    componentWillUnmount() {
        this.subs?.unsubscribe();
        this.observer.complete();
    }

    handleSubmit(e: any) {
        if(typeof e.preventDefault ==='function'){
            e.preventDefault();
        }
        this.hasError(res => {
            if (!res && this.props.onSubmit) {
                this.props.onSubmit(this.observer.state, this.observer)
            }
        });
    }
    hasError(callback: (hasError: boolean, error?: any) => void) {
        this.observer.validate();
        this.observer.hasError$.pipe(take(1)).subscribe(res => {
            callback(res, this.observer.errorState);    
        });  
    }
    get isValid(){
        return this.observer.isValid;
    }
    validate(){
       this.observer.validate();
    }
    setState(state: any) {
        this.observer.setState({ fields: state, errors: {} });
    }
    render() {
        if (this.props.initialValues) {
            this.setState(this.props.initialValues)
        }
        return  this.props.render({ handleSubmit: this.handleSubmit, observer: this.observer });
    }
}