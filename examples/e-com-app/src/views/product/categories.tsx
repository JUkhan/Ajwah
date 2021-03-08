import React from 'react';
import { Get, dispatch, useStream } from 'ajwah-reactive-form';
import { Menubar } from 'primereact/menubar';
import { ListBox } from 'primereact/listbox';
import { CategoryController } from '../../controllers';
import { useMobileActive } from '../hooks';
import { actionType as at } from '../../models';
import { classNames } from '../../utils';

export function Categories() {

    const mobileAcive = useMobileActive();
    const [{ selectedCategory, categories }] = useStream(CategoryController, con => con.menuData$, con => con.state)

    let items: any[] = mobileAcive ? categories.map(cat => {
        return {
            label: cat.name, category_id: cat.category_id,
            command: (e: any) => {
                dispatch(at.SelectCategory, { category_id: e.item.category_id })
            },
            template: (item: any, options: any) => {
                return (
                    <a className={classNames(options.className, { 'active': item.category_id === selectedCategory?.category_id })} target={item.target} onClick={options.onClick}>
                        <span className={options.labelClassName}>{item.label}</span>
                    </a>
                )
            },
        }
    }) : categories.map(cat => ({ label: cat.name, category_id: cat.category_id }));

    function selectItem(item: any) {
        if (item.value) {
            dispatch(at.SelectCategory, item.value)
        }
    }
    return (
        mobileAcive ?
            <Menubar model={items} />
            :
            <>
                <h3>Categories</h3>
                <ListBox value={selectedCategory} options={items} onChange={selectItem} optionLabel="label" />
            </>
    )
}
