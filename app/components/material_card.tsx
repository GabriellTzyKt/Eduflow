import React from "react";
import { FileText, Download, Video, File } from "lucide-react";

interface MaterialCardProps {
  id: string;
  title: string;
  file_url: string | null;
  description: string;
  uploadedBy: string;
  uploadedAt: string;
  onDownload?: () => void;
}

export default function MaterialCard({
  id,
  title,
  description,
  file_url,
  uploadedBy,
  uploadedAt,
  onDownload,
}: MaterialCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-gray-900 text-lg font-semibold">{title}</h3>
          <p className="text-gray-600 text-sm mb-4">{description}</p>

          <div className="flex mt-4 items-center justify-between">
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
