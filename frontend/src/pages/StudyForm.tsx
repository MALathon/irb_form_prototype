import React from 'react';
import { Container } from '@mui/material';
import { DynamicForm } from '../components';
import { theme } from '../theme/theme';
import { ThemeProvider } from '@mui/material/styles';

const StudyForm: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <DynamicForm />
      </Container>
    </ThemeProvider>
  );
};

export default StudyForm; 