import React, { memo } from 'react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Badge } from 'primereact/badge';
import { Link } from "react-router-dom"
import { useHistory } from 'react-router-dom'
import { useStream, dispatch } from 'ajwah-reactive-form'
import { CartController, UserController } from '../controllers'
import { actionType, actionType as at } from '../models'
import { LoginRegisterDialog } from './loginRegisterDialog';


export const SearchProduct = memo(() => {
    const [{ data }] = useStream(CartController, con => con.cartItemCount$, () => '')
    const [{ data: userState }] = useStream(UserController, con => con.stream$, con => con.state)
    const itemCount = data;
    const history = useHistory();


    function show() {
        dispatch(at.LoginDialogAction, true);
    }

    function logOut() {
        dispatch(actionType.Logout)
        history.push('/');
    }

    return (
        <React.Fragment>
            <div>

                <span className="p-input-icon-right">
                    <i className="pi pi-search" />
                    <InputText style={{ width: 120 }}
                        placeholder="product search..."
                        onInput={(e: any) => dispatch(at.ProductSearching, e.target.value)} />
                </span>
                <Link to="/cart" className="p-ml-2">
                    <i

                        className="pi pi-shopping-cart p-mr-2 p-text-secondary p-overlay-badge"
                        style={{ fontSize: '1.5rem' }}
                    >
                        <Badge value={itemCount} ></Badge>
                    </i>
                </Link>
                {userState.isLogedIn && <span>
                    <span className="p-ml-2">
                        <i className="pi pi-user"></i> <b className="p-pr-2">{userState.customer?.name} </b>
                    </span>
                    <Button className="p-button-outlined p-button-rounded p-button-sm" onClick={logOut} style={{ marginTop: 15 }}>Log out</Button>
                </span>}
                {!userState.isLogedIn && <span style={{ paddingLeft: 20 }}>
                    <Button className="p-button-outlined p-button-rounded p-button-sm" onClick={show} style={{ marginTop: 15 }}>Login</Button>
                </span>}

            </div>
            <LoginRegisterDialog />

        </React.Fragment>
    );
})

