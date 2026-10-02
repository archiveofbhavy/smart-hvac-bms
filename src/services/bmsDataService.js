// BMS Centralized Data & Service Layer
// Clean abstraction layer providing mock state for AI Occupancy & HVAC Management.
// Designed for seamless integration with real Python/YOLO/MQTT backends via WebSocket or REST.

const MOCK_ROOMS = [
  {
    id: "room-101",
    name: "CS Computer Lab 101",
    building: "Engineering Building",
    floor: "Floor 1",
    videoUrl: "https://static.videezy.com/system/resources/previews/000/041/016/original/alb_tvn0411_1080p.mp4",
    estimatedCount: 4,
    occupancyState: "OCCUPIED", // OCCUPIED, UNOCCUPIED, TRANSITIONING
    hvacState: "ON", // ON, OFF, DELAY_TIMER, MANUAL_OVERRIDE
    hvacMode: "AUTO",
    decisionLogic: "AI Count = 4 (≥1 threshold) ➔ HVAC ON",
    lastOccupancyChange: "10 mins ago",
    graceTimerSeconds: 0,
    pipeline: {
      camera: "ONLINE",
      yolo: "ONLINE",
      hvacController: "ONLINE",
      mqttBroker: "ONLINE",
      espNode: "ONLINE",
      hvacUnit: "ONLINE",
    },
  },
  {
    id: "room-102",
    name: "Lecture Hall 102",
    building: "Engineering Building",
    floor: "Floor 1",
    videoUrl: "https://static.videezy.com/system/resources/previews/000/004/298/original/22.mp4",
    estimatedCount: 14,
    occupancyState: "OCCUPIED",
    hvacState: "ON",
    hvacMode: "AUTO",
    decisionLogic: "AI Count = 14 (≥1 threshold) ➔ HVAC ON",
    lastOccupancyChange: "25 mins ago",
    graceTimerSeconds: 0,
    pipeline: {
      camera: "ONLINE",
      yolo: "ONLINE",
      hvacController: "ONLINE",
      mqttBroker: "ONLINE",
      espNode: "ONLINE",
      hvacUnit: "ONLINE",
    },
  },
  {
    id: "room-103",
    name: "Seminar Room 201",
    building: "Science Complex",
    floor: "Floor 2",
    videoUrl: "https://static.videezy.com/system/resources/previews/000/041/016/original/alb_tvn0411_1080p.mp4",
    estimatedCount: 0,
    occupancyState: "UNOCCUPIED",
    hvacState: "DELAY_TIMER",
    hvacMode: "AUTO",
    decisionLogic: "AI Count = 0 ➔ 5-Min Grace Period Active (OFF in 02:45)",
    lastOccupancyChange: "2 mins ago",
    graceTimerSeconds: 165,
    pipeline: {
      camera: "ONLINE",
      yolo: "ONLINE",
      hvacController: "ONLINE",
      mqttBroker: "ONLINE",
      espNode: "ONLINE",
      hvacUnit: "ONLINE",
    },
  },
  {
    id: "room-104",
    name: "Conference Room 305",
    building: "Administration Hall",
    floor: "Floor 3",
    videoUrl: "https://static.videezy.com/system/resources/previews/000/004/298/original/22.mp4",
    estimatedCount: 0,
    occupancyState: "UNOCCUPIED",
    hvacState: "OFF",
    hvacMode: "AUTO",
    decisionLogic: "AI Count = 0 ➔ Grace Period Expired ➔ HVAC OFF",
    lastOccupancyChange: "45 mins ago",
    graceTimerSeconds: 0,
    pipeline: {
      camera: "ONLINE",
      yolo: "ONLINE",
      hvacController: "ONLINE",
      mqttBroker: "ONLINE",
      espNode: "OFFLINE", // Example showing hardware disconnect diagnostic
      hvacUnit: "OFF",
    },
  },
];

