import React, { useState } from 'react';
import { uploadDocument } from '../api/apiClient';

export const FileUpload = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    try {
      setUploading(true);
      const result = await uploadDocument(file);
      onUploadComplete(result);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const styles = {
    uploadContainer: {
      border: '2px dashed #ccc',
      borderRadius: '8px',
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#fafafa',
      transition: 'border-color 0.3s ease',
      cursor: 'pointer',
      position: 'relative'
    },
    uploadContainerHover: {
      borderColor: '#3b82f6'
    },
    inputFile: {
      display: 'none'
    },
    uploadButton: {
      backgroundColor: '#3b82f6',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '500',
      display: 'inline-block',
      marginBottom: '10px',
      transition: 'background-color 0.3s ease'
    },
    uploadText: {
      color: '#666',
      marginTop: '10px',
      fontSize: '14px'
    },
    fileName: {
      marginTop: '10px',
      color: '#333',
      fontWeight: '500'
    },
    loadingSpinner: {
      display: 'inline-block',
      width: '20px',
      height: '20px',
      border: '3px solid rgba(255,255,255,.3)',
      borderRadius: '50%',
      borderTopColor: 'white',
      animation: 'spin 1s ease-in-out infinite',
      marginRight: '10px'
    }
  };

  return (
    <div 
      style={styles.uploadContainer}
      onDragOver={(e) => {
        e.preventDefault();
        e.currentTarget.style.borderColor = '#3b82f6';
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.currentTarget.style.borderColor = '#ccc';
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.currentTarget.style.borderColor = '#ccc';
        const file = e.dataTransfer.files[0];
        if (file) {
          setFileName(file.name);
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          document.getElementById('file-upload').files = dataTransfer.files;
          handleFileUpload({ target: { files: [file] } });
        }
      }}
    >
      <input
        type="file"
        id="file-upload"
        accept=".pdf,.doc,.docx"
        onChange={handleFileUpload}
        style={styles.inputFile}
        disabled={uploading}
      />
      <label htmlFor="file-upload">
        <div 
          style={styles.uploadButton}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
        >
          {uploading ? (
            <>
              <span style={styles.loadingSpinner}></span>
              Uploading...
            </>
          ) : (
            'Choose File or Drag & Drop'
          )}
        </div>
      </label>
      <p style={styles.uploadText}>
        {fileName ? (
          <span style={styles.fileName}>{fileName}</span>
        ) : (
          'Supported formats: PDF, DOC, DOCX'
        )}
      </p>
    </div>
  );
};