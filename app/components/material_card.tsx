import React from 'react';
import { FileText, Download, Video, File } from 'lucide-react';

interface MaterialCardProps {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'document';
  uploadedBy: string;
  uploadedAt: string;
  onDownload?: () => void;
}

export default function MaterialCard({
  id,
  title,
  description,
  type,
  uploadedBy,
  uploadedAt,
  onDownload,
}: MaterialCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'video':
        return <Video className="w-5 h-5 text-blue-500" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeBadge = () => {
    const colors = {
      pdf: 'bg-red-100 text-red-700',
      video: 'bg-blue-100 text-blue-700',
      document: 'bg-gray-100 text-gray-700',
    };

    return (
      <span className={`px-2 py-1 rounded text-xs ${colors[type]}`}>
        {type.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="text-gray-900 text-sm">{title}</h4>
            {getTypeBadge()}
          </div>

          <p className="text-gray-600 text-sm mb-3">{description}</p>

          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              <p>Diunggah oleh {uploadedBy}</p>
              <p>{uploadedAt}</p>
            </div>

            {onDownload && (
              <button
                onClick={onDownload}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                <span>Unduh</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
