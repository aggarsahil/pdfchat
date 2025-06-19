import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, MessageSquare, FileText, User } from 'lucide-react';
import { askQuestion } from "@/lib/apiservice";

interface Document {
  id: string;
  name: string;
  uploadDate: string;
  size: string;
  pageCount: number;
}

interface QAMessage {
  id: string;
  type: 'question' | 'answer';
  content: string;
  timestamp: Date;
}

interface QAInterfaceProps {
  document: Document;
  onBack: () => void;
}

const QAInterface: React.FC<QAInterfaceProps> = ({ document, onBack }) => {
  const [messages, setMessages] = useState<QAMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const mockAnswers = [
    "Based on the document content, this appears to be related to the main topic discussed in section 2. The document provides detailed information about this subject.",
    "According to the information in your PDF, this concept is explained in detail with supporting examples and references.",
    "The document mentions this topic in the context of broader implications and provides specific data points to support the discussion.",
    "From what I can analyze in your document, this question relates to the key findings presented in the conclusion section."
  ];

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuestion.trim() || isProcessing) return;

    const questionMessage: QAMessage = {
      id: Date.now().toString(),
      type: 'question',
      content: currentQuestion,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, questionMessage]);
    setCurrentQuestion('');
    setIsProcessing(true);

    try {
      const result = await askQuestion(document.id, questionMessage.content);
      const answerMessage: QAMessage = {
        id: (Date.now() + 1).toString(),
        type: 'answer',
        content: result.answer,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, answerMessage]);
    } catch (error: any) {
      const errorMessage: QAMessage = {
        id: (Date.now() + 2).toString(),
        type: 'answer',
        content: error.message || 'Failed to get answer from backend.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Button variant="outline" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Documents
        </Button>
        
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <FileText className="w-6 h-6 text-red-500 mr-3" />
              <div>
                <CardTitle className="text-xl">{document.name}</CardTitle>
                <p className="text-gray-600 text-sm">
                  {document.pageCount} pages • {document.size} • Uploaded {document.uploadDate}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Q&A Session
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p>Ask your first question about this document</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'question' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.type === 'question'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="flex items-start">
                          {message.type === 'answer' && (
                            <MessageSquare className="w-4 h-4 mt-1 mr-2 flex-shrink-0" />
                          )}
                          {message.type === 'question' && (
                            <User className="w-4 h-4 mt-1 mr-2 flex-shrink-0" />
                          )}
                          <div>
                            <p>{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.type === 'question' ? 'text-blue-200' : 'text-gray-500'
                            }`}>
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex items-center">
                        <div className="animate-pulse flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </div>
                        <span className="ml-2 text-gray-600 text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <form onSubmit={handleSubmitQuestion} className="flex gap-2">
                <Input
                  value={currentQuestion}
                  onChange={(e) => setCurrentQuestion(e.target.value)}
                  placeholder="Ask a question about this document..."
                  disabled={isProcessing}
                  className="flex-1"
                />
                <Button type="submit" disabled={isProcessing || !currentQuestion.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Suggested Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  "What is the main topic of this document?",
                  "Can you summarize the key points?",
                  "What are the conclusions?",
                  "Are there any specific recommendations?"
                ].map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full text-left justify-start h-auto py-2 px-3"
                    onClick={() => setCurrentQuestion(suggestion)}
                    disabled={isProcessing}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Ask specific questions for better answers</li>
                <li>• Reference page numbers if known</li>
                <li>• Ask follow-up questions for clarity</li>
                <li>• Try different phrasings if needed</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QAInterface;
