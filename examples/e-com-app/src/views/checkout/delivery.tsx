import React, { useRef, useEffect, FC } from "react";
import { InputText } from "primereact/inputtext";
import { Divider } from 'primereact/divider'
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import { RxForm, Field, required, FormStateController, Validator, dispatch, useStream, action$ } from "ajwah-reactive-form";
import { UserController } from "../../controllers";
import { actionType as at } from "../../models";


export function Delivery() {

  const [billingDetails] = useStream(
    UserController,
    con => con.select(state => state.billingDetails),
    conn => conn.state.billingDetails
  )
  const form = useRef({} as RxForm);

  useEffect(() => {
    var sub = action$.whereType(at.RequestForCheckDelivery).subscribe(() => {
      if (form.current.isValid) {
        dispatch(at.ChangeAddress, form.current.formData);
        dispatch(at.DeliveryFormStatus, true);
      } else {
        form.current.validate();
      }
    })
    return () => {
      sub.unsubscribe();
    }
  }, [])

  return (
    <RxForm
      ref={form}
      initialValues={billingDetails}
      render={({ observer }) => (
        <form>
          <Divider>Billing Address</Divider>

          <Address group="billingAddress" autoFocus={true} observer={observer} validators={[required('This field is required')]} />

          <Field
            name="isBiAsDelivery"
            observer={observer}

            render={({ value, setValue, error }) => (
              <div>
                <div className="p-field-checkbox p-mt-2">
                  <Checkbox
                    inputId="ch1"
                    onChange={e => setValue(e.checked)}
                    checked={value}
                  />
                  <label htmlFor="ch1">
                    My billing information is the same as my delivery information
                </label>

                </div>
                <Divider>Delivery Address</Divider>
                <fieldset style={{ border: 0 }} disabled={value}>
                  <Address group="deliveryAddress" autoFocus={false} observer={observer} validators={value ? [] : [required('This field is required')]} />
                </fieldset>
              </div>
            )}
          />


          <Field
            name="deliveryOption"
            observer={observer}
            render={({ value, setValue, error }) => (
              <div className="p-formgroup-inline">
                <div className="p-field-checkbox">
                  <RadioButton
                    inputId="r1"
                    name="city2"
                    value="1"
                    onChange={e => setValue(e.value)}
                    checked={value === "1"}
                  />
                  <label htmlFor="r1">
                    <b>Standard shipping: </b>(free, 2-3 business days)
                  </label>
                </div>
                <div className="p-field-checkbox">
                  <RadioButton
                    inputId="r2"
                    name="city2"
                    value="2"
                    onChange={e => setValue(e.value)}
                    checked={value === "2"}
                  />
                  <label htmlFor="r2">
                    <b>Express shipping: </b>($15, 1-2 business days)
                  </label>
                </div>
              </div>
            )}
          />
        </form>
      )}
    />
  );
}

export interface AddressProps {
  observer: FormStateController,
  validators: Validator[],
  autoFocus: boolean,
  group: string
}
const Address: FC<AddressProps> = ({ group, observer, validators, autoFocus }) => {

  return (<>
    <div className="p-fluid p-formgrid p-grid">
      <Field
        autoFocus={autoFocus}
        name={`${group}.firstName`}
        observer={observer}
        validators={validators}
        render={({ setRef, value, setValue, error, flag, setFlag }) => (
          <div className="p-field p-col">
            <label>First Name</label>
            <InputText
              ref={setRef}
              onBlur={e => setFlag(true)}
              defaultValue={value}
              onChange={(e: any) => setValue(e.target.value)}
              type="text"
            />
            <small className="p-error">{flag && error}</small>
          </div>
        )}
      />
      <Field
        name={`${group}.lastName`}
        observer={observer}
        validators={validators}
        render={({ value, setValue, error, flag, setFlag }) => (
          <div className="p-field p-col">
            <label>Last Name</label>
            <InputText
              onBlur={e => setFlag(true)}
              defaultValue={value}
              onChange={(e: any) => setValue(e.target.value)}
              type="text"
            />
            <small className="p-error">{flag && error}</small>
          </div>
        )}
      />
    </div>
    <div className="p-fluid p-formgrid p-grid">
      <Field
        name={`${group}.address`}
        observer={observer}
        validators={validators}
        render={({ value, setValue, error, flag, setFlag }) => (
          <div className="p-field p-col">
            <label>Address </label>
            <InputText
              onBlur={e => setFlag(true)}
              defaultValue={value}
              onChange={(e: any) => setValue(e.target.value)}
              type="text"
            />
            <small className="p-error">{flag && error}</small>
          </div>
        )}
      />
      <Field
        name={`${group}.city`}
        observer={observer}
        validators={validators}
        render={({ value, setValue, error, flag, setFlag }) => (
          <div className="p-field p-col">
            <label>City</label>
            <InputText
              defaultValue={value}
              onBlur={e => setFlag(true)}
              onChange={(e: any) => setValue(e.target.value)}
              type="text"
            />
            <small className="p-error">{flag && error}</small>
          </div>
        )}
      />
    </div>
    <div className="p-fluid p-formgrid p-grid">
      <Field
        name={`${group}.state`}
        observer={observer}
        validators={validators}
        render={({ value, setValue, error, flag, setFlag }) => (
          <div className="p-field p-col">
            <label>State</label>
            <InputText
              onBlur={e => setFlag(true)}
              defaultValue={value}
              onChange={(e: any) => setValue(e.target.value)}
              type="text"
            />
            <small className="p-error">{flag && error}</small>
          </div>
        )}
      />
      <Field
        name={`${group}.zipCode`}
        observer={observer}
        validators={validators}
        render={({ value, setValue, error, flag, setFlag }) => (
          <div className="p-field p-col">
            <label>Zip Code</label>
            <InputText
              onBlur={e => setFlag(true)}
              defaultValue={value}
              onChange={(e: any) => setValue(e.target.value)}
              type="number"
            />
            <small className="p-error">{flag && error}</small>
          </div>
        )}
      />
    </div>

  </>)
}