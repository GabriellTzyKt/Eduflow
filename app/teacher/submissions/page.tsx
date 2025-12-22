'use client';

import React, { useState } from 'react';
import { Download, Filter } from 'lucide-react';
import CardNav from '../../components/cardnav';
import { toast } from 'sonner';

interface Submission {
  id: string;
  studentName: string;
  studentEmail: string;
  assignmentTitle: string;
  className: string;
  submittedAt: string;
  fileName: string;
  status: 'pending' | 'graded';
  grade?: number;
}

export default function Submissions() {
  const [filterClass, setFilterClass] = useState('all');
  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: '1',
      studentName: 'Andi Wijaya',
      studentEmail: 'andi@example.com',
      assignmentTitle: 'Final Project - Web Application',
      className: 'Pemrograman Web Dasar',
      submittedAt: '2025-12-01 14:30',
      fileName: 'final-project-andi.zip',
      status: 'pending',
    },
    {
      id: '2',
      studentName: 'Siti Nurhaliza',
      studentEmail: 'siti@example.com',
      assignmentTitle: 'Database Design Assignment',
      className: 'Database Management',
      submittedAt: '2025-12-02 09:15',
      fileName: 'db-design-siti.pdf',
      status: 'graded',
      grade: 90,
    },
    {
      id: '3',
      studentName: 'Budi Santoso',
      studentEmail: 'budi@example.com',
      assignmentTitle: 'UI Design Portfolio',
      className: 'UI/UX Design Fundamental',
      submittedAt: '2025-12-02 16:45',
      fileName: 'portfolio-budi.pdf',
      status: 'pending',
    },
  ]);

  const classes = [
    'Pemrograman Web Dasar',
    'Database Management',
    'UI/UX Design Fundamental',
  ];

  const handleDownload = (fileName: string) => {
    toast.success(`Mengunduh ${fileName}...`);
  };

  const handleGrade = (id: string, studentName: string) => {
    const grade = prompt(`Masukkan nilai untuk ${studentName} (0-100):`);
    if (grade && !isNaN(Number(grade))) {
      setSubmissions(
        submissions.map((s) =>
          s.id === id
            ? { ...s, status: 'graded', grade: Number(grade) }
            : s
        )
      );
      toast.success('Nilai berhasil disimpan');
    }
  };

  const filteredSubmissions = submissions.filter(
    (s) => filterClass === 'all' || s.className === filterClass
  );

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* ✅ TOP NAVBAR */}
      <CardNav />

      {/* ✅ MAIN CONTENT */}
      <main className="pt-[120px] px-8">
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Pengumpulan Murid</h1>
          <p className="text-gray-600">
            Lihat dan nilai tugas yang dikumpulkan siswa
          </p>
        </div>

        {/* Filter */}
        <div className="mb-6 flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
          >
            <option value="all">Semua Kelas</option>
            {classes.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {[
                    'Siswa',
                    'Tugas',
                    'Kelas',
                    'Waktu',
                    'File',
                    'Status',
                    'Aksi',
                  ].map((h) => (
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
                  <tr
                    key={s.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">
                        {s.studentName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {s.studentEmail}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      {s.assignmentTitle}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {s.className}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {s.submittedAt}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDownload(s.fileName)}
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                      >
                        <Download className="w-4 h-4" />
                        {s.fileName}
                      </button>
                    </td>

                    <td className="px-6 py-4">
                      {s.status === 'graded' ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                          Dinilai ({s.grade})
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {s.status === 'pending' && (
                        <button
                          onClick={() =>
                            handleGrade(s.id, s.studentName)
                          }
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          Beri Nilai
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSubmissions.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              Tidak ada pengumpulan
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
