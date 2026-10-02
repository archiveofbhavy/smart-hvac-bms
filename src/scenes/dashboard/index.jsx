import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardActionArea, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import ReactPlayer from "react-player";
import { useNavigate } from "react-router-dom";
import { bmsDataService } from "../../services/bmsDataService";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    async function loadData() {
      const roomData = await bmsDataService.getRooms();
      setRooms(roomData);
    }
    loadData();
  }, []);

  const getHvacBadgeStyle = (state) => {
    if (state === "ON") return { bg: colors.greenAccent[600], text: "#fff", label: "HVAC: ON" };
    if (state === "DELAY_TIMER") return { bg: "#f2b01e", text: "#000", label: "HVAC: DELAY" };
    return { bg: colors.primary[500], text: colors.grey[300], label: "HVAC: OFF" };
  };

  return (
    <Box p={2.5}>
      {/* VMS TITLE & STATUS HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color={colors.grey[100]}>
            LIVE ROOM MONITOR
          </Typography>
          <Typography variant="body2" color={colors.grey[300]}>
            Click any camera tile to open Room Inspector & historical logs
          </Typography>
        </Box>
      </Box>

      {/* VMS ROOM TILES GRID */}
      <Grid container spacing={2.5}>
        {rooms.map((room) => {
          const hvacStyle = getHvacBadgeStyle(room.hvacState);
          const isOccupied = room.occupancyState === "OCCUPIED" || room.estimatedCount > 0;

          return (
            <Grid item xs={12} sm={6} md={6} lg={6} key={room.id}>
              <Card
                sx={{
                  backgroundColor: colors.primary[400],
                  border: `1px solid ${room.hvacState === "ON" ? colors.greenAccent[500] : room.hvacState === "DELAY_TIMER" ? "#f2b01e" : colors.primary[500]}`,
                  borderRadius: "4px",
                  transition: "transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `0 4px 12px rgba(0, 0, 0, 0.4)`,
                  },
                }}
              >
                <CardActionArea onClick={() => navigate(`/room/${room.id}`)}>
                  {/* ROOM TILE HEADER */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    px={2}
                    py={1}
                    backgroundColor={colors.primary[500]}
                    borderBottom={`1px solid ${colors.primary[600]}`}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="h6" fontWeight="bold" color={colors.grey[100]}>
                        {room.id.toUpperCase().replace("-", " ")}
                      </Typography>
                      <Typography variant="body2" color={colors.grey[300]}>
                        — {room.name}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color={colors.grey[400]}>
                      {room.floor}
                    </Typography>
                  </Box>

                  {/* DOMINANT CAMERA FEED VIEW */}
                  <Box sx={{ position: "relative", height: "240px", backgroundColor: "#000" }}>
                    <ReactPlayer
                      url={room.videoUrl}
                      width="100%"
                      height="100%"
                      playing
                      muted
                      loop
                      controls={false}
                    />

                    {/* TOP-LEFT OVERLAY: PERCEPTION TAG */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        px: 1,
                        py: 0.5,
                        borderRadius: "3px",
                        border: `1px solid ${colors.greenAccent[500]}`,
                      }}
                    >
                      <Typography variant="caption" sx={{ color: colors.greenAccent[400], fontWeight: 700 }}>
                        AI VISION FEED
                      </Typography>
                    </Box>

                    {/* TOP-RIGHT OVERLAY: HVAC STATE BADGE */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        backgroundColor: hvacStyle.bg,
                        color: hvacStyle.text,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: "3px",
                        fontWeight: 800,
                        fontSize: "0.8rem",
                        letterSpacing: 0.5,
                      }}
                    >
                      {hvacStyle.label}
                    </Box>
                  </Box>

                  {/* TILE FOOTER: AI OCCUPANCY & DECISION REASON */}
                  <Box p={2} display="flex" flexDirection="column" gap={1}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      {/* AI OCCUPANCY */}
                      <Box>
                        <Typography variant="caption" color={colors.grey[400]} display="block">
                          AI OCCUPANCY (Vision Estimate)
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          sx={{ color: isOccupied ? colors.greenAccent[400] : colors.grey[300] }}
                        >
                          ~{room.estimatedCount} PEOPLE &nbsp;
                          <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>
                            ({room.occupancyState})
                          </span>
                        </Typography>
                      </Box>

                      {/* DECISION REASON BANNER */}
                      <Box
                        textAlign="right"
                        px={1.5}
                        py={0.75}
                        backgroundColor={colors.primary[500]}
                        borderRadius="3px"
                        borderLeft={`3px solid ${hvacStyle.bg}`}
                      >
                        <Typography variant="caption" color={colors.grey[400]} display="block">
                          DECISION REASON
                        </Typography>
                        <Typography variant="body2" fontWeight="600" color={colors.grey[100]}>
                          {room.decisionLogic}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default Dashboard;
