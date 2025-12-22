'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import CardNav from '../../components/cardnav';
import MaterialCard from '../../components/material_card';
import Modal from '../../components/modal';
import { toast } from 'sonner';

interface Material {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'document';
  uploadedBy: string;
  uploadedAt: string;
  className: string;
}

export default function ManageMaterials() {
  const [materials, setMaterials] = useState<Material[]>([
    {
      id: '1',
      title: 'Introduction to HTML & CSS',
      description:
        'Panduan lengkap memulai web development dengan HTML dan CSS',
      type: 'pdf',
      uploadedBy: 'Dr. Ahmad Sutanto',
      uploadedAt: '2 hari yang lalu',
      className: 'Pemrograman Web Dasar',
    },
    {
      id: '2',
      title: 'JavaScript Fundamentals',
      description:
        'Video tutorial dasar-dasar JavaScript untuk pemula',
      type: 'video',
      uploadedBy: 'Dr. Ahmad Sutanto',
      uploadedAt: '5 hari yang lalu',
      className: 'Pemrograman Web Dasar',
    },
    {
      id: '3',
      title: 'SQL Query Basics',
      description: 'Dokumen referensi untuk query SQL dasar',
      type: 'pdf',
      uploadedBy: 'Dr. Ahmad Sutanto',
      uploadedAt: '1 minggu yang lalu',
      className: 'Database Management',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] =
    useState<Material | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'pdf' as 'pdf' | 'video' | 'document',
    className: '',
  });

  const classes = [
    'Pemrograman Web Dasar',
    'Database Management',
    'UI/UX Design Fundamental',
  ];

  const handleAdd = () => {
    setEditingMaterial(null);
    setFormData({
      title: '',
      description: '',
      type: 'pdf',
      className: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setFormData({
      title: material.title,
      description: material.description,
      type: material.type,
      className: material.className,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus materi "${title}"?`)) {
      setMaterials(materials.filter((m) => m.id !== id));
      toast.success('Materi berhasil dihapus');
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.className) {
      toast.error('Mohon isi semua field');
      return;
    }

    if (editingMaterial) {
      setMaterials(
        materials.map((m) =>
          m.id === editingMaterial.id
            ? { ...m, ...formData }
            : m
        )
      );
      toast.success('Materi berhasil diperbarui');
    } else {
      setMaterials([
        ...materials,
        {
          id: Date.now().toString(),
          ...formData,
          uploadedBy: 'Dr. Ahmad Sutanto',
          uploadedAt: 'Baru saja',
        },
      ]);
      toast.success('Materi berhasil ditambahkan');
    }

    setIsModalOpen(false);
    setEditingMaterial(null);
    setFormData({
      title: '',
      description: '',
      type: 'pdf',
      className: '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* ✅ TOP NAVBAR */}
      <CardNav />

      {/* ✅ MAIN CONTENT */}
      <main className="pt-[120px] px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 mb-2">Manajemen Materi</h1>
            <p className="text-gray-600">
              Kelola materi pembelajaran untuk kelas Anda
            </p>
          </div>

          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Upload Materi
          </button>
        </div>

        {/* Materials List */}
        <div className="space-y-4">
          {materials.map((material) => (
            <div key={material.id} className="relative group">
              <MaterialCard {...material} />

              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(material)}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    handleDelete(material.id, material.title)
                  }
                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        <Modal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setFormData({
                title: '',
                description: '',
                type: 'pdf',
                className: '',
              });
              setEditingMaterial(null);
            }}
            title={editingMaterial ? 'Edit Materi' : 'Upload Materi Baru'}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Judul Materi
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Contoh: Introduction to HTML & CSS"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
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
                  placeholder="Jelaskan tentang materi ini..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Tipe Materi
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as 'pdf' | 'video' | 'document',
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                >
                  <option value="pdf">PDF</option>
                  <option value="video">Video</option>
                  <option value="document">Dokumen</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Kelas
                </label>
                <select
                  value={formData.className}
                  onChange={(e) =>
                    setFormData({ ...formData, className: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                >
                  <option value="">Pilih kelas</option>
                  {classes.map((className) => (
                    <option key={className} value={className}>
                      {className}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setFormData({
                      title: '',
                      description: '',
                      type: 'pdf',
                      className: '',
                    });
                    setEditingMaterial(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingMaterial ? 'Simpan' : 'Upload'}
                </button>
              </div>
            </div>
          </Modal>
      </main>
    </div>
  );
}
