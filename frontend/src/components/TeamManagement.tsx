import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
} from '@mui/material';
import {
  Person as PersonIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import type { TeamMember, StudyRole } from '../types';
import { STUDY_ROLES } from '../config/formConfig';

interface TeamManagementProps {
  value: TeamMember[];
  onChange: (members: TeamMember[]) => void;
}

interface AddMemberDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (member: TeamMember) => void;
}

const AddMemberDialog: React.FC<AddMemberDialogProps> = ({ open, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<StudyRole | undefined>();

  const handleAdd = () => {
    if (name && selectedRole) {
      onAdd({
        id: Math.random().toString(36).substr(2, 9),
        name,
        role: selectedRole,
        title: '',
        department: '',
        expertise: [],
        email: ''
      });
      setName('');
      setSelectedRole(undefined);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Team Member</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter team member's name"
          />
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={selectedRole?.id || ''}
              onChange={(e) => {
                const role = STUDY_ROLES.find(r => r.id === e.target.value);
                setSelectedRole(role);
              }}
              label="Role"
            >
              {STUDY_ROLES.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleAdd}
          variant="contained" 
          disabled={!name || !selectedRole}
        >
          Add Member
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const TeamManagement: React.FC<TeamManagementProps> = ({ value = [], onChange }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDelete = (memberId: string) => {
    onChange(value.filter(member => member.id !== memberId));
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Add Team Member
        </Button>
      </Box>

      <List>
        {value.map((member) => (
          <ListItem
            key={member.id}
            sx={{
              bgcolor: 'background.paper',
              mb: 1,
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <ListItemAvatar>
              <Avatar>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={member.name}
              secondary={member.role?.label || 'No role assigned'}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                onClick={() => handleDelete(member.id)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <AddMemberDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdd={(newMember) => {
          onChange([...value, newMember]);
        }}
      />
    </Box>
  );
};

export default TeamManagement; 