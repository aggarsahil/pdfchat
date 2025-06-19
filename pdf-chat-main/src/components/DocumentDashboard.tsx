
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Calendar, HardDrive, FileType } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  uploadDate: string;
  size: string;
  pageCount: number;
}

interface DocumentDashboardProps {
  documents: Document[];
  onDocumentSelect: (doc: Document) => void;
  onUploadNew: () => void;
}

const DocumentDashboard: React.FC<DocumentDashboardProps> = ({ 
  documents, 
  onDocumentSelect, 
  onUploadNew 
}) => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">My Documents</h2>
          <p className="text-gray-600">Manage and interact with your uploaded PDF documents</p>
        </div>
        <Button onClick={onUploadNew} className="bg-blue-600 hover:bg-blue-700">
          <Upload className="w-4 h-4 mr-2" />
          Upload New Document
        </Button>
      </div>

      {documents.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No documents yet</h3>
            <p className="text-gray-600 mb-6">Upload your first PDF document to get started</p>
            <Button onClick={onUploadNew} className="bg-blue-600 hover:bg-blue-700">
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <Card key={doc.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <FileText className="w-8 h-8 text-red-500 flex-shrink-0" />
                  <Button 
                    size="sm" 
                    onClick={() => onDocumentSelect(doc)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Open Q&A
                  </Button>
                </div>
                <CardTitle className="text-lg leading-tight">{doc.name}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Uploaded {doc.uploadDate}</span>
                  </div>
                  <div className="flex items-center">
                    <HardDrive className="w-4 h-4 mr-2" />
                    <span>{doc.size}</span>
                  </div>
                  <div className="flex items-center">
                    <FileType className="w-4 h-4 mr-2" />
                    <span>{doc.pageCount} pages</span>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4" 
                  variant="outline"
                  onClick={() => onDocumentSelect(doc)}
                >
                  Ask Questions
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentDashboard;
