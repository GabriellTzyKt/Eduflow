import { createClient } from "@/lib/supabaseClient"; // Import dari lib server yang Anda punya
import { redirect } from "next/navigation";
import { BookOpen, FileText, Clock, CheckCircle, XCircle, Download, ArrowBigRight, ArrowRight } from "lucide-react";
// Kita asumsikan Anda sudah punya komponen Upload (Client Component) dari percakapan sebelumnya
// Jika belum, Anda bisa menghapus baris import ini sementara
import SubmitAssignment from "../../components/studentAsignment"; 
import LogoutButton from "../../components/logout";

// Opsi ini memaksa halaman selalu mengambil data terbaru (tidak di-cache statis)
export const dynamic = "force-dynamic";

export default async function StudentDashboard() {

  
  // 1. Inisialisasi Supabase Server Client
  const supabase = await createClient();
  

  // 2. Cek User Session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // 3. Ambil Data Profil (Untuk menampilkan Nama)
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // 4. Ambil Kelas (Kita ambil kelas pertama saja sebagai contoh single-class)
  const { data: classes } = await supabase
    .from("classes")
    .select("*")
    .limit(1)
    .single();

  // Variabel penampung materi & tugas
  let materials = [];
  let assignments = [];
  let mySubmissions = [];

  // Jika kelas ditemukan, ambil materi dan tugasnya
  if (classes) {
    // A. Ambil Materi
    const materialsRes = await supabase
      .from("materials")
      .select("*")
      .eq("class_id", classes.id)
      .order("created_at", { ascending: false });
    materials = materialsRes.data || [];

    // B. Ambil Tugas
    const assignmentsRes = await supabase
      .from("assignments")
      .select("*")
      .eq("class_id", classes.id)
      .order("due_date", { ascending: true });
    assignments = assignmentsRes.data || [];

    // C. Ambil Submission (Tugas yang sudah dikumpul murid ini)
    const submissionsRes = await supabase
      .from("submissions")
      .select("*")
      .eq("student_id", user.id);
    mySubmissions = submissionsRes.data || [];
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER DASHBOARD */}
<header className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-md">
  
  {/* Bagian Kiri: Teks */}
  <div>
    <div className="flex items-center gap-2 mb-1">
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
        Halo, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{profile?.full_name || user.email}</span>
      </h1>
      <span className="text-2xl animate-bounce">👋</span>
    </div>
    <p className="text-gray-500 text-sm font-medium flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
      Selamat datang kembali, siap untuk belajar hari ini?
    </p>
  </div>

  {/* Bagian Kanan: Tanggal & Logout */}
  <div className="flex items-center gap-4">
    {/* Opsional: Menampilkan Tanggal */}
    <div className="hidden md:block text-right mr-2">
      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Hari Ini</p>
      <p className="text-sm font-semibold text-gray-700">
        {new Date().toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
    </div>
    
    {/* Tombol Logout */}
    <div className="shrink-0">
      <LogoutButton />
    </div>
  </div>

</header>

        {/* INFO KELAS UTAMA */}
        {!classes ? (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <p className="text-gray-500">Belum ada kelas yang tersedia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* KOLOM KIRI (2/3): DETAIL KELAS & MATERI */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Kartu Judul Kelas */}
              <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{classes.title}</h2>
                    <p className="text-indigo-100 mt-2 text-sm leading-relaxed">
                      {classes.description}
                    </p>
                  </div>
                  <BookOpen className="w-10 h-10 text-indigo-200 opacity-50" />
                </div>
              </div>

              {/* List Materi */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  Materi Pembelajaran
                </h3>
                
                {materials.length === 0 ? (
                  <p className="text-gray-500 italic">Belum ada materi diunggah.</p>
                ) : (
                  <div className="space-y-4">
                    {materials.map((materi: any) => (
                      <div key={materi.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="font-semibold text-lg text-gray-900">{materi.title}</h4>
                        <p className="text-gray-600 text-sm mt-2 whitespace-pre-wrap">
                          {materi.content}
                        </p>
                        {materi.file_url && (
                          <a 
                            href={materi.file_url} 
                            target="_blank"
                            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
                          >
                            Lihat Modul <ArrowRight className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* KOLOM KANAN (1/3): TUGAS */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-500" />
                Tugas & Deadline
              </h3>

              {assignments.length === 0 ? (
                <div className="bg-white p-6 rounded-xl border border-dashed border-gray-300 text-center">
                  <p className="text-gray-400">Tidak ada tugas aktif.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignments.map((tugas: any) => {
                    // Cek status pengumpulan
                    const isSubmitted = mySubmissions.some((sub: any) => sub.assignment_id === tugas.id);
                    const submissionData = mySubmissions.find((sub: any) => sub.assignment_id === tugas.id);

                    return (
                      <div key={tugas.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                        {/* Status Badge */}
                        <div className="absolute top-0 right-0 p-3">
                          {isSubmitted ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-1 rounded-full">
                              <CheckCircle className="w-3 h-3" /> Selesai
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-1 rounded-full">
                              <XCircle className="w-3 h-3" /> Belum
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-gray-800 pr-16">{tugas.title}</h4>
                        <p className="text-xs text-gray-500 mt-1 mb-3">
                          Deadline: {new Date(tugas.due_date).toLocaleDateString("id-ID", {
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                          })}
                        </p>
                        <p className="text-sm text-gray-600 mb-4 bg-gray-50 p-2 rounded">
                          {tugas.description}
                        </p>
                        
                        {/* Area Upload (Hanya ini yang Client Component) */}
                        <div className="border-t pt-3">
                            {/* Panggil Client Component yang sudah Anda buat sebelumnya */}
                            {/* Pastikan path import SubmitAssignment sesuai */}
                            <SubmitAssignment 
                                assignmentId={tugas.id}
                                studentId={user.id}
                                existingSubmission={submissionData}
                            />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}