import React from 'react';
import {
  Box,
  LinearProgress,
  Typography,
  Tooltip,
  Paper,
  Stack,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ErrorIcon from '@mui/icons-material/Error';
import type { ProgressTrackerProps } from '../types';

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  completedSections,
  totalSections,
  estimatedTimeRemaining,
  validationErrors,
}) => {
  const progress = (completedSections.length / totalSections) * 100;

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2, 
        mb: 3,
        borderBottom: '1px solid',
        borderColor: 'divider',
        borderRadius: 0
      }}
    >
      <Stack direction="row" spacing={3} alignItems="center">
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Overall Progress
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {Math.round(progress)}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progress}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        <Tooltip title="Estimated time remaining">
          <Stack direction="row" spacing={1} alignItems="center">
            <AccessTimeIcon color="action" />
            <Typography variant="body2" color="text.secondary">
              {estimatedTimeRemaining} min
            </Typography>
          </Stack>
        </Tooltip>

        <AnimatePresence>
          {Object.keys(validationErrors).length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Tooltip title="Please fix validation errors to proceed">
                <Stack direction="row" spacing={1} alignItems="center">
                  <ErrorIcon color="error" />
                  <Typography variant="body2" color="error">
                    Fix Errors
                  </Typography>
                </Stack>
              </Tooltip>
            </motion.div>
          )}
        </AnimatePresence>
      </Stack>
    </Paper>
  );
};

export default ProgressTracker; 