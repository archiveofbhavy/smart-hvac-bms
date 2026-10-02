import { useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import VideocamIcon from "@mui/icons-material/Videocam";
import ListAltIcon from "@mui/icons-material/ListAlt";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import SensorsIcon from "@mui/icons-material/Sensors";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { bmsDataService } from "../../services/bmsDataService";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === to}
      style={{ color: colors.grey[100] }}
      onClick={() => setSelected(to)}
      icon={icon}
    >
      <Typography variant="body2" fontWeight={500}>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState(location.pathname);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    async function loadRooms() {
      const roomList = await bmsDataService.getRooms();
      setRooms(roomList);
    }
    loadRooms();
  }, []);

  useEffect(() => {
    setSelected(location.pathname);
  }, [location.pathname]);

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "6px 20px 6px 15px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
          backgroundColor: "rgba(104, 112, 250, 0.1) !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* MENU COLLAPSE HEADER */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 10px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box display="flex" justifyContent="space-between" alignItems="center" ml="10px">
                <Typography variant="h5" fontWeight="bold" color={colors.grey[100]}>
                  VMS MONITOR
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)} size="small">
                  <MenuOutlinedIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {/* LIVE SECTION */}
          <Box paddingLeft={isCollapsed ? undefined : "5%"}>
            <Typography
              variant="caption"
              color={colors.grey[400]}
              sx={{ m: "10px 0 5px 15px", display: "block", fontWeight: 700, letterSpacing: 1 }}
            >
              LIVE
            </Typography>

            <Item
              title="Live Monitor"
              to="/"
              icon={<VideocamIcon fontSize="small" />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Events Log"
              to="/events"
              icon={<ListAltIcon fontSize="small" />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* ROOMS DIRECTORY SECTION (DYNAMIC FROM SERVICE) */}
            <Typography
              variant="caption"
              color={colors.grey[400]}
              sx={{ m: "15px 0 5px 15px", display: "block", fontWeight: 700, letterSpacing: 1 }}
            >
              ROOMS
            </Typography>

            {rooms.map((rm) => (
              <Item
                key={rm.id}
                title={rm.name}
                to={`/room/${rm.id}`}
                icon={<MeetingRoomIcon fontSize="small" />}
                selected={selected}
                setSelected={setSelected}
              />
            ))}

            {/* SYSTEM SECTION */}
            <Typography
              variant="caption"
              color={colors.grey[400]}
              sx={{ m: "15px 0 5px 15px", display: "block", fontWeight: 700, letterSpacing: 1 }}
            >
              SYSTEM
            </Typography>

            <Item
              title="System Pipeline Health"
              to="/system-health"
              icon={<SensorsIcon fontSize="small" />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
