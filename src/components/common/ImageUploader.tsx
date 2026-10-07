'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { UploadCloud, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
}

export default function ImageUploader({ value, onChange, label = 'Product Image', required = false }: ImageUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    setError(null);

    // Enforce 5 MB limit (5 * 1024 * 1024 bytes)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5 MB limit. Please select a smaller image.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Invalid file type. Please select an image file (PNG, JPG, WEBP).');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success && data.url) {
        onChange(data.url);
      } else {
        setError(data.error || 'Failed to upload image');
      }
    } catch (err: any) {
      setError(err.message || 'Upload error');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {value ? (
        <div className="relative group w-full h-48 rounded-xl border border-slate-200 dark:border-[#1E304A] overflow-hidden bg-slate-50 dark:bg-[#0B1528] flex items-center justify-center">
          <Image
            src={value}
            alt="Uploaded preview"
            fill
            className="object-contain p-2"
            sizes="(max-width: 768px) 100vw, 400px"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
            >
              Change Image
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center min-h-[160px] ${
            error
              ? 'border-red-400 bg-red-50/30 dark:bg-red-950/20'
              : 'border-slate-300 dark:border-[#1E304A] hover:border-emerald-500 dark:hover:border-emerald-400 bg-slate-50/50 dark:bg-[#0B1528]'
          }`}
        >
          {loading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Uploading image to server...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  Click to upload or drag and drop
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  PNG, JPG, WEBP up to 5 MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
          }
        }}
      />

      {error && <p className="text-xs font-semibold text-red-500 mt-1">{error}</p>}
    </div>
  );
}
