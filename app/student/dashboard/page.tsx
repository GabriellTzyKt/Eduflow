import { createClient } from "@/lib/supabaseClient";
import { redirect } from "next/navigation";
import { BookOpen, FileText, Clock, CheckCircle, XCircle, ArrowRight, ChevronDown } from "lucide-react";
import SubmitAssignment from "../../components/studentAsignment"; 
import LogoutButton from "../../components/logout";
// IMPORT KOMPONEN BACKGROUND BARU
import FloatingBackground from "../../components/FloatingBackground"; 

export const dynamic = "force-dynamic";

export default async function StudentDashboard() {
  const supabase = await createClient();
  
  // 1. Cek User & Profil
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // 2. Ambil Data Kelas
  const { data: classes } = await supabase
    .from("classes")
    .select(`*, materials(*), assignments(*)`)
    .order("created_at", { ascending: false });

  // 3. Ambil Submission
  const { data: mySubmissions } = await supabase
    .from("submissions")
    .select("*")
    .eq("student_id", user.id);

  return (
    // Ubah bg-gray-50 menjadi bg-transparent atau relative agar canvas terlihat
    <div className="min-h-screen relative p-6 md:p-10 font-sans text-gray-800">
      
      {/* --- BACKGROUND ANIMASI DI SINI --- */}
      <FloatingBackground />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* HEADER */}
        {/* Tambahkan backdrop-blur agar teks tetap terbaca jelas jika ada garis lewat di belakangnya */}
        <header className="mb-10 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Halo, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{profile?.full_name || user.email}</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Selamat datang kembali!</p>
          </div>
          <LogoutButton />
        </header>

        {/* LIST KELAS */}
        {!classes || classes.length === 0 ? (
          <div className="text-center text-gray-500 mt-10 bg-white/80 p-10 rounded-xl border border-dashed backdrop-blur-sm">
            Belum ada kelas yang tersedia.
          </div>
        ) : (
          <div className="space-y-6"> 
            {classes.map((kelasItem: any, index: number) => (
              
              <details 
                key={kelasItem.id} 
                open={index === 0} 
                className="group bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md"
              >
                
                {/* 1. BAGIAN HEADER */}
                <summary className="list-none cursor-pointer bg-indigo-600 text-white p-6 flex items-center justify-between focus:outline-none hover:bg-indigo-700 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-lg">
                       <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{kelasItem.title}</h2>
                      <p className="text-indigo-100 text-sm mt-1 line-clamp-1">{kelasItem.description}</p>
                    </div>
                  </div>

                  <div className="bg-white/10 p-2 rounded-full transition-transform duration-300 group-open:rotate-180">
                      <ChevronDown className="w-6 h-6" />
                  </div>
                </summary>

                {/* 2. BAGIAN ISI */}
                <div className="p-6 md:p-8 bg-gray-50/50 border-t border-gray-100">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Materi */}
                    <div className="lg:col-span-2 space-y-6">
                      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        Materi Pembelajaran
                      </h3>
                      
                      {!kelasItem.materials || kelasItem.materials.length === 0 ? (
                        <p className="text-gray-500 italic text-sm">Belum ada materi.</p>
                      ) : (
                        <div className="space-y-4">
                          {kelasItem.materials.map((materi: any) => (
                            <div key={materi.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                              <h4 className="font-semibold text-gray-900">{materi.title}</h4>
                              <p className="text-gray-600 text-sm mt-2 whitespace-pre-wrap">
                                {materi.content}
                              </p>
                              {materi.file_url && (
                                <a href={materi.file_url} target="_blank" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg hover:bg-indigo-100">
                                  Lihat Modul <ArrowRight className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Tugas */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                        <Clock className="w-5 h-5 text-red-500" />
                        Tugas & Deadline
                      </h3>

                      {!kelasItem.assignments || kelasItem.assignments.length === 0 ? (
                        <div className="text-center p-4 border border-dashed rounded-lg">
                          <p className="text-gray-400 text-sm">Tidak ada tugas.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {kelasItem.assignments.map((tugas: any) => (
                            <div key={tugas.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                              {/* Logika Submission disederhanakan untuk contoh visual */}
                              <h4 className="font-bold text-gray-800 pr-16 text-sm">{tugas.title}</h4>
                              <p className="text-xs text-gray-500 mt-1 mb-3">
                                Deadline: {new Date(tugas.due_date).toLocaleDateString("id-ID")}
                              </p>
                              
                              <div className="border-t pt-3">
                                <SubmitAssignment 
                                  assignmentId={tugas.id}
                                  studentId={user.id}
                                  existingSubmission={mySubmissions?.find((s: any) => s.assignment_id === tugas.id)}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}