import React, { useState } from 'react';
import { UploadCloud, CheckCircle, FileText } from 'lucide-react';

export const FacultyVault: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        await uploadFile(droppedFile);
      } else {
        alert("Only PDF documents are allowed for faculty ingestion.");
      }
    }
  };

  const uploadFile = async (selectedFile: File) => {
    setIsUploading(true);
    setUploadSuccess(false);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // We will hook this up to the python backend soon
      const response = await fetch('/api/academic/upload-qb', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        setUploadSuccess(true);
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex-1 border-b-2 border-brutal-black bg-brutal-white flex flex-col min-h-[33%]">
      <div className="bg-brutal-black text-brutal-white font-mono text-[10px] p-2 flex items-center justify-between border-b-2 border-brutal-black">
        <span className="uppercase tracking-widest font-bold flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-brutal-orange" />
          🏛️ Faculty Vault & Notice Board
        </span>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <p className="text-[10px] font-mono text-brutal-gray-dark uppercase tracking-widest mb-3">
          Drag-and-drop course documents (PDF) and schedule updates
        </p>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex-1 border-2 border-dashed ${isDragging ? 'border-brutal-orange bg-orange-50' : 'border-brutal-black bg-brutal-gray-light'} flex flex-col items-center justify-center p-4 transition-colors`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center text-center">
              <div className="w-full max-w-[150px] h-2 border border-brutal-black mb-2 overflow-hidden bg-brutal-white">
                <div className="h-full bg-green-500 animate-[pulse_1s_ease-in-out_infinite] w-full origin-left scale-x-50"></div>
              </div>
              <span className="font-mono text-[10px] uppercase text-brutal-black">Ingesting Hash...</span>
            </div>
          ) : uploadSuccess ? (
            <div className="flex flex-col items-center text-center text-green-700">
              <CheckCircle className="w-6 h-6 mb-2" />
              <span className="font-mono text-[10px] uppercase font-bold text-brutal-black">Ingestion Complete</span>
              <span className="font-mono text-[9px] text-brutal-gray-dark mt-1">{file?.name}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center text-brutal-gray-dark">
              <UploadCloud className="w-6 h-6 mb-2 text-brutal-black" />
              <span className="font-mono text-[10px] uppercase font-bold text-brutal-black">[FACULTY VAULT: ADDITIVE INGESTION]</span>
              <span className="font-mono text-[9px] mt-1">Drop Question Bank PDF Here</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
