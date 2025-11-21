'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Upload, X, Palette } from 'lucide-react';

interface ImageUploadWithColorProps {
  currentImage?: { url: string; color?: string; colorName?: string };
  onUploadComplete: (data: { url: string; color?: string; colorName?: string }) => void;
  onRemove?: () => void;
  label?: string;
}

export function ImageUploadWithColor({
  currentImage,
  onUploadComplete,
  onRemove,
  label = 'Product Image',
}: ImageUploadWithColorProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage?.url || null);
  const [error, setError] = useState<string | null>(null);
  const [color, setColor] = useState(currentImage?.color || '#000000');
  const [colorName, setColorName] = useState(currentImage?.colorName || '');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to S3
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await response.json();
      onUploadComplete({ url: data.url, color, colorName });
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      setPreview(currentImage?.url || null);
    } finally {
      setUploading(false);
    }
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    if (currentImage?.url) {
      onUploadComplete({ url: currentImage.url, color: newColor, colorName });
    }
  };

  const handleColorNameChange = (newColorName: string) => {
    setColorName(newColorName);
    if (currentImage?.url) {
      onUploadComplete({ url: currentImage.url, color, colorName: newColorName });
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-300">{label}</label>

      <div className="flex gap-4">
        {/* Image Upload Section */}
        <div className="flex-1">
          <div className="relative border-2 border-dashed border-zinc-700 rounded-lg p-4 hover:border-zinc-600 transition-colors">
            {preview ? (
              <div className="relative aspect-square w-full max-w-xs mx-auto">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover rounded-lg"
                />
                {onRemove && (
                  <button
                    type="button"
                    onClick={onRemove}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Upload className="mx-auto h-12 w-12 text-zinc-600" />
                <p className="mt-2 text-sm text-zinc-400">Click to upload image</p>
                <p className="text-xs text-zinc-500 mt-1">PNG, JPG up to 5MB</p>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <div className="text-white text-sm">Uploading...</div>
              </div>
            )}
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {/* Color Picker Section */}
        <div className="w-64 space-y-3">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Palette className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-300">Color Variant</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Color</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Color Name</label>
                <input
                  type="text"
                  value={colorName}
                  onChange={(e) => handleColorNameChange(e.target.value)}
                  placeholder="e.g., Black, Silver"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm focus:outline-none focus:border-yellow-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

