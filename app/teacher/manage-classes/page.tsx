'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import CardNav from '@/app/components/cardnav';
import Modal from '@/app/components/modal';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';

interface Class {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

export default function ManageClasses() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const fetchClasses = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Gagal mengambil data kelas');
      console.error(error);
    } else {
      setClasses(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleAdd = () => {
    setEditingClass(null);
    setFormData({ title: '', description: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (classItem: Class) => {
    setEditingClass(classItem);
    setFormData({
      title: classItem.title,
      description: classItem.description,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus kelas "${title}"?`)) return;

    const { error } = await supabase.from('classes').delete().eq('id', id);

    if (error) {
      toast.error('Gagal menghapus kelas');
      console.error(error);
    } else {
      toast.success('Kelas berhasil dihapus');
      fetchClasses();
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Mohon isi semua field');
      return;
    }

    if (editingClass) {
      /* UPDATE */
      const { error } = await supabase
        .from('classes')
        .update({
          title: formData.title,
          description: formData.description,
        })
        .eq('id', editingClass.id);

      if (error) {
        toast.error('Gagal memperbarui kelas');
        console.error(error);
        return;
      }

      toast.success('Kelas berhasil diperbarui');
    } else {
      const { error } = await supabase.from('classes').insert({
        title: formData.title,
        description: formData.description,
      });

      if (error) {
        toast.error('Gagal menambahkan kelas');
        console.error(error);
        return;
      }

      toast.success('Kelas berhasil ditambahkan');
    }

    setIsModalOpen(false);
    setFormData({ title: '', description: '' });
    setEditingClass(null);
    fetchClasses();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CardNav />
      <div className="flex">
        <main className="flex-1 p-8 mt-17">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-gray-900 text-2xl font-bold">Manajemen Kelas</h1>
              <p className="text-gray-600">
                Kelola kelas yang Anda ajarkan
              </p>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Tambah Kelas</span>
            </button>
          </div>

          {loading ? (
            <p className="text-gray-500">Memuat data kelas...</p>
          ) : classes.length === 0 ? (
            <p className="text-gray-500">Belum ada kelas.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((classItem) => (
                <div
                  key={classItem.id}
                  className="bg-white rounded-xl border border-gray-200 p-6"
                >
                  <h3 className="text-gray-900 mb-2">{classItem.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {classItem.description}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(classItem)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(classItem.id, classItem.title)
                      }
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* MODAL */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setFormData({ title: '', description: '' });
              setEditingClass(null);
            }}
            title={editingClass ? 'Edit Kelas' : 'Tambah Kelas Baru'}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Nama Kelas
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  {editingClass ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </div>
          </Modal>
        </main>
      </div>
    </div>
  );
}
