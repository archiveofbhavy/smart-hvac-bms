import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent, Chip, Button, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { bmsDataService } from "../../services/bmsDataService";
import RefreshIcon from "@mui/icons-material/Refresh";

const SystemHealth = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [healthData, setHealthData] = useState(null);

  const loadHealth = async () => {
    const data = await bmsDataService.getPipelineHealth();
    setHealthData(data);
  };

  useEffect(() => {
    loadHealth();
  }, []);

  if (!healthData) return <Box p={3}>Loading System Health...</Box>;

  return (
    <Box p={2.5}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Header
          title="SYSTEM PIPELINE HEALTH"
          subtitle="Status monitoring across the 6-stage computer vision HVAC hardware pipeline"
        />
        <Button variant="outlined" size="small" startIcon={<RefreshIcon />} onClick={loadHealth} sx={{ color: colors.grey[100] }}>
          Refresh Status
        </Button>
      </Box>

      {/* OVERALL STATUS BANNER */}
      <Box p={2} mb={3} backgroundColor={colors.primary[400]} borderRadius="4px" borderLeft={`5px solid ${healthData.status === "HEALTHY" ? colors.greenAccent[500] : "#f2b01e"}`}>
        <Typography variant="h5" fontWeight="bold" color={colors.grey[100]} mb={0.5}>
          Overall System Status: {healthData.status}
        </Typography>
        <Typography variant="body2" color={colors.grey[300]}>
          Last telemetry heartbeat: {healthData.lastHeartbeat}. Pipeline stages: Camera ➔ YOLO ➔ HVAC Logic ➔ MQTT ➔ ESP ➔ HVAC.
        </Typography>
      </Box>

      {/* 6 PIPELINE STAGE CARDS */}
      <Grid container spacing={2}>
        {healthData.nodes.map((node, idx) => (
          <Grid item xs={12} sm={6} md={4} key={node.key}>
            <Card sx={{ backgroundColor: colors.primary[400], borderRadius: "4px" }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6" fontWeight="bold" color={colors.grey[100]}>
                    Stage {idx + 1}: {node.label}
                  </Typography>
                  <Chip
                    label={node.status}
                    size="small"
                    color={node.status === "ONLINE" ? "success" : node.status === "WARNING" ? "warning" : "error"}
                    sx={{ fontWeight: 800, fontSize: "0.7rem" }}
                  />
                </Box>
                <Typography variant="body2" color={colors.grey[300]}>
                  {node.info}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SystemHealth;
