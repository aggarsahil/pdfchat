import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Send, FileText } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { uploadPDF, askQuestion } from "@/lib/apiservice";

interface Message {
  id: string;
  type: 'user' | 'system' | 'ai';
  content: string;
  timestamp: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const { toast } = useToast();

  const commonQuestions = [
    "What is the main topic of this document?",
    "Can you summarize the key points?",
    "What are the conclusions?",
    "Who are the main authors mentioned?",
    "What data or statistics are presented?"
  ];

  const addMessage = (type: 'user' | 'system' | 'ai', content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      addMessage('system', `PDF uploaded: ${file.name}`);
      setIsProcessing(true);
      try {
        const result = await uploadPDF(file);
        setDocumentId(result.documentId);
        toast({
          title: "PDF uploaded successfully",
          description: "You can now ask questions about the document.",
        });
      } catch (error: any) {
        toast({
          title: "Upload failed",
          description: error.message || "Could not upload PDF.",
          variant: "destructive",
        });
        setUploadedFile(null);
      } finally {
        setIsProcessing(false);
      }
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async (messageContent: string) => {
    if (!messageContent.trim()) return;

    if (!uploadedFile || !documentId) {
      toast({
        title: "No document uploaded",
        description: "Please upload a PDF first.",
        variant: "destructive",
      });
      return;
    }

    addMessage('user', messageContent);
    setCurrentMessage('');
    setIsProcessing(true);

    try {
      const result = await askQuestion(documentId, messageContent);
      addMessage('ai', result.answer);
    } catch (error: any) {
      addMessage('system', error.message || 'Failed to get answer from backend.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage(currentMessage);
  };

  const handleQuestionClick = async (question: string) => {
    await sendMessage(question);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">PDF</span>
          </div>
          <span className="font-semibold text-gray-900">CHAT</span>
        </div>
        
        {uploadedFile ? (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FileText className="w-4 h-4" />
            <span>{uploadedFile.name}</span>
          </div>
        ) : null}
        
        <div>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
            id="pdf-upload"
          />
          <Button asChild variant="outline" size="sm">
            <label htmlFor="pdf-upload" className="cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              Upload PDF
            </label>
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p>Upload a PDF and start asking questions</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.type !== 'user' && (
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-white font-bold text-xs">
                    {message.type === 'ai' ? 'AI' : 'S'}
                  </span>
                </div>
              )}
              <div className={`max-w-[70%] p-3 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : message.type === 'system'
                  ? 'bg-gray-100 text-gray-700'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm">{message.content}</p>
              </div>
              {message.type === 'user' && (
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
                  <span className="text-white font-bold text-xs">U</span>
                </div>
              )}
            </div>
          ))
        )}
        
        {isProcessing && (
          <div className="flex justify-start">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <span className="text-white font-bold text-xs">AI</span>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Common Questions - Bottom Right */}
      {uploadedFile && messages.length === 1 && (
        <div className="fixed bottom-20 right-4 max-w-xs">
          <div className="bg-white border rounded-lg shadow-lg p-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Try asking:</h4>
            <div className="space-y-1">
              {commonQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuestionClick(question)}
                  className="w-full text-left text-xs text-gray-600 hover:text-blue-600 hover:bg-gray-50 p-2 rounded transition-colors"
                  disabled={isProcessing}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="Send a message..."
            disabled={isProcessing}
            className="flex-1"
          />
          <Button type="submit" disabled={isProcessing || !currentMessage.trim()} size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Index;
