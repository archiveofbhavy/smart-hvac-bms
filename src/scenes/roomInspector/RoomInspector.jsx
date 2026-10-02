import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Grid, Card, CardContent, Chip, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import ReactPlayer from "react-player";
import { bmsDataService } from "../../services/bmsDataService";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OccupancyHvacHistory from "../../components/bms/OccupancyHvacHistory";

const RoomInspector = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [room, setRoom] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function loadRoom() {
      const roomData = await bmsDataService.getRoomById(roomId || "room-101");
      const historyData = await bmsDataService.getHistoricalData(roomId || "room-101");
      setRoom(roomData);
      setHistory(historyData);
    }
    loadRoom();
  }, [roomId]);

  if (!room) return <Box p={3}>Loading room inspection details...</Box>;

  const getHvacBadgeStyle = (state) => {
    if (state === "ON") return { bg: colors.greenAccent[600], text: "#fff", label: "HVAC: ON" };
    if (state === "DELAY_TIMER") return { bg: "#f2b01e", text: "#000", label: "HVAC: DELAY" };
    return { bg: colors.primary[500], text: colors.grey[300], label: "HVAC: OFF" };
  };

  const hvacStyle = getHvacBadgeStyle(room.hvacState);

  return (
    <Box p={2.5}>
      {/* ROOM HEADER WITH BACK BUTTON */}
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate("/")}
          startIcon={<ArrowBackIcon />}
          sx={{ color: colors.grey[100], borderColor: colors.grey[500] }}
        >
          Back to Live Monitor
        </Button>
        <Box>
          <Typography variant="h4" fontWeight="bold" color={colors.grey[100]}>
            {room.id.toUpperCase().replace("-", " ")} — {room.name.toUpperCase()}
          </Typography>
          <Typography variant="body2" color={colors.grey[300]}>
            {room.building} ({room.floor})
          </Typography>
        </Box>
      </Box>

      {/* TOP GRID: LARGE LIVE CAMERA FEED (LEFT) & AI PERCEPTION + HVAC CONTROL (RIGHT) */}
      <Grid container spacing={2.5} mb={3}>
        {/* LARGE CAMERA FEED */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ backgroundColor: colors.primary[400], borderRadius: "4px" }}>
            <Box sx={{ position: "relative", height: "380px", backgroundColor: "#000" }}>
              <ReactPlayer
                url={room.videoUrl}
                width="100%"
                height="100%"
                playing
                controls
                muted
                loop
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "3px",
                  border: `1px solid ${colors.greenAccent[500]}`,
                }}
              >
                <Typography variant="caption" sx={{ color: colors.greenAccent[400], fontWeight: 700 }}>
                  YOLO VISION PERCEPTION FEED
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* AI ESTIMATE, HVAC STATE, DECISION RULE & PIPELINE MICRO-BAR */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ backgroundColor: colors.primary[400], height: "100%", borderRadius: "4px" }}>
            <CardContent display="flex" flexDirection="column" gap={2}>
              {/* AI OCCUPANCY */}
              <Box>
                <Typography variant="caption" color={colors.grey[400]} display="block">
                  AI OCCUPANCY (Vision Estimate)
                </Typography>
                <Typography variant="h4" fontWeight="bold" color={colors.greenAccent[400]}>
                  ~{room.estimatedCount} PEOPLE
                </Typography>
                <Chip
                  label={room.occupancyState}
                  size="small"
                  color={room.occupancyState === "OCCUPIED" ? "success" : "default"}
                  sx={{ fontWeight: 700, mt: 0.5 }}
                />
              </Box>

              {/* HVAC STATE */}
              <Box borderTop={`1px solid ${colors.primary[500]}`} pt={1.5}>
                <Typography variant="caption" color={colors.grey[400]} display="block">
                  HVAC STATE
                </Typography>
                <Box
                  display="inline-block"
                  px={2}
                  py={0.5}
                  mt={0.5}
                  borderRadius="3px"
                  backgroundColor={hvacStyle.bg}
                  color={hvacStyle.text}
                  fontWeight={800}
                  fontSize="0.9rem"
                >
                  {hvacStyle.label}
                </Box>
              </Box>

              {/* DECISION RULE */}
              <Box borderTop={`1px solid ${colors.primary[500]}`} pt={1.5}>
                <Typography variant="caption" color={colors.grey[400]} display="block">
                  DECISION REASON
                </Typography>
                <Box p={1.5} mt={0.5} backgroundColor={colors.primary[500]} borderRadius="3px" borderLeft={`4px solid ${hvacStyle.bg}`}>
                  <Typography variant="body2" fontWeight="600" color={colors.grey[100]}>
                    {room.decisionLogic}
                  </Typography>
                  {room.hvacState === "DELAY_TIMER" && (
                    <Typography variant="caption" color="#f2b01e" display="block" mt={0.5} fontWeight={600}>
                      Timer: {room.graceTimerSeconds}s remaining before turning OFF
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* COMPACT ROOM PIPELINE STATUS MICRO-BAR */}
              <Box borderTop={`1px solid ${colors.primary[500]}`} pt={1.5} mt="auto">
                <Typography variant="caption" color={colors.grey[400]} display="block" mb={1}>
                  ROOM PIPELINE TELEMETRY STATUS
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={0.75}>
                  {Object.entries(room.pipeline).map(([nodeKey, nodeStatus]) => (
                    <Chip
                      key={nodeKey}
                      label={`${nodeKey.toUpperCase()}: ${nodeStatus}`}
                      size="small"
                      color={nodeStatus === "ONLINE" ? "success" : nodeStatus === "WARNING" ? "warning" : "error"}
                      variant="outlined"
                      sx={{ fontSize: "0.65rem", fontWeight: 700 }}
                    />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* NEW ROOM OCCUPANCY & HVAC HISTORY SECTION (DUAL HORIZONTALLY ALIGNED TIMELINES) */}
      <OccupancyHvacHistory historicalData={history} />
    </Box>
  );
};

export default RoomInspector;
