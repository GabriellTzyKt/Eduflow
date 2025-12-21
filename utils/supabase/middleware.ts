import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh token session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // --- LOGIKA PROTEKSI HALAMAN ---

  const path = request.nextUrl.pathname;

  // 1. Tentukan halaman mana saja yang BOLEH diakses TANPA LOGIN
  //    - path === '/' artinya Landing Page
  //    - startsWith('/login') artinya halaman login
  //    - startsWith('/register') artinya halaman daftar
  //    - (Opsional) Tambahkan '/about' atau '/contact' jika ada
  const isPublicPath = path === '/' || 
                       path.startsWith('/login') || 
                       path.startsWith('/register')|| 
                       path.startsWith('/api');

  // 2. Cek: Jika User BELUM Login DAN mencoba akses halaman RAHASIA (bukan public)
  if (!user && !isPublicPath) {
    // Tendang ke halaman login
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}