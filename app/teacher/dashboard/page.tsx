import CardNav from '@/app/components/cardnav';
import { FileText, CheckSquare } from 'lucide-react';
import { createClient } from '@/lib/supabaseClient';

export default async function TeacherDashboard() {
  const supabase = await createClient();

  /* ======================
      STATS
  ====================== */

  const [{ count: classCount }, { count: submissionCount }] =
    await Promise.all([
      supabase
        .from('classes')
        .select('*', { count: 'exact', head: true }),

      supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true }),
    ]);

  /* ======================
      KELAS TERBARU
  ====================== */

  const { data: classes } = await supabase
    .from('classes')
    .select('id, title, description, created_at')
    .order('created_at', { ascending: false })
    .limit(3);


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <CardNav />

        <main className="flex-1 mt-17 p-8">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-gray-900 text-2xl font-bold">
              Selamat Datang!
            </h1>
            <p className="text-gray-600">
              Ringkasan aktivitas pengajaran Anda
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <StatCard
              label="Total Kelas"
              value={classCount ?? 0}
              icon={<FileText className="w-6 h-6 text-purple-600" />}
              bg="bg-purple-50"
            />
            <StatCard
              label="Total Pengumpulan"
              value={submissionCount ?? 0}
              icon={<CheckSquare className="w-6 h-6 text-yellow-600" />}
              bg="bg-yellow-50"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            {/* Classes */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-gray-900 mb-6">Kelas Terbaru</h2>

              <div className="space-y-4">
                {classes?.map((cls) => (
                  <div
                    key={cls.id}
                    className="p-4 bg-gray-50 rounded-lg"
                  >
                    <p className="text-gray-900 font-medium">
                      {cls.title}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      {cls.description || 'Tanpa deskripsi'}
                    </p>
                    <p className="text-gray-500 text-xs mt-2">
                      Dibuat:{' '}
                      {new Date(cls.created_at).toLocaleDateString(
                        'id-ID'
                      )}
                    </p>
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

/* ======================
    COMPONENT KECIL
====================== */

function StatCard({
  label,
  value,
  icon,
  bg,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  bg: string;
}) {
  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 ${bg} rounded-lg flex items-center justify-center`}
        >
          {icon}
        </div>
      </div>
      <p className="text-gray-600 text-sm">{label}</p>
      <p className="text-gray-900 text-xl font-semibold">{value}</p>
    </div>
  );
}
