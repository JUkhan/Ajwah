import { PureComponent } from "react";
import { Observable, Subscription } from "rxjs";

export interface StreamBuilderState<S> {
  error: any;
  data: S;
  loading: boolean;
}

export interface RxStateProps<S> {
  stream: Observable<S>;
  initialData?: S;
  filter?(snapshot: S): boolean;
  render(obj: StreamBuilderState<S>): any;
  also?(snapshot: S): void;
}

export class StreamBuilder<S> extends PureComponent<
  RxStateProps<S>,
  StreamBuilderState<S>
> {
  subscription?: Subscription;

  constructor(props: RxStateProps<S>) {
    super(props);
    this.state = {
      data:
        typeof this.props.initialData === "undefined"
          ? (null as any)
          : this.props.initialData,
      loading: this.props.initialData ? false : true,
      error: null,
    };
  }

  componentDidMount() {
    if (this.props.stream)
      this.subscription = this.props.stream.subscribe(
        (data) => {
          this.props.also?.call(null, data);
          this.setState({ data, loading: false });
        },
        (error) => this.setState({ error, loading: false })
      );
  }

  componentWillUnmount() {
    this.subscription?.unsubscribe();
  }

  render() {
    if (typeof this.props.filter === "function") {
      return this.props.filter(this.state.data)
        ? this.props.render(this.state)
        : null;
    }
    return this.props.render(this.state);
  }
}
