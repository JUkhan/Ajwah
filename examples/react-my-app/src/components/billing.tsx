import React from "react";
import {
    RxForm,
    Field,
    required,
    email,
    Submit,
    Group
} from "ajwah-reactive-form";

function submitForm(data: any) {
    console.log(data);
}

export const GroupingForm = () => (
    <RxForm
        consumeState={e => console.log(e)}
        consumeErrors={e => console.log(e)}
        onSubmit={submitForm}
        render={({ observer, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
                <Field
                    name="email"
                    debounce
                    observer={observer}
                    validators={[
                        required("Please input you email address"),
                        email("Not a valid email address")
                    ]}
                    render={({ setRef, setValue, error }) => (
                        <div>
                            <input
                                placeholder="email"
                                type="text"
                                ref={setRef}
                                onChange={e => setValue(e.target.value)}
                            />
                            <div className="error">{error}</div>
                        </div>
                    )}
                />
                <fieldset>
                    <legend>Billing Address:</legend>
                    <Group name="billingAddress">
                        <Field
                            name="firstName"
                            debounce
                            observer={observer}
                            validators={[required("Please input your first name")]}
                            render={({ setValue, error }) => (
                                <div>
                                    <input
                                        placeholder="First Name"
                                        type="text"
                                        onChange={e => setValue(e.target.value)}
                                    />
                                    <div className="error">{error}</div>
                                </div>
                            )}
                        />
                        <Field
                            name="lastName"
                            observer={observer}
                            validators={[required("Please input your last name")]}
                            render={({ setValue, error }) => (
                                <div>
                                    <input
                                        placeholder="Last Name"
                                        type="text"
                                        onChange={e => setValue(e.target.value)}
                                    />
                                    <div className="error">{error}</div>
                                </div>
                            )}
                        />
                        <Field
                            name="phoneNumber"
                            observer={observer}
                            validators={[required("Please input your phone number")]}
                            render={({ setValue, error }) => (
                                <div>
                                    <input
                                        placeholder="Phone Number"
                                        type="text"
                                        onChange={e => setValue(e.target.value)}
                                    />
                                    <div className="error">{error}</div>
                                </div>
                            )}
                        />
                    </Group>
                </fieldset>
                <Field
                    name="isBillingAsDelivery"
                    onChange={({value}) => typeof value ==='boolean' && observer.validate() }
                    observer={observer}
                    render={({ value, setValue }) =>
                        <React.Fragment>
                            <label>
                                <input onChange={e => setValue(e.currentTarget.checked)} type="checkbox" />
                                My billing information is the same as my delivery information
                        </label>


                            <fieldset disabled={value}>

                                <legend>Delivery Address:</legend>
                                <Group name="deliveryAddress">
                                    <Field
                                        name="firstName"
                                        observer={observer}
                                        validators={state => value ? [] : [required("Please input your first name")]}
                                        render={({ setValue, error }) => (
                                            <div>
                                                <input
                                                    placeholder="First Name"
                                                    type="text"
                                                    onChange={e => setValue(e.target.value)}
                                                />
                                                <div className="error">{error}</div>

                                            </div>
                                        )}
                                    />
                                    <Field
                                        name="lastName"
                                        observer={observer}
                                        validators={state => value ? [] : [required("Please input your last name")]}
                                        render={({ setValue, error }) => (
                                            <div>
                                                <input
                                                    placeholder="Last Name"
                                                    type="text"
                                                    onChange={e => setValue(e.target.value)}
                                                />
                                                <div className="error">{error}</div>
                                            </div>
                                        )}
                                    />
                                    <Field
                                        name="phoneNumber"
                                        observer={observer}
                                        validators={state => value ? [] : [required("Please input your phone number")]}
                                        render={({ setValue, error }) => (
                                            <div>
                                                <input
                                                    placeholder="Phone Number"
                                                    type="text"
                                                    onChange={e => setValue(e.target.value)}
                                                />
                                                <div className="error">{error}</div>
                                            </div>
                                        )}
                                    />
                                </Group>
                            </fieldset>
                        </React.Fragment>
                    } />
                <div>
                    <Submit
                        observer={observer}
                        render={valid => <button disabled={!valid} type="submit">Submit</button>}
                    />
                </div>
            </form>
            
        )}
    />
);
