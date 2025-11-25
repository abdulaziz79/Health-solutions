import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/db";
import { supabase } from "@/utils/supabase";

export async function POST(req: NextRequest) {
  try {
    const credentials = await req.json();

    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          firstName: credentials.firstName,
          lastName: credentials.lastName,
          roleId: credentials.role,
          dateOfBirth: credentials.dateOfBirth,
        },
      },
    });

    if (data.user) {
      const user = await db.user.create({
        data: {
          id: data.user?.id,
          firstName: credentials.firstName,
          lastName: credentials.lastName,
          email: credentials.email,
          password: "",
          roleId: credentials.role,
          dateOfBirth: credentials.dateOfBirth,
        },
      });
      return NextResponse.json(user);
    } else {
      return NextResponse.json(
        { error: "Create user failed" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
