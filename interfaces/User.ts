import { Document, Schema } from "mongoose";
import { Request } from "express";

export interface ICartItem{
  productID: string;
  quantity: number;
}

export interface IUser extends Document {
  productID: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  cart?: {
    items: {
      productId: Schema.Types.ObjectId;
      quantity: number;
    };
  }[];
}

export interface IAuthUser extends Request {
  user: IUser;
}
