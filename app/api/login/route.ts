"use server";
import { createClient } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const { email, password } = await req.json();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (!error) {
        revalidatePath("/");
        return NextResponse.json({ success: true });
    }

    return NextResponse.json(
        { message: error.message },
        {
            status: 401,
        }
    );
}