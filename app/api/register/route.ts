"use server";
import { createClient } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { email, password } = await req.json();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    console.log("samlekom");
    if (!error) {
      revalidatePath("/login");
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { message: errorMessage },
      {
        status: 400,
      }
    );
  }
}
