
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, File, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface PDFUploadProps {
  onUpload: (file: File) => void;
}

const PDFUpload: React.FC<PDFUploadProps> = ({ onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length === 0) {
      toast({
        title: "Invalid file type",
        description: "Please upload PDF files only.",
        variant: "destructive",
      });
      return;
    }

    if (pdfFiles.length > 1) {
      toast({
        title: "Multiple files",
        description: "Please upload one PDF file at a time.",
        variant: "destructive",
      });
      return;
    }

    const file = pdfFiles[0];
    setUploadedFile(file);
    processFile(file);
  };

  const processFile = async (file: File) => {
    setUploading(true);
    
    // Simulate processing time
    setTimeout(() => {
      setUploading(false);
      onUpload(file);
      toast({
        title: "Upload successful",
        description: "Your PDF has been uploaded and processed successfully.",
      });
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Upload PDF Document</h2>
        <p className="text-gray-600">Upload a PDF document to start asking questions about its content</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {uploading ? (
              <div className="space-y-4">
                <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-lg font-medium">Processing your PDF...</p>
                <p className="text-gray-600">This may take a few moments</p>
              </div>
            ) : uploadedFile ? (
              <div className="space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-green-700">File uploaded successfully!</p>
                  <p className="text-gray-600">{uploadedFile.name}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium">Drop your PDF here, or click to browse</p>
                  <p className="text-gray-600">Supports PDF files up to 10MB</p>
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileInput}
                  className="hidden"
                  id="pdf-upload"
                />
                <Button asChild className="mt-4">
                  <label htmlFor="pdf-upload" className="cursor-pointer">
                    <File className="w-4 h-4 mr-2" />
                    Choose File
                  </label>
                </Button>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900">Upload Guidelines</h4>
                <ul className="mt-2 text-sm text-blue-800 space-y-1">
                  <li>• Only PDF files are accepted</li>
                  <li>• Maximum file size: 10MB</li>
                  <li>• Text-based PDFs work best for Q&A</li>
                  <li>• Processing time varies with document size</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PDFUpload;