const MOCK_EVENTS = [
  {
    id: "evt-1",
    timestamp: "10:42:15 AM",
    roomId: "room-101",
    roomName: "CS Computer Lab 101",
    type: "OCCUPANCY_INCREASE",
    severity: "info",
    message: "AI detected 4 people (Occupancy state changed to OCCUPIED)",
    hvacResponse: "HVAC state maintained ON",
  },
  {
    id: "evt-2",
    timestamp: "10:39:00 AM",
    roomId: "room-103",
    roomName: "Seminar Room 201",
    type: "OCCUPANCY_DECREASE",
    severity: "warning",
    message: "AI detected 0 people (Occupancy state changed to UNOCCUPIED)",
    hvacResponse: "Started 5-minute grace period delay timer",
  },
  {
    id: "evt-3",
    timestamp: "10:15:30 AM",
    roomId: "room-104",
    roomName: "Conference Room 305",
    type: "HVAC_STATE_CHANGE",
    severity: "neutral",
    message: "Grace period timer expired (0 people detected)",
    hvacResponse: "HVAC relay signal sent: OFF",
  },
  {
    id: "evt-4",
    timestamp: "09:55:10 AM",
    roomId: "room-102",
    roomName: "Lecture Hall 102",
    type: "OCCUPANCY_INCREASE",
    severity: "info",
    message: "AI detected 14 people (Class session active)",
    hvacResponse: "HVAC state maintained ON",
  },
  {
    id: "evt-5",
    timestamp: "09:30:00 AM",
    roomId: "room-104",
    roomName: "Conference Room 305",
    type: "HARDWARE_ALERT",
    severity: "error",
    message: "ESP32 hardware controller heartbeat timeout",
    hvacResponse: "Hardware connection check flagged in system health",
  },
];

const MOCK_PIPELINE_HEALTH = {
  status: "DEGRADED", // HEALTHY, DEGRADED, CRITICAL
  lastHeartbeat: "Just now",
  nodes: [
    { key: "camera", label: "IP Camera Stream", status: "ONLINE", info: "4/4 Streams Reachable" },
    { key: "yolo", label: "YOLO AI Inference", status: "ONLINE", info: "4 Feeds Processing @ 15fps" },
    { key: "hvacController", label: "HVAC Logic Engine", status: "ONLINE", info: "Rule Engine Active" },
    { key: "mqttBroker", label: "MQTT Telemetry Broker", status: "ONLINE", info: "Broker Port 1883 Connected" },
    { key: "espNode", label: "ESP Hardware Relays", status: "WARNING", info: "3/4 Nodes Online (Room 104 Offline)" },
    { key: "hvacUnit", label: "HVAC Unit Relay Output", status: "ONLINE", info: "Relay Command Verification OK" },
  ],
};

const MOCK_HISTORICAL_DATA = {
  "room-101": [
    { time: "08:00", occupancyCount: 0, hvacStateNum: 0, event: "Room Empty" },
    { time: "09:00", occupancyCount: 2, hvacStateNum: 1, event: "2 People Detected ➔ HVAC ON" },
    { time: "10:00", occupancyCount: 5, hvacStateNum: 1, event: "Peak Class Occupancy" },
    { time: "11:00", occupancyCount: 4, hvacStateNum: 1, event: "Active Session" },
    { time: "12:00", occupancyCount: 1, hvacStateNum: 1, event: "1 Person Remaining" },
    { time: "13:00", occupancyCount: 0, hvacStateNum: 0.5, event: "Empty ➔ Grace Period" },
    { time: "14:00", occupancyCount: 0, hvacStateNum: 0, event: "Grace Expired ➔ HVAC OFF" },
  ],
  "room-102": [
    { time: "08:00", occupancyCount: 0, hvacStateNum: 0, event: "Room Empty" },
    { time: "09:00", occupancyCount: 18, hvacStateNum: 1, event: "Lecture Started ➔ HVAC ON" },
    { time: "10:00", occupancyCount: 16, hvacStateNum: 1, event: "Class Active" },
    { time: "11:00", occupancyCount: 14, hvacStateNum: 1, event: "Class Active" },
    { time: "12:00", occupancyCount: 0, hvacStateNum: 0.5, event: "Lecture Dismissed ➔ Timer Started" },
    { time: "13:00", occupancyCount: 0, hvacStateNum: 0, event: "HVAC OFF" },
  ],
};

export const bmsDataService = {
  getRooms: async () => {
    return [...MOCK_ROOMS];
  },
  getRoomById: async (roomId) => {
    return MOCK_ROOMS.find((r) => r.id === roomId) || MOCK_ROOMS[0];
  },
  getRecentEvents: async () => {
    return [...MOCK_EVENTS];
  },
  getPipelineHealth: async () => {
    return { ...MOCK_PIPELINE_HEALTH };
  },
  getHistoricalData: async (roomId = "room-101") => {
    return MOCK_HISTORICAL_DATA[roomId] || MOCK_HISTORICAL_DATA["room-101"];
  },
};
