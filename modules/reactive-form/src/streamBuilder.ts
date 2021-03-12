import { PureComponent } from "react";
import { Observable, Subscription } from "rxjs";

export interface RxStateProps<S> {
  stream: Observable<S>;
  initialData?: S;
  filter?(snapshot: S): boolean;
  render(snapshot: S): any;
  also?(snapshot: S): void;
}
export interface StreamBuilderState<S> {
  snapshot: S;
}
export class StreamBuilder<S> extends PureComponent<
  RxStateProps<S>,
  StreamBuilderState<S>
> {
  subscription?: Subscription;

  constructor(props: RxStateProps<S>) {
    super(props);
    this.state = {
      snapshot:
        typeof this.props.initialData === "undefined"
          ? (null as any)
          : this.props.initialData,
    };
  }

  componentDidMount() {
    if (this.props.stream)
      this.subscription = this.props.stream.subscribe((snapshot) => {
        this.props.also?.call(null, snapshot);
        this.setState({ snapshot });
      });
  }

  componentWillUnmount() {
    this.subscription?.unsubscribe();
  }

  render() {
    if (typeof this.props.filter === "function") {
      return this.props.filter(this.state.snapshot)
        ? this.props.render(this.state.snapshot)
        : null;
    }
    if (this.state.snapshot === null) return null;
    return this.props.render(this.state.snapshot);
  }
}
