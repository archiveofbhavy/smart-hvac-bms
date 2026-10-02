import { Box, IconButton, useTheme, Typography, Chip } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { bmsDataService } from "../../services/bmsDataService";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [summary, setSummary] = useState({ total: 4, occupied: 2, hvacOn: 2, faults: 0 });

  useEffect(() => {
    async function loadSummary() {
      const rooms = await bmsDataService.getRooms();
      const total = rooms.length;
      const occupied = rooms.filter((r) => r.occupancyState === "OCCUPIED").length;
      const hvacOn = rooms.filter((r) => r.hvacState === "ON").length;
      const faults = rooms.filter((r) => r.pipeline && Object.values(r.pipeline).includes("OFFLINE")).length;
      setSummary({ total, occupied, hvacOn, faults });
    }
    loadSummary();
  }, []);

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" px={3} py={1.5} backgroundColor={colors.primary[400]} borderBottom={`1px solid ${colors.primary[500]}`}>
      {/* LEFT: APP BRAND + LIVE SYSTEM STATUS */}
      <Box display="flex" alignItems="center" gap={2}>
        <Typography variant="h4" fontWeight="bold" color={colors.grey[100]} letterSpacing={0.5}>
          SMART HVAC BMS
        </Typography>
        <Chip
          label="● SYSTEM ONLINE"
          size="small"
          sx={{
            backgroundColor: "rgba(76, 206, 172, 0.15)",
            color: colors.greenAccent[400],
            border: `1px solid ${colors.greenAccent[500]}`,
            fontWeight: 700,
            fontSize: "0.75rem",
          }}
        />
      </Box>

      {/* RIGHT: COMPACT SUMMARY TEXT & THEME TOGGLE */}
      <Box display="flex" alignItems="center" gap={2}>
        <Typography variant="body2" sx={{ fontFamily: "monospace", color: colors.grey[200], fontSize: "0.85rem" }}>
          <strong>{summary.total}</strong> ROOMS &nbsp;|&nbsp; 
          <span style={{ color: colors.greenAccent[400] }}><strong>{summary.occupied}</strong> OCCUPIED</span> &nbsp;|&nbsp; 
          <span style={{ color: "#6870fa" }}><strong>{summary.hvacOn}</strong> HVAC ON</span> &nbsp;|&nbsp; 
          <span style={{ color: summary.faults > 0 ? colors.redAccent[400] : colors.grey[400] }}><strong>{summary.faults}</strong> FAULTS</span>
        </Typography>

        <IconButton onClick={colorMode.toggleColorMode} size="small">
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon fontSize="small" />
          ) : (
            <LightModeOutlinedIcon fontSize="small" />
          )}
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
