import React from "react";
import { Box, Typography, Tooltip } from "@mui/material";
import SensorsIcon from "@mui/icons-material/Sensors";

const PipelineStatusIndicator = ({ status = "HEALTHY" }) => {
  const isHealthy = status === "HEALTHY";
  const isDegraded = status === "DEGRADED";

  const color = isHealthy ? "#4cceac" : isDegraded ? "#f2b01e" : "#db4f4a";
  const statusText = isHealthy ? "Pipeline Online" : isDegraded ? "Pipeline Degraded (1 Node Warning)" : "Pipeline Disconnected";

  return (
    <Tooltip title={`System Pipeline Health: ${statusText}`}>
      <Box display="flex" alignItems="center" gap={1} sx={{ cursor: "pointer", px: 1.5, py: 0.5, borderRadius: 1, backgroundColor: "rgba(255, 255, 255, 0.05)" }}>
        <SensorsIcon sx={{ color: color, fontSize: 18 }} />
        <Typography variant="body2" sx={{ color: color, fontWeight: 600, fontSize: "0.8rem" }}>
          {statusText}
        </Typography>
      </Box>
    </Tooltip>
  );
};

export default PipelineStatusIndicator;
