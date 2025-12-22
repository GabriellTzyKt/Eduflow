"use client";

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Calendar } from 'lucide-react';
import CardNav from '../../components/cardnav';
import Modal from '@/app/components/modal';
import { toast } from 'sonner';

interface Assignment {
  id: string;
  title: string;
  description: string;
  deadline: string;
  className: string;
  submissions: number;
}

export default function ManageAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Final Project - Web Application',
      description: 'Buat aplikasi web sederhana menggunakan HTML, CSS, dan JavaScript',
      deadline: '2025-12-25',
      className: 'Pemrograman Web Dasar',
      submissions: 23,
    },
    {
      id: '2',
      title: 'Database Design Assignment',
      description: 'Rancang skema database untuk sistem perpustakaan',
      deadline: '2025-12-20',
      className: 'Database Management',
      submissions: 31,
    },
    {
      id: '3',
      title: 'UI Design Portfolio',
      description: 'Buat portfolio desain UI dengan minimal 3 project',
      deadline: '2025-12-30',
      className: 'UI/UX Design Fundamental',
      submissions: 18,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    className: '',
  });

  const classes = [
    'Pemrograman Web Dasar',
    'Database Management',
    'UI/UX Design Fundamental',
  ];

  const handleAdd = () => {
    setEditingAssignment(null);
    setFormData({
      title: '',
      description: '',
      deadline: '',
      className: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      deadline: assignment.deadline,
      className: assignment.className,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus tugas "${title}"?`)) {
      setAssignments(assignments.filter((a) => a.id !== id));
      toast.success('Tugas berhasil dihapus');
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.deadline || !formData.className) {
      toast.error('Mohon isi semua field');
      return;
    }

    if (editingAssignment) {
      setAssignments(
        assignments.map((a) =>
          a.id === editingAssignment.id
            ? {
                ...a,
                title: formData.title,
                description: formData.description,
                deadline: formData.deadline,
                className: formData.className,
              }
            : a
        )
      );
      toast.success('Tugas berhasil diperbarui');
    } else {
      const newAssignment: Assignment = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        deadline: formData.deadline,
        className: formData.className,
        submissions: 0,
      };
      setAssignments([...assignments, newAssignment]);
      toast.success('Tugas berhasil ditambahkan');
    }

    setIsModalOpen(false);
    setFormData({
      title: '',
      description: '',
      deadline: '',
      className: '',
    });
    setEditingAssignment(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CardNav />
      <div className="flex">
        <main className="flex-1 p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-gray-900 mb-2">Manajemen Tugas</h1>
              <p className="text-gray-600">
                Kelola tugas untuk kelas Anda
              </p>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Tambah Tugas</span>
            </button>
          </div>

          {/* Assignments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <div className="mb-4">
                  <h3 className="text-gray-900 mb-2">{assignment.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {assignment.description}
                  </p>
                  <p className="text-gray-500 text-sm mb-2">
                    Kelas: {assignment.className}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>Deadline: {formatDate(assignment.deadline)}</span>
                  </div>
                  <p className="text-sm text-blue-600">
                    {assignment.submissions} pengumpulan
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(assignment)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(assignment.id, assignment.title)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add/Edit Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setFormData({
                title: '',
                description: '',
                deadline: '',
                className: '',
              });
              setEditingAssignment(null);
            }}
            title={editingAssignment ? 'Edit Tugas' : 'Tambah Tugas Baru'}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Judul Tugas
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Contoh: Final Project - Web Application"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Instruksi
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Jelaskan instruksi tugas..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Deadline
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) =>
                    setFormData({ ...formData, deadline: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                />
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
                      deadline: '',
                      className: '',
                    });
                    setEditingAssignment(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingAssignment ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </div>
          </Modal>
        </main>
      </div>
    </div>
  );
}
