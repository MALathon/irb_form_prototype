import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  Info as InfoIcon,
  WarningAmber as WarningIcon,
} from '@mui/icons-material';
import type { HelpPanelProps } from '../types';

const HelpPanel: React.FC<HelpPanelProps> = ({ section, onClose }) => {
  const renderTemplate = (template: string | Record<string, any> | undefined) => {
    if (!template) return null;
    
    if (typeof template === 'string') {
      return (
        <Typography
          component="pre"
          sx={{
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            p: 1,
            bgcolor: 'background.paper',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          {template}
        </Typography>
      );
    }

    // If template is a record of fields
    return (
      <Box sx={{ mt: 1 }}>
        {Object.entries(template).map(([fieldName, field]) => (
          <Box key={fieldName} sx={{ mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {fieldName}:
            </Typography>
            <Typography variant="body2">
              {`${field.label} (${field.type}${field.required ? ', required' : ''})`}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Help & Guidelines</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        {section.description}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <List>
        {section.questions.map((question) => (
          <ListItem key={question.id} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', width: '100%', mb: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <InfoIcon color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={question.label}
                secondary={question.tooltip}
              />
            </Box>
            
            {question.template && (
              <Box sx={{ pl: 4.5, width: '100%' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  Template:
                </Typography>
                {renderTemplate(question.template)}
              </Box>
            )}

            {question.required && (
              <Box sx={{ pl: 4.5, display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <WarningIcon color="warning" fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="caption" color="warning.main">
                  This field is required
                </Typography>
              </Box>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default HelpPanel;