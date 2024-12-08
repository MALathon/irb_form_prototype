import React from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { DynamicForm } from './components';
import { theme } from './theme/theme';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <DynamicForm />
      </Box>
    </ThemeProvider>
  );
};

export default App;
