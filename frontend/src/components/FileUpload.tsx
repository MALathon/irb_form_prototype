import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Button,
  Tooltip,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Description as FileIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useDropzone, DropzoneOptions } from 'react-dropzone';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  url?: string;
}

interface FileUploadProps {
  files: UploadedFile[];
  onFilesAdd: (newFiles: File[]) => void;
  onFileDelete: (fileId: string) => void;
  onFileDownload?: (file: UploadedFile) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  files,
  onFilesAdd,
  onFileDelete,
  onFileDownload,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesAdd(acceptedFiles);
  }, [onFilesAdd]);

  const onDragEnter = useCallback(() => {
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const dropzoneOptions: DropzoneOptions = {
    onDrop,
    onDragEnter,
    onDragLeave,
    onDragOver: (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
    },
    multiple: true,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneOptions);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box>
      {/* Drop Zone */}
      <Paper
        {...getRootProps()}
        sx={{
          p: 3,
          mb: 2,
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          bgcolor: isDragActive ? 'primary.lighter' : 'background.paper',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'primary.lighter',
          },
        }}
      >
        <input {...getInputProps()} type="file" style={{ display: 'none' }} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <UploadIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h6" color="primary">
            {isDragActive
              ? 'Drop files here'
              : 'Drag and drop files here, or click to select'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload any relevant documents, protocols, or supporting materials
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Supported formats: PDF, DOC, DOCX, TXT
          </Typography>
        </Box>
      </Paper>

      {/* File List */}
      {files.length > 0 && (
        <Paper sx={{ mt: 3 }}>
          <List>
            {files.map((file) => (
              <ListItem key={file.id} divider>
                <FileIcon sx={{ mr: 2 }} />
                <ListItemText
                  primary={file.name}
                  secondary={`${formatFileSize(file.size)} • ${new Date(
                    file.uploadDate
                  ).toLocaleDateString()}`}
                />
                <ListItemSecondaryAction>
                  {onFileDownload && (
                    <Tooltip title="Download">
                      <IconButton
                        edge="end"
                        onClick={() => onFileDownload(file)}
                        sx={{ mr: 1 }}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Delete">
                    <IconButton
                      edge="end"
                      onClick={() => onFileDelete(file.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}; 