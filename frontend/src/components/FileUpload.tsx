import React, { useCallback, useState } from 'react';
import { 
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type?: string;
  url?: string;
}

interface FileUploadProps {
  onChange: (files: UploadedFile[]) => void;
  value?: UploadedFile[];
  multiple?: boolean;
  onFileDelete?: (fileId: string) => void;
  onFileDownload?: (file: UploadedFile) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  onChange, 
  value = [], 
  multiple = false,
  onFileDelete,
  onFileDownload 
}) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type
    }));
    onChange(multiple ? [...value, ...droppedFiles] : [droppedFiles[0]]);
  }, [multiple, onChange, value]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type
      }));
      onChange(multiple ? [...value, ...selectedFiles] : [selectedFiles[0]]);
    }
  }, [multiple, onChange, value]);

  const handleDelete = useCallback((index: number) => {
    const fileToDelete = value[index];
    if (onFileDelete) {
      onFileDelete(fileToDelete.id);
    }
    onChange(value.filter((_, i) => i !== index));
  }, [onChange, value, onFileDelete]);

  return (
    <Box>
      <Box
        sx={{
          border: '2px dashed',
          borderColor: dragOver ? 'primary.main' : 'grey.300',
          borderRadius: 1,
          p: 3,
          textAlign: 'center',
          bgcolor: dragOver ? 'action.hover' : 'background.paper',
          cursor: 'pointer'
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          multiple={multiple}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <UploadIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
        <Typography>
          Drag and drop files here or click to select
        </Typography>
      </Box>

      {value.length > 0 && (
        <List>
          {value.map((file, index) => (
            <ListItem 
              key={index}
              onClick={() => onFileDownload && onFileDownload(file)}
              sx={{ cursor: onFileDownload ? 'pointer' : 'default' }}
            >
              <ListItemText 
                primary={file.name}
                secondary={`${(file.size / 1024).toFixed(1)} KB`}
              />
              <ListItemSecondaryAction>
                <IconButton 
                  edge="end" 
                  aria-label="delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(index);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}; 