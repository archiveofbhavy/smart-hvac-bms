import React, { useEffect, useState } from "react";
import { Box, Card, Table, TableBody, TableCell, TableHead, TableRow, Chip, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { bmsDataService } from "../../services/bmsDataService";

const Events = () => {
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

  const getSeverityChip = (severity) => {
    if (severity === "info") return <Chip label="NORMAL" size="small" color="success" sx={{ fontWeight: 700, fontSize: "0.65rem" }} />;
    if (severity === "warning") return <Chip label="DELAY / TRANSITION" size="small" color="warning" sx={{ fontWeight: 700, fontSize: "0.65rem" }} />;
    if (severity === "error") return <Chip label="FAULT / UNHEALTHY" size="small" color="error" sx={{ fontWeight: 700, fontSize: "0.65rem" }} />;
    return <Chip label="LOG" size="small" sx={{ fontWeight: 700, fontSize: "0.65rem" }} />;
  };

  return (
    <Box p={2.5}>
      <Header
        title="BMS EVENTS LOG"
        subtitle="Chronological audit log of AI occupancy detections, HVAC transitions, and hardware telemetry events"
      />

      <Card sx={{ backgroundColor: colors.primary[400], borderRadius: "4px", mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: colors.primary[500] }}>
              <TableCell sx={{ color: colors.grey[100], fontWeight: 700 }}>Timestamp</TableCell>
              <TableCell sx={{ color: colors.grey[100], fontWeight: 700 }}>Room Zone</TableCell>
              <TableCell sx={{ color: colors.grey[100], fontWeight: 700 }}>AI Perception / Event Details</TableCell>
              <TableCell sx={{ color: colors.grey[100], fontWeight: 700 }}>HVAC System Response</TableCell>
              <TableCell sx={{ color: colors.grey[100], fontWeight: 700 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((evt) => (
              <TableRow key={evt.id} hover>
                <TableCell sx={{ color: colors.grey[200], fontFamily: "monospace" }}>{evt.timestamp}</TableCell>
                <TableCell sx={{ color: colors.greenAccent[400], fontWeight: 700 }}>{evt.roomName}</TableCell>
                <TableCell sx={{ color: colors.grey[100] }}>{evt.message}</TableCell>
                <TableCell sx={{ color: colors.grey[300], fontStyle: "italic" }}>{evt.hvacResponse}</TableCell>
                <TableCell>{getSeverityChip(evt.severity)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </Box>
  );
};

export default Events;
