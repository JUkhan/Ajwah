import { Action, StateController } from "ajwah-reactive-form";
import { CartItem, CartState } from "../models";
import { post, get, put, remove } from "../api";

const cart_id = "cart_id";

export class CartController extends StateController<CartState> {
  constructor() {
    super("cart", { cartId: "", items: [] });
  }

  onInit() {
    const cartId = localStorage.getItem(cart_id);
    if (cartId) {
      this.getCartItems(cartId).subscribe((items: any[]) => {
        this.emit({ items, cartId });
      });
    } else this.loadCartId();
  }

  onAction(state: CartState, action: Action) {}

  loadCartId() {
    get("shoppingcart/generateUniqueId").subscribe((res: any) => {
      this.emit({ cartId: res.cart_id });
      localStorage.setItem(cart_id, res.cart_id);
    });
  }

  addToCart(
    state: CartState,
    action: Action<{ productId: number; color: string; size: string }>
  ) {
    const { cartId } = state;

    post("shoppingcart/add", {
      cart_id: cartId,
      product_id: action.payload?.productId,
      attributes: `${action.payload?.color} ${action.payload?.size}`,
    }).subscribe((res) => this.emit({ items: res }));
  }
  updateCartItem(
    state: CartState,
    action: Action<{ item: CartItem; quantity: number }>
  ) {
    const { item, quantity } = action.payload ?? ({} as any);
    item.quantity += quantity;
    item.subtotal = Number(+item.price * item.quantity).toFixed(2);
    put(`shoppingcart/update/${item.item_id}`, item).subscribe((res) => {
      this.emit({ items: this.state.items.filter((it) => it.quantity > 0) });
    });
  }
  removeCartItem(state: CartState, action: Action) {
    remove(`shoppingcart/removeProduct/${action.payload}`).subscribe((res) => {
      this.emit({
        items: this.state.items.filter((it) => it.item_id !== action.payload),
      });
    });
  }

  getCartItems(cartId: string) {
    return get<any[]>(`shoppingcart/${cartId}`);
  }

  get cartItemCount$() {
    return this.select((state) => this.cartItemCount);
  }
  get cartItemCount() {
    const total = this.state.items.reduce((sum, it) => sum + it.quantity, 0);
    return total ? total.toString() : "";
  }
}
