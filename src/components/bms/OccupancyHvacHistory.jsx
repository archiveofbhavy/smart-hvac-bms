import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { ResponsiveLine } from "@nivo/line";
import { tokens } from "../../theme";

const OccupancyHvacHistory = ({ historicalData = [] }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (!historicalData || historicalData.length === 0) {
    return (
      <Box p={2} color={colors.grey[300]}>
        No historical data available for this room.
      </Box>
    );
  }

  // 1. Prepare Single Line Data for AI Estimated Occupancy
  const lineData = [
    {
      id: "AI Estimated Occupancy",
      color: colors.greenAccent[400],
      data: historicalData.map((d) => ({
        x: d.time,
        y: d.occupancyCount,
      })),
    },
  ];

  // Helper to get state styling for the bottom HVAC timeline band
  const getHvacStateBlock = (hvacNum) => {
    if (hvacNum === 1) return { label: "ON", color: colors.greenAccent[600], textColor: "#fff" };
    if (hvacNum === 0.5) return { label: "DELAY", color: "#f2b01e", textColor: "#000" };
    return { label: "OFF", color: colors.primary[500], textColor: colors.grey[400] };
  };

  return (
    <Box p={2.5} backgroundColor={colors.primary[400]} borderRadius="4px">
      <Typography variant="h5" fontWeight="bold" color={colors.grey[100]} mb={2}>
        Occupancy & HVAC History
      </Typography>

      {/* TOP TIMELINE — AI ESTIMATED OCCUPANCY */}
      <Box mb={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="body1" fontWeight="600" color={colors.greenAccent[400]}>
            AI Estimated Occupancy
          </Typography>
          <Typography variant="caption" color={colors.grey[300]}>
            Y-Axis: People | X-Axis: Time
          </Typography>
        </Box>

        <Box height="210px">
          <ResponsiveLine
            data={lineData}
            theme={{
              axis: {
                domain: { line: { stroke: colors.grey[400] } },
                legend: { text: { fill: colors.grey[200], fontWeight: 600 } },
                ticks: {
                  line: { stroke: colors.grey[400], strokeWidth: 1 },
                  text: { fill: colors.grey[200], fontSize: 11, fontWeight: 600 },
                },
              },
              grid: { line: { stroke: colors.primary[500], strokeDasharray: "4 4" } },
              tooltip: { container: { color: colors.primary[500], fontSize: 12 } },
            }}
            colors={[colors.greenAccent[400]]}
            margin={{ top: 15, right: 40, bottom: 45, left: 55 }}
            xScale={{ type: "point" }}
            yScale={{ type: "linear", min: 0, max: "auto" }}
            curve="monotoneX"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: "bottom",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Time",
              legendOffset: 36,
              legendPosition: "middle",
            }}
            axisLeft={{
              orient: "left",
              tickSize: 3,
              tickPadding: 5,
              legend: "People",
              legendOffset: -40,
              legendPosition: "middle",
            }}
            enableGridX={false}
            enableGridY={true}
            pointSize={8}
            pointColor={colors.greenAccent[500]}
            pointBorderWidth={2}
            pointBorderColor={colors.primary[400]}
            useMesh={true}
          />
        </Box>
      </Box>

      {/* BOTTOM TIMELINE — HVAC STATE (HORIZONTALLY ALIGNED TO SAME TIME SLOTS) */}
      <Box mt={1} pt={2} borderTop={`1px solid ${colors.primary[500]}`}>
        <Typography variant="body1" fontWeight="600" color={colors.grey[100]} mb={1.5}>
          HVAC State
        </Typography>

        {/* TIMELINE STATE BANDS CONTAINER (ALIGNED WITH EXACT SAME MARGINS: LEFT 55px, RIGHT 40px) */}
        <Box display="flex" ml="55px" mr="40px">
          {historicalData.map((step, idx) => {
            const stateInfo = getHvacStateBlock(step.hvacStateNum);
            return (
              <Box
                key={idx}
                flex={1}
                textAlign="center"
                sx={{ borderRight: idx < historicalData.length - 1 ? `1px solid ${colors.primary[600]}` : "none" }}
              >
                {/* STATE BLOCK WITH CLEAR TEXT (ON / OFF / DELAY) */}
                <Box
                  py={1}
                  mb={1}
                  backgroundColor={stateInfo.color}
                  color={stateInfo.textColor}
                  fontWeight={800}
                  fontSize="0.75rem"
                  borderRadius="2px"
                  sx={{ mx: 0.5 }}
                >
                  {stateInfo.label}
                </Box>
                {/* TIME TICK MATCHING TOP AXIS */}
                <Typography variant="caption" color={colors.grey[300]} sx={{ fontFamily: "monospace", fontWeight: 600 }}>
                  {step.time}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default OccupancyHvacHistory;
