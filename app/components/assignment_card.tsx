import React from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle, Upload } from 'lucide-react';

interface AssignmentCardProps {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: 'pending' | 'submitted' | 'late';
  className: string;
  onSubmit?: () => void;
}

export default function AssignmentCard({
  id,
  title,
  description,
  deadline,
  status,
  className,
  onSubmit,
}: AssignmentCardProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'submitted':
        return {
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          badge: 'bg-green-100 text-green-700',
          text: 'Sudah Dikumpulkan',
        };
      case 'late':
        return {
          icon: <AlertCircle className="w-5 h-5 text-red-500" />,
          badge: 'bg-red-100 text-red-700',
          text: 'Terlambat',
        };
      default:
        return {
          icon: <Clock className="w-5 h-5 text-yellow-500" />,
          badge: 'bg-yellow-100 text-yellow-700',
          text: 'Belum Dikumpulkan',
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {statusConfig.icon}
            <h3 className="text-gray-900">{title}</h3>
          </div>
          <p className="text-gray-600 text-sm mb-3">{description}</p>
          <p className="text-gray-500 text-sm">Kelas: {className}</p>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs ${statusConfig.badge}`}>
          {statusConfig.text}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
        <Calendar className="w-4 h-4" />
        <span>Deadline: {deadline}</span>
      </div>

      {status === 'pending' && onSubmit && (
        <button
          onClick={onSubmit}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Upload className="w-4 h-4" />
          <span>Kumpulkan Tugas</span>
        </button>
      )}
    </div>
  );
}
