import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme, Chip } from "@mui/material";
import { tokens } from "../theme";
import { bmsDataService } from "../services/bmsDataService";

const RecentAlerts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function loadEvents() {
      const data = await bmsDataService.getRecentEvents();
      setEvents(data);
    }
    loadEvents();
  }, []);

  const getSeverityBadgeColor = (severity) => {
    if (severity === "info") return colors.greenAccent[600];
    if (severity === "warning") return "#f2b01e";
    if (severity === "error") return colors.redAccent[600];
    return colors.primary[300];
  };

  return (
    <Box
      gridColumn="span 4"
      gridRow="span 2"
      backgroundColor={colors.primary[400]}
      overflow="auto"
      borderRadius="4px"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        borderBottom={`4px solid ${colors.primary[500]}`}
        p="15px"
      >
        <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
          Real-Time Operational Events
        </Typography>
        <Typography variant="caption" color={colors.grey[300]}>
          Occupancy & HVAC Triggers
        </Typography>
      </Box>

      {events.map((evt) => (
        <Box
          key={evt.id}
          display="flex"
          flexDirection="column"
          gap={0.5}
          borderBottom={`2px solid ${colors.primary[500]}`}
          p="12px 15px"
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography color={colors.greenAccent[400]} fontWeight="600" variant="body2">
              {evt.roomName}
            </Typography>
            <Typography variant="caption" color={colors.grey[400]}>
              {evt.timestamp}
            </Typography>
          </Box>

          <Typography color={colors.grey[100]} variant="body2">
            {evt.message}
          </Typography>

          <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
            <Typography variant="caption" color={colors.grey[300]} sx={{ fontStyle: "italic" }}>
              ↳ {evt.hvacResponse}
            </Typography>
            <Chip
              label={evt.type.replace(/_/g, " ")}
              size="small"
              sx={{
                backgroundColor: getSeverityBadgeColor(evt.severity),
                color: "#fff",
                fontSize: "0.65rem",
                fontWeight: 700,
              }}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default RecentAlerts;
