import React, { useEffect, useState } from 'react';
import UserState from '../states/userState';
import { ajax } from 'rxjs/ajax';
import { take, map } from 'rxjs/operators';
import { LOAD_USER } from '../states/actions';
import { store } from 'ajwah-store';


function loadData() {
    ajax.getJSON('https://jsonplaceholder.typicode.com/users').pipe(
        map(data => ({ type: LOAD_USER, payload: data })),
        take(1),
    ).subscribe(action => store().dispatch(action));
}

function page2(props) {

    const [user, setUser] = useState({});

    useEffect(() => {
        store().addState(UserState);
        const subs = store().select('user').subscribe(res => setUser(res));
        loadData();
        return () => {
            store().removeState('user');
            subs.unsubscribe();
            console.log('page2-cleanup')
        }
    }, []);

    console.log('fx-page-2', user)
    const { data = [] } = user;
    return (
        <div>{data.map(user => <div key={user.id}>{user.name}</div>)}</div>
    )

}

export default page2;