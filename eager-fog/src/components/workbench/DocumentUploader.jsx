// src/components/DealFlow/DocumentUploader.jsx
import React, { useState } from "react";
import { Upload, X, FileText } from "lucide-react";

const DocumentUploader = ({ onFilesChange, maxFiles = 5 }) => {
  const [files, setFiles] = useState([]);

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    const updatedFiles = [...files, ...newFiles].slice(0, maxFiles);
    setFiles(updatedFiles);
    onFilesChange && onFilesChange(updatedFiles);
  };

  const handleRemove = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange && onFilesChange(updatedFiles);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const updatedFiles = [...files, ...droppedFiles].slice(0, maxFiles);
    setFiles(updatedFiles);
    onFilesChange && onFilesChange(updatedFiles);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Upload Deal Documents
      </label>

      <div
        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          id="fileInput"
        />
        <label
          htmlFor="fileInput"
          className="cursor-pointer flex flex-col items-center"
        >
          <Upload className="w-8 h-8 mb-2 text-gray-500" />
          <p className="text-sm text-gray-600">
            Drag & drop files here or{" "}
            <span className="text-blue-500">browse</span>
          </p>
          <p className="text-xs text-gray-400">Max {maxFiles} files allowed</p>
        </label>
      </div>

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((file, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
            >
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-gray-500" />
                <span className="text-sm">{file.name}</span>
              </div>
              <button
                onClick={() => handleRemove(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DocumentUploader;
