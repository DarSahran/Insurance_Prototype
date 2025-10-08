import React, { useState, useCallback } from 'react';
import {
  Upload, FileText, Download, Eye, Trash2, Plus, Search, Filter,
  CheckCircle, AlertTriangle, File, Loader, X, Brain
} from 'lucide-react';
import { useUserData } from '../../hooks/useUserData';
import { OCRService } from '../../lib/ocrService';

const DocumentCenterPage: React.FC = () => {
  const { documents, loading, refreshData, userData } = useUserData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !documentType || !userData?.profile) return;

    try {
      setUploading(true);
      setUploadProgress('Uploading document...');

      const result = await OCRService.processDocument(selectedFile, documentType, userData.profile.user_id);

      if (result) {
        setUploadProgress('Processing with OCR...');

        if (result.result.requiresVerification) {
          setUploadProgress('Document uploaded! Manual verification required due to low confidence.');
        } else {
          setUploadProgress('Document uploaded and processed successfully!');
        }

        setTimeout(() => {
          setShowUploadModal(false);
          setSelectedFile(null);
          setDocumentType('');
          setUploadProgress('');
          refreshData();
        }, 2000);
      } else {
        setUploadProgress('Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadProgress('Error uploading document');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!userData?.profile) return;
    if (!confirm('Are you sure you want to delete this document?')) return;

    const success = await OCRService.deleteDocument(documentId, userData.profile.user_id);
    if (success) {
      refreshData();
    }
  };

  const categories = [
    { id: 'all', name: 'All Documents', count: documents.length },
    { id: 'medical', name: 'Medical Records', count: documents.filter(d => d.document_type === 'medical').length },
    { id: 'financial', name: 'Financial Documents', count: documents.filter(d => d.document_type === 'financial').length },
    { id: 'identification', name: 'ID Documents', count: documents.filter(d => d.document_type === 'identification').length },
    { id: 'insurance', name: 'Insurance Docs', count: documents.filter(d => d.document_type === 'insurance').length }
  ];

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      completed: 'bg-green-100 text-green-800',
      processing: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.document_type === selectedCategory;
    const matchesSearch = doc.file_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Document Center</h1>
          <p className="text-gray-600 mt-1">Manage your insurance documents with AI-powered OCR</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Verified</p>
              <p className="text-2xl font-bold text-green-600">
                {documents.filter(d => d.processing_status === 'completed' && !d.manual_verification_required).length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-blue-600">
                {documents.filter(d => d.processing_status === 'processing').length}
              </p>
            </div>
            <Loader className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Needs Review</p>
              <p className="text-2xl font-bold text-orange-600">
                {documents.filter(d => d.manual_verification_required).length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {documents.length === 0 ? 'No documents uploaded' : 'No documents found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {documents.length === 0
                ? 'Upload your first document to get started with AI-powered document processing'
                : 'Try adjusting your search criteria or filters'}
            </p>
            {documents.length === 0 && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
              >
                <Upload className="w-5 h-5" />
                <span>Upload Your First Document</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDocuments.map((document) => (
              <div key={document.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="font-medium text-gray-900">{document.file_name}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(document.processing_status)}`}>
                          {document.processing_status}
                        </span>
                        {document.manual_verification_required && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                            Needs Review
                          </span>
                        )}
                        {document.ocr_confidence && (
                          <span className="flex items-center text-xs text-gray-600">
                            <Brain className="w-3 h-3 mr-1" />
                            {Math.round(document.ocr_confidence * 100)}% confidence
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="capitalize">{document.document_type}</span>
                        <span>{(document.file_size / 1024).toFixed(2)} KB</span>
                        <span>Uploaded: {new Date(document.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      className="p-2 text-gray-400 hover:text-blue-600"
                      title="View Document"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(document.id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                      title="Delete Document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <Brain className="w-8 h-8 text-blue-600 flex-shrink-0" />
          <div>
            <h2 className="text-lg font-semibold text-blue-900 mb-2">AI-Powered Document Processing</h2>
            <p className="text-blue-800 mb-4">
              Our OCR technology automatically extracts information from your documents including medical records,
              financial statements, and ID documents. Data is used to pre-fill your insurance assessments.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-blue-800 mb-2">Accepted File Types</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• PDF documents (.pdf)</li>
                  <li>• Images (.jpg, .png, .gif)</li>
                  <li>• Maximum file size: 10 MB</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-blue-800 mb-2">Document Categories</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Medical records and prescriptions</li>
                  <li>• Financial statements and tax docs</li>
                  <li>• Insurance policies and forms</li>
                  <li>• Identification documents</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Upload Document</span>
              </h3>
              <button
                onClick={() => !uploading && setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
                disabled={uploading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={uploading}
                >
                  <option value="">Select document type</option>
                  <option value="medical">Medical Record</option>
                  <option value="financial">Financial Document</option>
                  <option value="identification">ID Document</option>
                  <option value="insurance">Insurance Document</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File Upload</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.jpg,.jpeg,.png,.gif"
                    disabled={uploading}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    {selectedFile ? (
                      <p className="text-sm text-gray-600">{selectedFile.name}</p>
                    ) : (
                      <>
                        <p className="text-sm text-gray-600">Click to select a file or drag and drop</p>
                        <p className="text-xs text-gray-500 mt-2">Maximum file size: 10 MB</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {uploadProgress && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 flex items-center">
                    {uploading ? (
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    {uploadProgress}
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || !documentType || uploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : 'Upload & Process'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentCenterPage;
