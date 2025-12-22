'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import CardNav from '../../components/cardnav';
import MaterialCard from '../../components/material_card';
import Modal from '../../components/modal';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';

interface Class {
  id: string;
  title: string;
}

interface Material {
  id: string;
  title: string;
  description: string;
  file_url: string | null;
  created_at: string;
  class: Class;
}

export default function ManageMaterials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    class_id: '',
  });

  /* ================= FETCH DATA ================= */

  const fetchClasses = async () => {
    const { data, error } = await supabase
      .from('classes')
      .select('id, title');

    if (error) {
      toast.error('Gagal mengambil data kelas');
      return;
    }

    setClasses(data);
  };

  const fetchMaterials = async () => {
    const { data, error } = await supabase
      .from('materials')
      .select(`
        id,
        title,
        content,
        file_url,
        created_at,
        class:classes (
          id,
          title
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Gagal mengambil data materi');
      return;
    }

    setMaterials(
      data.map((m: any) => ({
        ...m,
        description: m.content,
      }))
    );
  };

  useEffect(() => {
    fetchClasses();
    fetchMaterials();
  }, []);

  /* ================= CRUD ================= */

  const handleAdd = () => {
    setEditingMaterial(null);
    setFormData({ title: '', description: '', class_id: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setFormData({
      title: material.title,
      description: material.description,
      class_id: material.class.id,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus materi ini?')) return;

    const { error } = await supabase
      .from('materials')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Gagal menghapus materi');
      return;
    }

    toast.success('Materi berhasil dihapus');
    fetchMaterials();
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.class_id) {
      toast.error('Mohon isi semua field');
      return;
    }

    if (editingMaterial) {
      const { error } = await supabase
        .from('materials')
        .update({
          title: formData.title,
          content: formData.description,
          class_id: formData.class_id,
        })
        .eq('id', editingMaterial.id);

      if (error) {
        toast.error('Gagal memperbarui materi');
        return;
      }

      toast.success('Materi berhasil diperbarui');
    } else {
      const { error } = await supabase.from('materials').insert({
        title: formData.title,
        content: formData.description,
        class_id: formData.class_id,
      });

      if (error) {
        toast.error('Gagal menambahkan materi');
        return;
      }

      toast.success('Materi berhasil ditambahkan');
    }

    setIsModalOpen(false);
    setEditingMaterial(null);
    setFormData({ title: '', description: '', class_id: '' });
    fetchMaterials();
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50">
      <CardNav />
      <main className="pt-[120px] px-8">
        <div className="mb-4 flex justify-between">
          <div>
            <h1 className="text-gray-900 text-2xl font-bold">Manajemen Materi</h1>
            <p className="text-gray-600">Kelola materi pembelajaran</p>
          </div>

          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Upload Materi
          </button>
        </div>

        <div className="space-y-4">
          {materials.map((material) => (
            <div key={material.id} className="relative group">
              <MaterialCard
                title={material.title}
                description={material.description}
                uploadedBy="Teacher"
                uploadedAt={new Date(material.created_at).toLocaleDateString()}
                className={material.class.title}
              />

              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => handleEdit(material)}
                  className="p-2 bg-blue-600 text-white rounded-lg"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(material.id)}
                  className="p-2 bg-red-600 text-white rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingMaterial ? 'Edit Materi' : 'Upload Materi'}
        >
          <div className="space-y-4">
            <input
              placeholder="Judul"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
            />

            <textarea
              placeholder="Deskripsi"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
            />

            <select
              value={formData.class_id}
              onChange={(e) =>
                setFormData({ ...formData, class_id: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
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
