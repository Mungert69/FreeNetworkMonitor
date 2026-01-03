// File: src/components/EditHostDialog.js

import { useTheme, createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  IconButton,
  InputAdornment,
  useMediaQuery,
} from '@mui/material';


const getMuiTheme = (isSmallScreen) => createTheme({
  palette: {
    background: {
      paper: "#f8fafb", // match dashboard paper background
    },
    text: {
      primary: "#222", // match dashboard text
      secondary: "#607466",
    },
    primary: {
      main: "#6239AB",
      light: "#8e6be0",
      dark: "#3d206e",
      contrastText: "#fff"
    },
    secondary: {
      main: "#607466",
      light: "#8fa39c",
      dark: "#3b4a3e",
      contrastText: "#fff"
    }
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#f8fafb",
          color: "#222",
        }
      }
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          color: "#222", // Use primary text color
          fontWeight: 700,
          fontSize: isSmallScreen ? "1.1rem" : "1.3rem",
          background: "linear-gradient(90deg, #f8fafb 80%, #ede7f6 100%)",
        }
      }
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          backgroundColor: "#f8fafb",
          color: "#222",
        }
      }
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          backgroundColor: "#f8fafb",
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: isSmallScreen ? "0.94rem" : undefined,
          backgroundColor: "#fff",
          color: "#222",
        },
        input: {
          fontSize: isSmallScreen ? "0.94rem" : undefined,
          backgroundColor: "#fff",
          color: "#222",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: isSmallScreen ? "0.94rem" : undefined,
          color: "#222",
          backgroundColor: "#fff",
          '&.Mui-selected': {
            backgroundColor: "#ede7f6 !important",
            color: "#6239AB",
          },
          '&:hover': {
            backgroundColor: "#ede7f6",
            color: "#6239AB",
          }
        }
      }
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: isSmallScreen ? "4px" : undefined,
          color: "#6239AB",
          '&.Mui-checked': {
            color: "#607466",
          }
        }
      }
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          marginBottom: 0,
          color: "#607466",
        },
      }
    },
   
  }
});

const EditHostDialog = ({
  open,
  onClose,
  host,
  endpointTypes,
  processorList,
  onSave,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [editedHost, setEditedHost] = useState({ ...host });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (host) {
      setEditedHost({
        ...host,
        username: host.username ?? '',
        password: host.password ?? '',
        args: host.args ?? '',
      });
    }
  }, [host]);

  if (!host) return null;

  const handleChange = (field, value) => {
    setEditedHost((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(editedHost);
  };

  return (
    <ThemeProvider theme={getMuiTheme(isSmallScreen)}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Host</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Host Address */}
            <Grid item xs={12}>
              <TextField
                label="Host Address"
                value={editedHost.address}
                onChange={(e) => handleChange('address', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                placeholder="Enter host address"
                margin="dense"
              />
            </Grid>

            {/* Endpoint Type */}
            <Grid item xs={12}>
              <TextField
                label="Endpoint Type"
                value={editedHost.endPointType ?? ''}
                onChange={(e) => handleChange('endPointType', e.target.value)}
                fullWidth
                select
                SelectProps={{
                  displayEmpty: true,
                }}
                InputLabelProps={{ shrink: true }}
                margin="dense"
              >
                <MenuItem value="">
                  <em>Select Endpoint Type</em>
                </MenuItem>
                {(endpointTypes ?? []).map((type) => (
                  <MenuItem key={type.internalType} value={type.internalType}>
                    {type.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Timeout */}
            <Grid item xs={6}>
              <TextField
                label="Timeout"
                type="number"
                value={editedHost.timeout}
                onChange={(e) => handleChange('timeout', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                placeholder="Enter timeout"
                margin="dense"
              />
            </Grid>

            {/* Port */}
            <Grid item xs={6}>
              <TextField
                label="Port"
                type="number"
                value={editedHost.port}
                onChange={(e) => handleChange('port', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                placeholder="Enter port"
                margin="dense"
              />
            </Grid>

            {/* Enabled */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editedHost.enabled}
                    onChange={(e) => handleChange('enabled', e.target.checked)}
                  />
                }
                label="Enabled"
              />
            </Grid>

            {/* Username */}
            <Grid item xs={12}>
              <TextField
                label="Username"
                value={editedHost.username}
                onChange={(e) => handleChange('username', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                placeholder="Optional username or identifier"
                margin="dense"
              />
            </Grid>

            {/* Password / Key */}
            <Grid item xs={12}>
              <TextField
                label="Password / Key"
                type={showPassword ? 'text' : 'password'}
                value={editedHost.password}
                onChange={(e) => handleChange('password', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                placeholder="Optional password or key"
                margin="dense"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Args */}
            <Grid item xs={12}>
              <TextField
                label="Args"
                value={editedHost.args}
                onChange={(e) => handleChange('args', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                placeholder="Extra command-style arguments"
                margin="dense"
              />
            </Grid>

            {/* Monitor Location */}
            <Grid item xs={12}>
              <TextField
                label="Monitor Location"
                value={editedHost.appID ?? ''}
                onChange={(e) => handleChange('appID', e.target.value)}
                fullWidth
                select
                SelectProps={{
                  displayEmpty: true,
                }}
                InputLabelProps={{ shrink: true }}
                margin="dense"
              >
                <MenuItem value="">
                  <em>Select Monitor Location</em>
                </MenuItem>
                {(processorList ?? [])
                  .filter((row) => {
                    const disabledTypes = (row.disabledEndPointTypes || []).map((type) =>
                      String(type ?? '').toLowerCase(),
                    );
                    const normalizedEndpoint = String(editedHost.endPointType ?? '').toLowerCase();
                    return (
                      !row.isAtMaxLoad &&
                      (disabledTypes.length === 0 || !disabledTypes.includes(normalizedEndpoint))
                    );
                  })
                  .map((row) => (
                    <MenuItem key={row.appID} value={row.appID}>
                      {row.location}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default EditHostDialog;
