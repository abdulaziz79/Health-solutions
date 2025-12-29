import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/db";
import { supabase } from "@/utils/supabase";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = Number(formData.get("role"));
    const dateOfBirth = formData.get("dateOfBirth") as string | null;
    const image = formData.get("image") as File | null;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstName,
          lastName,
          roleId: role,
          dateOfBirth,
        },
      },
    });

    if (authError || !authData.user) {
      console.error("Supabase signUp error:", authError);
      return NextResponse.json(
        { error: authError?.message || "Create user failed" },
        { status: 400 }
      );
    }

    console.log("Auth user created:", authData.user);

    const user = await db.user.create({
      data: {
        id: authData.user.id,
        firstName,
        lastName,
        email,
        password: "", // don't store plain passwords
        roleId: role,
        dateOfBirth,
        image: null, // image will be updated later
      },
    });

    console.log("User saved in DB:", user);

    let imageUrl: string | null = null;

    // 3️⃣ Upload image to Storage only if user creation succeeded
    if (image) {
      const fileExt = image.name.split(".").pop();
      const filePath = `users/${Date.now()}-${email}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, image, {
          contentType: image.type,
          upsert: true,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
      } else {
        const { data: publicUrl } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        imageUrl = publicUrl.publicUrl;
        console.log("Image uploaded to Supabase Storage. Public URL:", imageUrl);

        await db.user.update({
          where: { id: authData.user.id },
          data: { image: imageUrl },
        });
      }
    }

    return NextResponse.json({ ...user, image: imageUrl });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
