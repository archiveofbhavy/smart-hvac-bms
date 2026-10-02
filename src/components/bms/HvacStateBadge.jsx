import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import TimerIcon from "@mui/icons-material/Timer";
import PowerOffIcon from "@mui/icons-material/PowerOff";

const HvacStateBadge = ({ hvacState, decisionLogic, showLogic = true }) => {
  let chipColor = "default";
  let icon = <PowerOffIcon />;
  let labelText = "HVAC: OFF";

  if (hvacState === "ON") {
    chipColor = "info";
    icon = <PowerSettingsNewIcon />;
    labelText = "HVAC: ON (Active)";
  } else if (hvacState === "DELAY_TIMER") {
    chipColor = "warning";
    icon = <TimerIcon />;
    labelText = "HVAC: DELAY TIMER";
  } else if (hvacState === "OFF") {
    chipColor = "default";
    icon = <PowerOffIcon />;
    labelText = "HVAC: OFF";
  }

  return (
    <Box display="flex" flexDirection="column" gap={0.5}>
      <Box display="flex" alignItems="center" gap={1}>
        <Chip
          icon={icon}
          label={labelText}
          color={chipColor}
          sx={{ fontWeight: 600, fontSize: "0.85rem" }}
        />
      </Box>
      {showLogic && decisionLogic && (
        <Typography variant="caption" sx={{ color: "#a3a3a3", fontSize: "0.75rem" }}>
          <strong>Logic:</strong> {decisionLogic}
        </Typography>
      )}
    </Box>
  );
};

export default HvacStateBadge;
