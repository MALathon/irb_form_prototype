import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Stack,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Description as DescriptionIcon,
  QuestionAnswer as QuestionAnswerIcon,
  AutoAwesome as AIIcon,
  Send as SendIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const theme = useTheme();

  const steps = [
    {
      icon: <QuestionAnswerIcon fontSize="large" />,
      title: "Simple Questions",
      description: "We'll guide you through some basic questions about your research",
      isComingSoon: false
    },
    {
      icon: <DescriptionIcon fontSize="large" />,
      title: "Protocol Generation",
      description: "We'll help you create a complete, well-structured protocol",
      isComingSoon: false
    },
    {
      icon: <DownloadIcon fontSize="large" />,
      title: "Download Protocol",
      description: "Download your completed protocol as a formatted document",
      isComingSoon: false
    },
    {
      icon: <AIIcon fontSize="large" />,
      title: "Smart Assistance",
      description: "Our AI helps tailor the application to your specific needs",
      isComingSoon: true
    },
    {
      icon: <UploadIcon fontSize="large" />,
      title: "Direct eIRB Submission",
      description: "Submit your completed protocol directly to eIRB",
      isComingSoon: true
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Stack spacing={8} alignItems="center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography 
            variant="h2" 
            align="center" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              color: 'primary.dark',
              mb: 2
            }}
          >
            AI/ML IRB Protocol Builder
          </Typography>
          <Typography 
            variant="h5" 
            align="center" 
            color="text.secondary"
            sx={{ maxWidth: 800, mx: 'auto' }}
          >
            Helping you build clear, compliant AI/ML IRB applications
          </Typography>
        </motion.div>

        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 3,
                minWidth: 'min-content',
                px: 2,
                py: 1,
                justifyContent: 'center'
              }}
            >
              {steps.map((step, index) => (
                <Paper
                  key={step.title}
                  sx={{
                    p: 3,
                    width: 220,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8],
                    }
                  }}
                >
                  {step.isComingSoon && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: -28,
                        transform: 'rotate(45deg)',
                        bgcolor: 'info.main',
                        color: 'common.white',
                        py: 0.5,
                        px: 4,
                        opacity: 0.9,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontWeight: 500,
                          letterSpacing: '0.5px'
                        }}
                      >
                        Coming Soon
                      </Typography>
                    </Box>
                  )}
                  <Stack 
                    spacing={2} 
                    alignItems="center" 
                    sx={{ 
                      opacity: step.isComingSoon ? 0.7 : 1,
                      filter: step.isComingSoon ? 'grayscale(20%)' : 'none'
                    }}
                  >
                    <Box sx={{ color: 'primary.main' }}>
                      {step.icon}
                    </Box>
                    <Typography variant="h6" align="center">
                      {step.title}
                    </Typography>
                    <Typography variant="body2" align="center" color="text.secondary">
                      {step.description}
                    </Typography>
                  </Stack>
                </Paper>
              ))}
            </Box>
          </motion.div>
        </Box>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={onStart}
            sx={{
              px: 6,
              py: 2,
              borderRadius: 2,
              fontSize: '1.1rem',
              boxShadow: theme.shadows[4],
              '&:hover': {
                boxShadow: theme.shadows[8],
              },
            }}
          >
            Let's Get Started
          </Button>
        </motion.div>
      </Stack>
    </Container>
  );
};

export default LandingPage; 