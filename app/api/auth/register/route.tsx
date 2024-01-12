import { NextRequest, NextResponse } from "next/server";
import vine, { errors } from "@vinejs/vine";
import bcrypt from "bcryptjs";
import { connect } from "mongoose";
import ErrorReporter from "@/Validater/ErrorReporter";
import { registerSchema } from "@/Validater/authValidationSchema";
import { UserModel } from "../models/user.model";
interface UserPayload {
  name: string;
  email: string;
  password: string;
  avtar?: string;
}
const MONGODB_URI= process.env.MONGODB_URI as string
connect(MONGODB_URI);
export async function POST(request: NextRequest) {
  try {
    const body: UserPayload = await request.json();
    vine.errorReporter = () => new ErrorReporter();
    const validator = vine.compile(registerSchema);
    const output = await validator.validate(body);
    try {
      const user = await UserModel.findOne({ email: output.email });
      if (user) {
        return NextResponse.json(
          {
            status: 400,
            errors: {
              email: "Email is already used.",
            },
          },
          { status: 200 }
        );
      } else {
        // * To Hash the password
        const salt = bcrypt.genSaltSync(10);
        output.password = bcrypt.hashSync(output.password, salt);
        await UserModel.create(output);
        return NextResponse.json(
          { status: 200, msg: "User Created successfully!" },
          { status: 200 }
        );
      }
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return NextResponse.json(
        { status: 400, errors: error.messages },
        { status: 200 }
      );
    }
  }
}