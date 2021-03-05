import * as React from "react";
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
export class StreamBuilder<S> extends React.PureComponent<
  RxStateProps<S>,
  StreamBuilderState<S>
> {
  subscription?: Subscription;

  constructor(props: RxStateProps<any>) {
    super(props);
    this.state = {
      snapshot: <S>(
        (typeof this.props.initialData === "undefined"
          ? null
          : this.props.initialData)
      ),
    };
  }

  componentDidMount() {
    if (typeof this.props.stream.subscribe !== "function")
      throw new Error("stream prop must be a type from Obserbablle");
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
    return this.props.render(this.state.snapshot);
  }
}
