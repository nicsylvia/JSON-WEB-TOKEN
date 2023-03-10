import { Request, Response, NextFunction } from "express";
import ProductModel from "../models/products.model";
import { IProducts } from "../interfaces/Products";
import { AppError, HttpCode } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthenticatedBody } from "../interfaces/custom.interface";
import { IUser } from "../interfaces/User";
import UserModel from "../models/user.model";

export const createProduct = asyncHandler(
  async (
    req: Request<{}, {}, IProducts>,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { name, productImage, price, category } = req.body;

    const product = await ProductModel.create({
      name,
      productImage,
      price,
      category,
    });
    if (!product)
      next(
        new AppError({
          httpCode: HttpCode.INTERNAL_SERVER_ERROR,
          message: "Product not created",
        })
      );
    return res.status(201).json({
      data: { product },
    });
  }
);

export const getAllProduct = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const product = await ProductModel.find();
    if (!product)
      next(
        new AppError({
          message: "Product not found",
          httpCode: HttpCode.NOT_FOUND,
        })
      );

    return res.status(HttpCode.OK).json({
      data: { product },
    });
  }
);

export const addToCart = asyncHandler(
  async(
    req: AuthenticatedBody<IUser>,
    res: Response,
    next: NextFunction
  ): Promise<Response> =>{

    const user = await UserModel.findOne({email: req!.user!.email});
    if (!user) {
      next(
        new AppError({
          message: "User not found",
          httpCode: HttpCode.NOT_FOUND
        })
      )
    };

    const Decrement = req.query.Decrement === "true";
    const updatedUser = await user!.addToCart(req.body.productID, Decrement);

    const FinalUpdate = {
      user: updatedUser
    }

    return res.status(200).json({
      data: FinalUpdate
    });

})