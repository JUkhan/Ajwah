import React from 'react';
import { Dialog } from 'primereact/dialog';
import { TabView, TabPanel } from 'primereact/tabview';
import { Login } from './login';
import { Register } from './register';
import { action$ } from 'ajwah-reactive-form';
import { actionType as at } from '../models';
import { useActionStream } from './hooks';
import { debounceTime, pluck } from 'rxjs/operators';

export const LoginRegisterDialog = () => {

    const [visible, showModel] = useActionStream(action$.whereType(at.LoginDialogAction).pipe(debounceTime(10), pluck('payload')), false);

    function hide() {
        showModel(false);
    }

    return (

        <Dialog header="Login and Signup"
            style={{ width: 400 }}
            //footer={<Button onClick={hide}>Close</Button>}
            onHide={hide}
            visible={visible}>
            <React.Fragment>
                <TabView>
                    <TabPanel header="Login"><Login /> </TabPanel>
                    <TabPanel header="Create New Accout"><Register /></TabPanel>
                </TabView>
            </React.Fragment>

        </Dialog>
    );
}

