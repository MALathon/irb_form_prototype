import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import type { TeamMember, StudyRole } from '../types/index';
import { STUDY_ROLES } from '../config/formConfig';

// Simulated MDM database search
const searchMDM = async (query: string): Promise<TeamMember[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: '1',
      name: 'Dr. Jane Smith',
      title: 'Associate Professor',
      department: 'Radiology',
      expertise: ['AI/ML', 'Medical Imaging'],
      email: 'jane.smith@example.com'
    },
    // Add more mock data as needed
  ].filter(member => 
    member.name.toLowerCase().includes(query.toLowerCase()) ||
    member.department.toLowerCase().includes(query.toLowerCase())
  );
};

interface TeamManagementProps {
  value: TeamMember[];
  onChange: (members: TeamMember[]) => void;
}

export const TeamManagement: React.FC<TeamManagementProps> = ({ value, onChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const search = async () => {
      if (searchQuery.length >= 2) {
        const results = await searchMDM(searchQuery);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    };
    search();
  }, [searchQuery]);

  const handleAddMember = (member: TeamMember) => {
    setSelectedMember(member);
    setDialogOpen(true);
  };

  const handleSaveMember = (role: StudyRole, responsibilities: string) => {
    if (selectedMember) {
      const newMember = {
        ...selectedMember,
        role,
        responsibilities
      };
      onChange([...value, newMember]);
    }
    setDialogOpen(false);
    setSelectedMember(null);
  };

  return (
    <Box>
      <TextField
        fullWidth
        label="Search for team members"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Type to search the MDM database..."
        sx={{ mb: 2 }}
      />

      {searchResults.length > 0 && (
        <List>
          {searchResults.map((member) => (
            <ListItem
              key={member.id}
              secondaryAction={
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => handleAddMember(member)}
                >
                  Add to Team
                </Button>
              }
            >
              <ListItemAvatar>
                <Avatar>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={member.name}
                secondary={`${member.title} - ${member.department}`}
              />
            </ListItem>
          ))}
        </List>
      )}

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Current Team Members
      </Typography>

      <List>
        {value.map((member) => (
          <ListItem key={member.id}>
            <ListItemAvatar>
              <Avatar>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={member.name}
              secondary={
                <Box>
                  <Typography variant="body2">
                    {member.role?.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.responsibilities}
                  </Typography>
                </Box>
              }
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                onClick={() => {/* Handle edit */}}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                onClick={() => {/* Handle delete */}}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Add Team Member</DialogTitle>
        <DialogContent>
          {/* Add role selection and responsibilities form */}
        </DialogContent>
      </Dialog>
    </Box>
  );
}; 