import express, { Application, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import { AppError, HttpCode } from "./utils/AppError";
import { errorHandler } from "./middlewares/error/errorHandler";
import userRouter from "./routes/user.route";
import productRouter from "./routes/product.route";

export const appConfig = (app: Application) => {
  app
    .use(morgan("dev"))
    .use(express.json())
    .use(cors())

    // routes
    .use("/api", userRouter)
    .use("/api/product", productRouter)

    // catch wrong routes
    .all("*", (req: Request, res: Response, next: NextFunction) => {
      next(
        new AppError({
          message: `This route ${req.originalUrl} does not exist`,
          httpCode: HttpCode.NOT_FOUND,
        })
      );
    })

    // error middleware
    .use(errorHandler);
};
