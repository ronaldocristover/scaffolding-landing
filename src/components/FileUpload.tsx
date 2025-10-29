'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { FileUploadService, UploadProgress } from '@/services/file-upload-service';

interface FileUploadProps {
  /** Current file URL (for editing existing uploads) */
  value?: string;
  /** Callback when file is uploaded successfully */
  onChange: (url: string) => void;
  /** Upload folder name (default: 'temp') */
  folder?: string;
  /** Accept attribute for file input (default: images) */
  accept?: string;
  /** Maximum file size in bytes (default: 5MB) */
  maxSize?: number;
  /** Allowed MIME types */
  allowedTypes?: string[];
  /** Label text for the upload button */
  label?: string;
  /** Helper text to display below the upload area */
  helperText?: string;
  /** Show image preview for uploaded files */
  showPreview?: boolean;
  /** Custom className for the container */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Required field validation */
  required?: boolean;
  /** Error message to display */
  error?: string;
}

export default function FileUpload({
  value,
  onChange,
  folder = 'temp',
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  label = 'Choose File',
  helperText = 'Click to upload or drag and drop',
  showPreview = true,
  className = '',
  disabled = false,
  required = false,
  error = '',
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    if (disabled || isUploading) return;

    try {
      // Validate file
      FileUploadService.validateFile(file, maxSize, allowedTypes);

      // Create preview for images
      if (file.type.startsWith('image/') && showPreview) {
        const preview = await FileUploadService.createFilePreview(file);
        setPreviewUrl(preview);
      }

      setIsUploading(true);
      setUploadProgress(0);

      // Upload file
      const uploadedUrl = await FileUploadService.uploadFileForUrl(
        file,
        folder,
        (progress: UploadProgress) => {
          setUploadProgress(progress.percentage);
        }
      );

      // Update preview to actual uploaded URL
      if (showPreview && uploadedUrl) {
        setPreviewUrl(uploadedUrl);
      }

      onChange(uploadedUrl);
    } catch (err) {
      console.error('Upload failed:', err);
      setPreviewUrl(null);
      // You might want to pass error to parent component
      // For now, we'll just log the error
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [disabled, isUploading, maxSize, allowedTypes, showPreview, folder, onChange]);

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || isUploading) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  }, [disabled, isUploading, handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isUploading) {
      setDragActive(true);
    }
  }, [disabled, isUploading]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleClick = () => {
    if (!disabled && !isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Determine preview URL (uploaded file URL or local preview)
  const displayPreview = value || previewUrl;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
        required={required}
      />

      {/* Upload area with drag and drop */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${isUploading ? 'pointer-events-none' : ''}
          ${error ? 'border-red-500 bg-red-50' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        {/* Preview area */}
        {displayPreview && showPreview ? (
          <div className="relative inline-block">
            <div className="relative group">
              <Image
                src={displayPreview}
                alt="Uploaded file preview"
                width={200}
                height={200}
                className="max-w-full max-h-48 object-contain rounded"
              />

              {/* Remove button overlay */}
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={disabled || isUploading}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          // Upload icon and text
          <div className="space-y-3">
            <div className="flex justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {isUploading ? 'Uploading...' : label}
              </p>
              {helperText && (
                <p className="text-xs text-gray-500 mt-1">{helperText}</p>
              )}
            </div>
          </div>
        )}

        {/* Upload progress bar */}
        {isUploading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg">
            <div className="w-full max-w-xs px-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* File info */}
      {displayPreview && !isUploading && (
        <p className="text-xs text-gray-500">
          File uploaded successfully. Click to change or use the × button to remove.
        </p>
      )}
    </div>
  );
}