import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { useMobileActive } from '../views/hooks';
import { TopMenu } from './topMenu';
import { Categories, Checkout, Products, ShoppingCart, Success } from '../views';
import { Message } from '../views/message';
export function Layout() {
    const mobileActive = useMobileActive();
    const content = <div>
        <Switch>
            <Route path="/" exact component={Products} />
            <Route path="/cart" component={ShoppingCart} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/success" component={Success} />
        </Switch>
    </div>
    const fragment = mobileActive ?
        <React.Fragment>

            <Categories />
            {content}
        </React.Fragment>
        :
        <div className="desktop-area">
            <div className="p-grid">
                <div className="p-col-2">
                    <Categories />
                </div>
                <div className="p-col-10">
                    {content}
                </div>
            </div>
        </div>

    return (
        <React.Fragment>
            <Message/>
            <TopMenu />
            {fragment}
        </React.Fragment>
    )
}