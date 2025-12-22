"use client";

import React, { useEffect, useState } from "react";
import { Download, Filter } from "lucide-react";
import CardNav from "../../components/cardnav";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";

/* ================= TYPES ================= */

interface Class {
  id: string;
  title: string;
}

interface Submission {
  id: string;
  student_id: string;
  assignment_title: string;
  class_id: string;
  class_title: string;
  submitted_at: string;
  file_url: string;
}

/* ================= COMPONENT ================= */

export default function Submissions() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filterClass, setFilterClass] = useState("all");

  /* ================= FETCH ================= */

  const fetchClasses = async () => {
    const { data, error } = await supabase
      .from("classes")
      .select("id, title")
      .order("title");

    if (error) {
      toast.error("Gagal mengambil kelas");
      return;
    }

    setClasses(data);
  };

  const fetchSubmissions = async () => {
    const { data, error } = await supabase
      .from("submissions")
      .select(
        `
        id,
        student_id,
        file_url,
        submitted_at,
        assignments (
          title,
          class_id,
          classes (
            title
          )
        )
      `
      )
      .order("submitted_at", { ascending: false });

    if (error) {
      toast.error("Gagal mengambil pengumpulan");
      return;
    }

    const formatted = data.map((s: any) => ({
      id: s.id,
      student_id: s.student_id,
      file_url: s.file_url,
      submitted_at: s.submitted_at,
      assignment_title: s.assignments?.title ?? "-",
      class_id: s.assignments?.class_id ?? "",
      class_title: s.assignments?.classes?.title ?? "-",
    }));

    setSubmissions(formatted);
  };

  useEffect(() => {
    fetchClasses();
    fetchSubmissions();
  }, []);

  /* ================= HANDLERS ================= */

  const handleDownload = async (fileUrl: string) => {
    const cleanPath = fileUrl.replace(/^submissions\//, "");

    const { data, error } = await supabase.storage
      .from("submissions")
      .createSignedUrl(cleanPath, 60);

    if (error) {
      console.error(error);
      return;
    }

    window.open(data.signedUrl, "_blank");
  };

  const filteredSubmissions = submissions.filter(
    (s) => filterClass === "all" || s.class_id === filterClass
  );

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50">
      <CardNav />

      <main className="pt-[120px] px-8">
        <div className="mb-4">
          <h1 className="text-gray-900 text-2xl font-bold">
            Pengumpulan Murid
          </h1>
          <p className="text-gray-600">Daftar tugas yang telah dikumpulkan</p>
        </div>
        {/* TABLE */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {["Student ID", "Tugas", "Kelas", "Waktu", "File"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-left text-xs text-gray-600"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredSubmissions.map((s) => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {s.student_id}
                  </td>

                  <td className="px-6 py-4 text-sm">{s.assignment_title}</td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {s.class_title}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(s.submitted_at)}
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDownload(s.file_url)}
                      className="flex items-center gap-2 text-blue-600 text-sm hover:underline"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredSubmissions.length === 0 && (
            <div className="py-10 text-center text-gray-500">
              Tidak ada pengumpulan
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
