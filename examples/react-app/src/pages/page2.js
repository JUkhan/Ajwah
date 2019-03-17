import React, { PureComponent } from 'react';
import { Connect } from 'ajwah-react-store';
import UserState from '../states/userState';
import { ajax } from 'rxjs/ajax';
import { take, map, catchError } from 'rxjs/operators';
import { LOAD_USER } from '../states/actions';


@Connect({
    data: state => state.user.data
})
class Page2 extends PureComponent {

    componentWillMount() {
        this.store.addState(UserState);

        ajax.getJSON('https://jsonplaceholder.typicode.com/users').pipe(
            map(data => ({ type: LOAD_USER, payload: data })),
            catchError(console.log),
            take(1),
        ).subscribe(action => this.store.dispatch(action));
    }
    componentWillUnmount() {
        this.store.removeState('user')
    }
    render() {
        console.log('page-2', this.state)
        const { data } = this.state;
        return (
            <div>{data.map(user => <div key={user.id}>{user.name}</div>)}</div>
        )
    }
}

export default Page2;