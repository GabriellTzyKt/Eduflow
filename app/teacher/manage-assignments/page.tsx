'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Calendar } from 'lucide-react';
import CardNav from '../../components/cardnav';
import Modal from '@/app/components/modal';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';

/* ================= TYPES ================= */

interface Class {
  id: string;
  title: string;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  due_date: string;
  class_id: string;
  class_title: string;
  submissions: number;
}

/* ================= COMPONENT ================= */

export default function ManageAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    class_id: '',
  });

  /* ================= FETCH DATA ================= */

  const fetchClasses = async () => {
    const { data, error } = await supabase
      .from('classes')
      .select('id, title')
      .order('title');

    if (error) {
      toast.error('Gagal mengambil data kelas');
      return;
    }

    setClasses(data);
  };

  const fetchAssignments = async () => {
    const { data, error } = await supabase
      .from('assignments')
      .select(`
        id,
        title,
        description,
        due_date,
        class_id,
        classes ( title ),
        submissions ( id )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Gagal mengambil data tugas');
      return;
    }

    const formatted = data.map((a: any) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      due_date: a.due_date,
      class_id: a.class_id,
      class_title: a.classes?.title ?? '-',
      submissions: a.submissions?.length ?? 0,
    }));

    setAssignments(formatted);
  };

  useEffect(() => {
    fetchClasses();
    fetchAssignments();
  }, []);

  /* ================= CRUD ================= */

  const handleAdd = () => {
    setEditingAssignment(null);
    setFormData({
      title: '',
      description: '',
      due_date: '',
      class_id: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      due_date: assignment.due_date,
      class_id: assignment.class_id,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Yakin ingin menghapus tugas "${title}"?`)) return;

    const { error } = await supabase
      .from('assignments')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Gagal menghapus tugas');
      return;
    }

    toast.success('Tugas berhasil dihapus');
    fetchAssignments();
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.due_date || !formData.class_id) {
      toast.error('Mohon isi semua field');
      return;
    }

    if (editingAssignment) {
      const { error } = await supabase
        .from('assignments')
        .update({
          title: formData.title,
          description: formData.description,
          due_date: formData.due_date,
          class_id: formData.class_id,
        })
        .eq('id', editingAssignment.id);

      if (error) {
        toast.error('Gagal memperbarui tugas');
        return;
      }

      toast.success('Tugas berhasil diperbarui');
    } else {
      const { error } = await supabase
        .from('assignments')
        .insert({
          title: formData.title,
          description: formData.description,
          due_date: formData.due_date,
          class_id: formData.class_id,
        });

      if (error) {
        toast.error('Gagal menambahkan tugas');
        return;
      }

      toast.success('Tugas berhasil ditambahkan');
    }

    setIsModalOpen(false);
    setEditingAssignment(null);
    setFormData({
      title: '',
      description: '',
      due_date: '',
      class_id: '',
    });
    fetchAssignments();
  };

  /* ================= HELPERS ================= */

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50">
      <CardNav />
      <main className="p-8 mt-17">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manajemen Tugas</h1>
            <p className="text-gray-600">Kelola tugas pembelajaran</p>
          </div>

          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            <Plus className="w-5 h-5" />
            Tambah Tugas
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((a) => (
            <div key={a.id} className="bg-white border rounded-xl p-6">
              <h3 className="font-semibold">{a.title}</h3>
              <p className="text-sm text-gray-600">{a.description}</p>
              <p className="text-sm text-gray-500 mb-3">Kelas: {a.class_title}</p>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Calendar className="w-4 h-4" />
                {formatDate(a.due_date)}
              </div>

              <p className="text-sm text-blue-600 mb-4">
                {a.submissions} pengumpulan
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(a)}
                  className="flex-1 flex justify-center items-center gap-2 bg-blue-50 text-blue-600 py-2 rounded-lg"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(a.id, a.title)}
                  className="flex-1 flex justify-center items-center gap-2 bg-red-50 text-red-600 py-2 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingAssignment ? 'Edit Tugas' : 'Tambah Tugas'}
        >
          <div className="space-y-4">
            <input
              placeholder="Judul tugas"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border px-4 py-2 rounded-lg"
            />

            <textarea
              placeholder="Deskripsi"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border px-4 py-2 rounded-lg"
            />

            <input
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              className="w-full border px-4 py-2 rounded-lg"
            />

            <select
              value={formData.class_id}
              onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
              className="w-full border px-4 py-2 rounded-lg"
            >
              <option value="">Pilih kelas</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              Simpan
            </button>
          </div>
        </Modal>
      </main>
    </div>
  );
}
