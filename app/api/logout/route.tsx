import { createClient } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const supabase = await createClient();

    // 1. Cek sesi (opsional, untuk memastikan ada yang dilogout)
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        // Jika tidak ada sesi, kita tetap kembalikan sukses agar
        // client side bisa lanjut redirect ke halaman login
        return NextResponse.json({ success: true });
    }

    // 2. Proses Logout Supabase
    const { error } = await supabase.auth.signOut();

    if (error) {
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }

    // 3. Revalidate Path
    // 'layout' penting agar Navbar dan semua halaman yang mengecek user
    // menyadari bahwa user sudah logout (cache dibersihkan).
    revalidatePath("/", "layout");

    // 4. Redirect URL
    // Kita bisa mengirim URL tujuan agar frontend yang melakukan redirect,
    // atau biarkan frontend mengatur logic redirect-nya sendiri.
    return NextResponse.json({ success: true });
}