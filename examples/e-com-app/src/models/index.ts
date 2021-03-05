import { ProductController } from "../controllers";

export type Product = {
  description: string;
  discounted_price: string;
  name: string;
  price: string;
  product_id: number;
  thumbnail: string;
};

export type ProductDetail = Product & {
  image_2: string;
  image: string;
};

export interface ProductList {
  count: number;
  rows: Array<Product>;
}
export interface Category {
  category_id: number;
  department_id: number;
  description: string;
  name: string;
}
export interface Department {
  department_id: number;
  description: string;
  name: string;
}
export interface DepartmentState {
  deparments: Department[];
  selectedDepartment?: Department;
}
export interface CategoryState {
  categories: Array<Category>;
  depertmentId?: number;
  selectedCategory?: Category;
}
export interface CartState {
  cartId: string;

  items: CartItem[];
}
export interface ProductState {
  loading: boolean;
  pageSize: number;
  pageNo: number;
  total: number;
  rows: Array<Product>;
}

export const actionType = {
  SelectDepartment: "selectDepartment",
  SelectCategory: "selectCategory",
  LoadProduct: "loadProduct",
  SetProducts: "setProducts",
  PageChange: "pageChange",
  ProductSearching: "ProductSearching",
  ProductDetails: "ProductDetails",
  ProductDialogAction: "productDialogAction",
  LoginDialogAction: "LoginDialogAction",
  InfoMessage: "InfoMessage",
  ErrorMessage: "ErrorMessage",
  SuccessMessage: "SuccessMessage",
  RequestForCheckDelivery: "RequestForCheckDelivery",
  DeliveryFormStatus: "DeliveryFormStatus",
  GetSelectedCategory: "GetSelectedCategory",
  GetSelectedDepartment: "GetSelectedDepartment",
  ChangeAddress: "changeAddress",
  AddToCart: "addToCart",
  UpdateCartItem: "updateCartItem",
  RemoveCartItem: "removeCartItem",
  Login: "login",
  Register: "register",
  Logout: "logout",
};

export interface CartItem {
  attributes: string;
  image: string;
  item_id: number;
  name: string;
  price: string;
  product_id: number;
  quantity: number;
  subtotal: string;
}
export interface Address {
  firstName?: string;
  lastName?: string;
  city?: string;
  address?: string;
  state?: string;
  zipCode?: string;
}
export interface UserState {
  isLogedIn: boolean;
  customer?: User;
  error?: string;
  billingDetails?: {
    isBiAsDelivery?: boolean;
    deliveryOption: string;
    billingAddress?: Address;
    deliveryAddress?: Address;
  };
}
export interface User {
  customer_id: number;
  name: string;
  email: string;
  address_1?: string;
  address_2?: string;
  city?: string;
  region?: string;
  postal_code: string;
  shipping_region_id: number;
  credit_card?: string;
  day_phone?: string;
  eve_phone?: string;
  mob_phone?: string;
}
