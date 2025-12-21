"use server";
import { createClient } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { email, password } = await req.json();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !user) {
    return NextResponse.json(
      { message: authError?.message || "Login gagal" },
      { status: 401 }
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError) {
    return NextResponse.json(
      { message: "Gagal mengambil data profil user." },
      { status: 500 }
    );
  }

  revalidatePath("/", "layout");

  return NextResponse.json({ 
    success: true, 
    role: profile?.role 
  });
}
