import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Drawer,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { HelpPanelProps } from '../types/components';

const HelpPanel: React.FC<HelpPanelProps> = ({ section, onClose }) => {
  return (
    <Drawer
      anchor="right"
      open={true}
      onClose={onClose}
      PaperProps={{
        sx: { width: '40%', maxWidth: 600, p: 3 }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          Help: {section.title}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <Typography>
        {section.description}
      </Typography>
    </Drawer>
  );
};

export default HelpPanel;