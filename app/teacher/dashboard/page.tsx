import { BookOpen, FileText, CheckSquare, Users } from 'lucide-react';
import CardNav from '@/app/components/cardnav';
import FloatingLines from '@/app/components/background/floatingLines';

export default function TeacherDashboard() {

  const stats = [
    {
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      label: 'Total Kelas',
      value: '8',
      bgColor: 'bg-blue-50',
    },
    {
      icon: <Users className="w-6 h-6 text-green-600" />,
      label: 'Total Siswa',
      value: '156',
      bgColor: 'bg-green-50',
    },
    {
      icon: <FileText className="w-6 h-6 text-purple-600" />,
      label: 'Materi Diunggah',
      value: '42',
      bgColor: 'bg-purple-50',
    },
    {
      icon: <CheckSquare className="w-6 h-6 text-yellow-600" />,
      label: 'Tugas Aktif',
      value: '15',
      bgColor: 'bg-yellow-50',
    },
  ];

  const recentClasses = [
    {
      name: 'Pemrograman Web Dasar',
      students: 45,
      assignments: 3,
      materials: 12,
    },
    {
      name: 'Database Management',
      students: 38,
      assignments: 2,
      materials: 10,
    },
    {
      name: 'UI/UX Design Fundamental',
      students: 52,
      assignments: 4,
      materials: 15,
    },
  ];

  const pendingSubmissions = [
    {
      student: 'Andi Wijaya',
      assignment: 'Final Project - Web Application',
      class: 'Pemrograman Web Dasar',
      submitted: '2 jam yang lalu',
    },
    {
      student: 'Siti Nurhaliza',
      assignment: 'Database Design Assignment',
      class: 'Database Management',
      submitted: '5 jam yang lalu',
    },
    {
      student: 'Budi Santoso',
      assignment: 'UI Design Portfolio',
      class: 'UI/UX Design Fundamental',
      submitted: '1 hari yang lalu',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <CardNav />
        <main className="flex-1 mt-17 p-8">
          {/* Greeting */}
          <div className="mb-4">
            <h1 className="text-gray-900 text-2xl font-bold">
              Selamat Datang!
            </h1>
            <p className="text-gray-600">
              Berikut ringkasan aktivitas pengajaran Anda.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    {stat.icon}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Classes */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-gray-900 mb-6">Kelas Terbaru</h2>
              <div className="space-y-4">
                {recentClasses.map((classItem, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg"
                  >
                    <p className="text-gray-900 mb-3">{classItem.name}</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Siswa</p>
                        <p className="text-gray-900">{classItem.students}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Materi</p>
                        <p className="text-gray-900">{classItem.materials}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Tugas</p>
                        <p className="text-gray-900">{classItem.assignments}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Submissions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-gray-900 mb-6">Pengumpulan Terbaru</h2>
              <div className="space-y-4">
                {pendingSubmissions.map((submission, index) => (
                  <div
                    key={index}
                    className="flex gap-4 pb-4 border-b border-gray-100 last:border-0"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-sm">
                        {submission.student.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 text-sm mb-1">
                        {submission.student}
                      </p>
                      <p className="text-gray-600 text-xs mb-1">
                        {submission.assignment}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {submission.class} • {submission.submitted}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
