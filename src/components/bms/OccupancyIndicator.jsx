import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonOffIcon from "@mui/icons-material/PersonOff";

const OccupancyIndicator = ({ estimatedCount, occupancyState, showDetails = true }) => {
  const isOccupied = occupancyState === "OCCUPIED" || estimatedCount > 0;
  
  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Chip
        icon={isOccupied ? <GroupsIcon /> : <PersonOffIcon />}
        label={
          isOccupied
            ? `AI Count: ~${estimatedCount} (${occupancyState})`
            : `AI Count: 0 (${occupancyState})`
        }
        color={isOccupied ? "success" : "default"}
        variant={isOccupied ? "filled" : "outlined"}
        sx={{
          fontWeight: 600,
          fontSize: "0.85rem",
          paddingX: 0.5,
        }}
      />
      {showDetails && (
        <Typography variant="caption" color="textSecondary" sx={{ fontStyle: "italic" }}>
          (Vision estimate)
        </Typography>
      )}
    </Box>
  );
};

export default OccupancyIndicator;
