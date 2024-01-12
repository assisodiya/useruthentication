import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connect } from "@/app/db";
import { UserModel } from "../../models/user.model";

connect();
export async function POST(request: NextRequest) {
  const salt = bcrypt.genSaltSync(10);
  const password = bcrypt.hashSync("123456", salt);
  await UserModel.create({
    email: "admin@gmail.com",
    password: password,
    name: "Admin",
    role: "Admin",
  });

  return NextResponse.json({
    status: 200,
    message: "Admin created successfully",
  });
}