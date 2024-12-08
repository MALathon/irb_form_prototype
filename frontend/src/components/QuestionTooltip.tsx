import React from 'react';
import { Tooltip, IconButton } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import type { QuestionTooltipProps } from './types';

const QuestionTooltip: React.FC<QuestionTooltipProps> = ({ text }) => {
  return (
    <Tooltip title={text} arrow placement="right">
      <IconButton size="small">
        <HelpOutlineIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

export default QuestionTooltip; 