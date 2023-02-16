import { Document, model, Schema } from "mongoose";
import { IUser } from "../interfaces/User";
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

userSchema.methods.addToCart = function(){}

userSchema.methods.removeFromCart = function(productID){}

userSchema.methods.clearCart = function(){
  this.cart = {items: []}
}

const UserModel = model<UserSchema>("User", userSchema);
export default UserModel;
