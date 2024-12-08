import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  NavigateBefore as BackIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import type { FormData } from '../types/form';

interface ReviewPageProps {
  formData: FormData;
  onEdit: (sectionId: string) => void;
  onSubmit: () => void;
  skippedSections: string[];
}

const ReviewPage: React.FC<ReviewPageProps> = ({
  formData,
  onEdit,
  onSubmit,
  skippedSections
}) => {
  const renderSectionSummary = () => {
    return Object.entries(formData).map(([sectionId, data]) => (
      <Paper key={sectionId} sx={{ p: 3, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">
              {sectionId}
            </Typography>
            {skippedSections.includes(sectionId) && (
              <Chip 
                label="Partially Completed" 
                color="warning" 
                size="small"
              />
            )}
          </Box>
          <IconButton onClick={() => onEdit(sectionId)} size="small">
            <EditIcon />
          </IconButton>
        </Box>
        
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </Paper>
    ));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Review Your Application
          </Typography>
          <Typography color="text.secondary">
            Please review your application before submitting. You can edit any section if needed.
          </Typography>
        </Box>

        {renderSectionSummary()}

        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={() => onEdit('getting_started')}
          >
            Back to Edit
          </Button>
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={onSubmit}
          >
            Submit Application
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default ReviewPage; 