import { map } from "rxjs/operators";
import { distinctUntilChanged } from "rxjs/operators";
import { debounceTime } from "rxjs/operators";
import {
  dispatch,
  StateController,
  action$,
  Action,
} from "ajwah-reactive-form";
import { UserState } from "../models";
import { post } from "../api";
import { actionType as at } from "../models";

export class UserController extends StateController<UserState> {
  constructor() {
    super("user", {
      isLogedIn: false,
      billingDetails: { isBiAsDelivery: true, deliveryOption: "1" },
    });
  }
  onInit() {
    const token = localStorage.getItem("token");
    if (token) {
      const customer = localStorage.getItem("customer") || "{}";
      this.emit({ isLogedIn: true, customer: JSON.parse(customer) });
    }
  }
  login(state: any, action: Action) {
    post("customers/login", action.payload).subscribe(
      (res) => {
        this.setAuthData(res);
        dispatch(at.LoginDialogAction, false);
      },
      (res) => dispatch(at.InfoMessage, res.response.error.message)
    );
  }
  register(state: any, action: Action) {
    post<any>("customers", action.payload).subscribe(
      (res) => {
        this.setAuthData(res);
        dispatch(at.LoginDialogAction, false);
      },
      (res) => dispatch(at.InfoMessage, res.response.error.message)
    );
  }
  logout(state: any, action: Action) {
    this.emit({ isLogedIn: false });
    localStorage.removeItem("token");
    localStorage.removeItem("customer");
  }
  setAuthData(data: any) {
    const { customer, accessToken, expires_in } = data;
    this.emit({ isLogedIn: true, customer, error: "" } as UserState);
    localStorage.setItem("token", accessToken);
    localStorage.setItem("customer", JSON.stringify(customer));
  }

  changeAddress(state: UserState, action: Action) {
    this.emit({ billingDetails: action.payload } as UserState);
  }
  /* 

    effectForUpdateCustomer(action$, store$) {
        return action$.pipe(
            withLatestFrom(store$.select(state => [state.customer.accessToken, state.delivery])),
            mergeMap(([action, [token, delivery]]) => {
                const { address, city, state, zipCode } = delivery;
                const data = { address_1: address + ', ' + state, city, region: 'void 0', postal_code: zipCode.toString(), country: 'void 0', shipping_region_id: 2 }
                return Api.updateCustomerAddress(data, token).pipe(
                    tap(res => console.log(res)),
                    map(_ => EMPTY),
                    catchError(_ => EMPTY)
                )
            })
        )
    }*/
}
