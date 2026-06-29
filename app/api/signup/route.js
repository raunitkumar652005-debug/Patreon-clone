import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDb from "@/db/connectDb";
import User from "@/models/User";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isCreatorEmail = (email) => {
  const creatorEmail = process.env.CREATOR_EMAIL?.toLowerCase().trim();
  return Boolean(creatorEmail && email === creatorEmail);
};

const makeUsername = async (email) => {
  const baseUsername = email.split("@")[0].replace(/[^a-zA-Z0-9_-]/g, "") || "user";
  let username = baseUsername;
  let counter = 1;

  while (await User.findOne({ username })) {
    username = `${baseUsername}${counter}`;
    counter += 1;
  }

  return username;
};

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    const normalizedEmail = email?.toLowerCase().trim();

    if (!normalizedEmail || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    await connectDb();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const username = await makeUsername(normalizedEmail);

    await User.create({
      email: normalizedEmail,
      password: hashedPassword,
      username,
      name: name?.trim() || "",
      isCreator: isCreatorEmail(normalizedEmail),
    });

    return NextResponse.json(
      { message: "Account created successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
