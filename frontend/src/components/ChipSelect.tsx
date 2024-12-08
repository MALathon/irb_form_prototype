import React from 'react';
import { Chip, Box } from '@mui/material';

export interface ChipSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

const ChipSelect: React.FC<ChipSelectProps> = ({ options, selected, onChange }) => {
  const handleToggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {options.map((option) => (
        <Chip
          key={option}
          label={option}
          onClick={() => handleToggle(option)}
          color={selected.includes(option) ? "primary" : "default"}
          variant={selected.includes(option) ? "filled" : "outlined"}
        />
      ))}
    </Box>
  );
};

export default ChipSelect; 