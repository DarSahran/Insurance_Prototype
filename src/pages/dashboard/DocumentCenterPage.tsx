import React, { useState } from 'react';
import { 
  Upload, FileText, Download, Eye, Trash2, Plus, 
  Search, Filter, Calendar, CheckCircle, AlertTriangle,
  File, Image, FileSpreadsheet, Archive
} from 'lucide-react';

const DocumentCenterPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Mock document data
  const documents = [
    {
      id: 1,
      name: 'Life Insurance Policy - LifeSecure',
      type: 'policy',
      size: '2.4 MB',
      uploadDate: '2024-09-15',
      status: 'verified',
      fileType: 'pdf'
    },
    {
      id: 2,
      name: 'Medical Records - Annual Physical',
      type: 'medical',
      size: '1.8 MB',
      uploadDate: '2024-09-10',
      status: 'processing',
      fileType: 'pdf'
    },
    {
      id: 3,
      name: 'Income Verification - W2 2023',
      type: 'financial',
      size: '0.5 MB',
      uploadDate: '2024-09-08',
      status: 'verified',
      fileType: 'pdf'
    },
    {
      id: 4,
      name: 'Beneficiary Information Form',
      type: 'form',
      size: '0.3 MB',
      uploadDate: '2024-09-05',
      status: 'verified',
      fileType: 'pdf'
    },
    {
      id: 5,
      name: 'Health Assessment Results',
      type: 'medical',
      size: '1.2 MB',
      uploadDate: '2024-09-01',
      status: 'verified',
      fileType: 'pdf'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Documents', count: documents.length },
    { id: 'policy', name: 'Insurance Policies', count: documents.filter(d => d.type === 'policy').length },
    { id: 'medical', name: 'Medical Records', count: documents.filter(d => d.type === 'medical').length },
    { id: 'financial', name: 'Financial Documents', count: documents.filter(d => d.type === 'financial').length },
    { id: 'form', name: 'Forms & Applications', count: documents.filter(d => d.type === 'form').length }
  ];

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf': return FileText;
      case 'image': return Image;
      case 'spreadsheet': return FileSpreadsheet;
      case 'archive': return Archive;
      default: return File;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return CheckCircle;
      case 'processing': return Calendar;
      case 'rejected': return AlertTriangle;
      default: return Calendar;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.type === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Document Center</h1>
          <p className="text-gray-600 mt-1">Manage your insurance documents and files</p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Stats Cards */}
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
                {documents.filter(d => d.status === 'verified').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-yellow-600">
                {documents.filter(d => d.status === 'processing').length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Storage Used</p>
              <p className="text-2xl font-bold text-purple-600">6.2 MB</p>
            </div>
            <Archive className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
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

        {/* Documents List */}
        <div className="space-y-4">
          {filteredDocuments.map(document => {
            const FileIcon = getFileIcon(document.fileType);
            const StatusIcon = getStatusIcon(document.status);
            
            return (
              <div key={document.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{document.name}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500">{document.size}</span>
                        <span className="text-sm text-gray-500">Uploaded: {document.uploadDate}</span>
                        <div className="flex items-center space-x-1">
                          <StatusIcon className="w-4 h-4 text-gray-500" />
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(document.status)}`}>
                            {document.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or upload new documents.</p>
          </div>
        )}
      </div>

      {/* Upload Requirements */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">Document Upload Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-blue-800 mb-2">Accepted File Types</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• PDF documents (.pdf)</li>
              <li>• Images (.jpg, .png, .gif)</li>
              <li>• Microsoft Office files (.doc, .docx, .xls, .xlsx)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-blue-800 mb-2">Requirements</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Maximum file size: 10 MB</li>
              <li>• Clear, readable documents</li>
              <li>• All personal information visible</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upload Document</h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Plus className="w-5 h-5 transform rotate-45" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="">Select document type</option>
                  <option value="policy">Insurance Policy</option>
                  <option value="medical">Medical Record</option>
                  <option value="financial">Financial Document</option>
                  <option value="form">Form/Application</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Name</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter document name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File Upload</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Drag and drop your file here, or</p>
                  <button className="text-blue-600 hover:text-blue-800 font-medium">browse files</button>
                  <p className="text-xs text-gray-500 mt-2">Maximum file size: 10 MB</p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Upload Document
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
