"use client";

import { createBrowserClient } from "@supabase/ssr"; 
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, Loader2, FileText, CheckCircle, AlertCircle } from "lucide-react";

interface Props {
  assignmentId: string;
  studentId: string;
  existingSubmission: any;
}

export default function SubmitAssignment({ assignmentId, studentId, existingSubmission }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setErrorMsg("");

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `submissions/${studentId}/${assignmentId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("school-files") 
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from("submissions")
        .insert({
          assignment_id: assignmentId,
          student_id: studentId,
          file_url: filePath,
        });

      if (dbError) throw dbError;

      setFile(null);
      alert("Tugas berhasil dikumpulkan!");
      router.refresh(); 

    } catch (error: any) {
      console.error("Upload failed:", error);
      setErrorMsg(error.message || "Gagal upload.");
    } finally {
      setUploading(false);
    }
  };

  
  if (existingSubmission) {
    return (
      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
        <CheckCircle className="text-green-600 w-5 h-5 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-green-800">Sudah Dikumpulkan</p>
          <p className="text-xs text-green-600 mt-1">
            {new Date(existingSubmission.submitted_at).toLocaleString("id-ID")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-white transition-colors">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Upload Jawaban
        </label>
        
        <input
          type="file"
          disabled={uploading}
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-xs file:font-semibold
            file:bg-indigo-100 file:text-indigo-700
            hover:file:bg-indigo-200 cursor-pointer"
        />

        {file && (
          <div className="mt-2 flex items-center gap-2 text-xs text-indigo-600 font-medium">
            <FileText className="w-3 h-3" /> {file.name}
          </div>
        )}

        {errorMsg && (
          <div className="mt-2 flex items-center gap-2 text-xs text-red-600">
            <AlertCircle className="w-3 h-3" /> {errorMsg}
          </div>
        )}
        
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="mt-4 w-full flex justify-center items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Mengirim...
            </>
          ) : (
            <>
              <UploadCloud className="w-4 h-4" /> Kirim Tugas
            </>
          )}
        </button>
      </div>
    </div>
  );
}