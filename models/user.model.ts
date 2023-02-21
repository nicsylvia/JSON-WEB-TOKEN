import { Document, model, Schema } from "mongoose";
import { ICartItem, IUser } from "../interfaces/User";
import isEmail from "validator/lib/isEmail";
import { authRole } from "../constants/user.constant";

interface UserSchema extends Document, IUser {
  clearCart(): Promise<void>;
  removeFromCart(productID: string): Promise<void>;
  addToCart(productID: string, Decrement: boolean): Promise<boolean>
}

const userSchema: Schema<UserSchema> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide your password"],
      minlength: 6,
    },
    confirmPassword: {
      type: String,
      required: [true, "Please provide your confirm password"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: [authRole.admin, authRole.manager, authRole.user],
      message: `Please identify your role as provided: 
      ${authRole.user}, 
      ${authRole.admin}, 
      ${authRole.manager}`,
      default: authRole.user,
      required: true,
    },
    cart: {
      items: [
        {
          productID: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "Please select a product"]
          },
          quantity: {
            type: Number,
            required: [true, "Please select a quantity"]
          }
        }
      ]
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Methods for add to cart, remove from cart and clear cart

userSchema.methods.addToCart = function(productID: string, Decrement: boolean){
  let cartItemIndex = -1
  let updateCartItem: ICartItem[] = [];

  if (this.cart.items) {
    // Getting the index position of each product to be added to cart
    cartItemIndex = this.cart.items.findIndex((el: {productID: {toString: ()=> string}}) =>{
      return el.productID.toString() === productID.toString()
    })
    // Pushing the products into the cart using the spread operator
    updateCartItem = [...this.cart.items]
  }

  // Checking for the quantity of products that was added to cart
  let newQuantity = 1

  if (cartItemIndex >= 0) {
    if (Decrement) {
      newQuantity = this.cart.items[cartItemIndex].quantity - 1
      if (newQuantity <= 0) {
        return this.removeFromCart(productID)
      }else{
        newQuantity = this.cart.items[cartItemIndex].quantity + 1
      }
      updateCartItem[cartItemIndex].quantity = newQuantity
    }
  }else{
    updateCartItem.push({
      productID: productID,
      quantity: newQuantity
    })
  }

  const updatedCart = {
    items: updateCartItem
  }
  this.cart.items = updatedCart
  return this.save({validateBeforeSave: false})
}

// Methods for remove from cart

userSchema.methods.removeFromCart = function(productID : string){
  const updateCart = this.cart.items.filter((item: {productID: {toString: ()=> string}}) =>{
    return item.productID.toString() !== productID.toString()
  })
  this.cart.items = updateCart
  return this.save({validateBeforeSave: false})
}

// Methods for clear cart

userSchema.methods.clearCart = function(){
  this.cart = {items: []}
  return this.save();
}

const UserModel = model<UserSchema>("User", userSchema);
export default UserModel;
