import React from 'react';
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { dispatch, useStream } from 'ajwah-reactive-form';
import { useMobileActive } from '../views/hooks';
import { actionType as at } from '../models';
import { classNames } from '../utils';
import { DepartmentController } from '../controllers';
import { SearchProduct } from '../views/searchProduct'


export function TopMenu() {

    const mobileActive = useMobileActive();
    const [{ data }] = useStream(DepartmentController, con => con.stream$, con => con.state)

    const items = data?.deparments.map(dept => {
        return {
            label: dept.name, department_id: dept.department_id,
            command: (e: any) => {
                if (data?.selectedDepartment?.department_id !== e.item.department_id) {
                    dispatch(at.SelectDepartment, { department_id: e.item.department_id })
                }
            },
            template: (item: any, options: any) => {
                return (
                    <a className={classNames(options.className, { 'active': item.department_id === data?.selectedDepartment?.department_id })} target={item.target} onClick={options.onClick}>
                        <span className={options.labelClassName}>{item.label}</span>
                    </a>
                )
            }
        }
    })
    const end = <InputText placeholder="Search" type="text" />;
    const start = !mobileActive && <div style={{ display: 'inline-block', width: 200 }} className="p-component p-text-center"><span className="p-text-bold">juShop</span></div>
    return (

        <Menubar start={() => start} model={items} end={() => <SearchProduct />} />
    )
}