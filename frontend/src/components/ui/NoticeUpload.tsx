import React, { useRef } from 'react';
import { ImagePlus } from 'lucide-react';

interface NoticeUploadProps {
  disabled: boolean;
  onNoticeProcessed: (result: {
    action_taken: string;
    conflict_detected: boolean;
    details: string;
    extracted_event?: {
      event_name: string;
      date: string;
      category: string;
      subject: string;
    };
    conflicts_with?: string[];
  }) => void;
  onProcessingStart: () => void;
  onProcessingEnd: () => void;
}

export const NoticeUpload: React.FC<NoticeUploadProps> = ({
  disabled, onNoticeProcessed, onProcessingStart, onProcessingEnd,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onProcessingStart();

    try {
      // Convert file to base64 data URI
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch('/api/academic/process-notice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: base64 }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.statusText}`);
      const result = await res.json();
      onNoticeProcessed(result);
    } catch (err) {
      console.error('Notice processing failed:', err);
      onNoticeProcessed({
        action_taken: 'Error processing notice',
        conflict_detected: false,
        details: `Failed to process notice image: ${err}`,
      });
    } finally {
      onProcessingEnd();
      // Reset input so same file can be re-uploaded
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id="notice-upload-input"
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
        className="px-3 bg-brutal-white text-brutal-black border-2 border-brutal-black shadow-[2px_2px_0px_0px_rgba(15,15,15,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(15,15,15,1)] active:translate-x-0 active:translate-y-0 active:shadow-none disabled:opacity-40 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 transition-all flex items-center justify-center gap-1.5"
        title="Upload Academic Notice (Image)"
      >
        <ImagePlus className="w-4 h-4" />
        <span className="font-mono text-[10px] uppercase tracking-wider font-bold hidden sm:inline">
          Notice
        </span>
      </button>
    </>
  );
};
