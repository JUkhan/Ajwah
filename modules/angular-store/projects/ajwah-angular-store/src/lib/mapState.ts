export function mapState(state: any, actionType?: string) {
    return { hasState: true, state: state, type: actionType };
}
