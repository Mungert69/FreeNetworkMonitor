import React from "react";
import {
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import { useAppearance } from "./ApplicationTheme";

const choices = [
  ["system", "System", SettingsBrightnessIcon],
  ["light", "Light", LightModeIcon],
  ["dark", "Dark", DarkModeIcon],
];
export default function AppearanceMenu() {
  const { preference, mode, setPreference } = useAppearance();
  const [anchor, setAnchor] = React.useState(null);
  const menuId = React.useId();
  const Icon =
    preference === "system"
      ? SettingsBrightnessIcon
      : mode === "dark"
        ? DarkModeIcon
        : LightModeIcon;
  return (
    <>
      <Tooltip title={`Appearance: ${preference}`}>
        <IconButton
          color="inherit"
          aria-label={`Appearance: ${preference}`}
          aria-haspopup="menu"
          aria-expanded={!!anchor}
          aria-controls={anchor ? menuId : undefined}
          onClick={(event) => setAnchor(event.currentTarget)}
          sx={{ flexShrink: 0 }}
        >
          <Icon />
        </IconButton>
      </Tooltip>
      <Menu
        id={menuId}
        anchorEl={anchor}
        open={!!anchor}
        onClose={() => setAnchor(null)}
      >
        {choices.map(([value, label, ChoiceIcon]) => (
          <MenuItem
            key={value}
            selected={preference === value}
            onClick={() => {
              setPreference(value);
              setAnchor(null);
            }}
          >
            <ListItemIcon>
              <ChoiceIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
