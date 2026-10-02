# Smart HVAC BMS Operator Interface
> **AI-Powered Occupancy Estimation & Automated HVAC Control System**

A modern, Video Management System (VMS)-inspired Building Management System (BMS) operator interface. This application leverages AI vision feeds to estimate room occupancy in real time and automatically drive HVAC operational states based on physical presence.

---

## 🏗️ End-to-End System Architecture

```text
+---------------+     +--------------------+     +--------------------+
|  IP Camera /  | --> |   AI YOLO Person   | --> | AI Estimated       |
|  Video Feed   |     |   Detection Model  |     | Occupancy Headcount|
+---------------+     +--------------------+     +--------------------+
                                                           |
                                                           v
+---------------+     +--------------------+     +--------------------+
| HVAC Actuator | <-- | ESP Microcontroller| <-- | MQTT Broker /      |
| Relay Output  |     | Hardware Module    |     | HVAC Decision Logic|
+---------------+     +--------------------+     +--------------------+
```

---

## ✨ Key Features

### 1. Live Operator Monitor (`Dashboard`)
- **2x2 Room Tile Grid:** Live room monitoring across multiple zones (e.g., *Conference Room A*, *Server Room*, *Main Lobby*, *Executive Suite*).
- **Vision Headcount Display:** Live AI estimated person count calculated directly from vision feeds.
- **Dynamic Decision Badges:** Real-time HVAC logic state evaluation (e.g., `Occupancy ≥ 1 → HVAC ON`, `Occupancy = 0 → HVAC OFF`).

### 2. Room Inspector Drilldown (`RoomInspector`)
- **Dual Aligned Timelines (`Occupancy & HVAC History`):** 
  - **Top Chart:** Single-line time series chart tracking **AI Estimated Occupancy** over time.
  - **Bottom Timeline:** Synchronized horizontal **HVAC State Band** showing operational states (`ON`, `OFF`, `OFF DELAY`).
  - **Shared Time Axis:** Explicit aligned time ticks (`08:00 | 09:00 | 10:00 | 11:00 | 12:00 | 13:00`) for instant visual correlation between human presence and climate control responses.
- **6-Stage Telemetry Micro-Chips:** Live status indicators for:
  `Camera` | `YOLO` | `HVAC Logic` | `MQTT` | `ESP` | `HVAC`

### 3. Events Audit Log (`Events`)
- Audit trail logging all automated HVAC transitions, occupancy threshold triggers, and system manual overrides with precise timestamps and room tags.

### 4. System Health Diagnostics (`System Health`)
- Comprehensive telemetry monitoring for all hardware sensors, AI processing pipelines, MQTT message brokers, and physical relays.

---

## 🛠️ Technology Stack

- **Frontend Framework:** React.js (Create React App)
- **UI & Layout:** Material-UI (MUI v5)
- **Charts & Data Visualization:** Nivo Charting Library (`@nivo/line`, `@nivo/bar`)
- **Styling & Aesthetics:** Dark mode operator palette with custom CSS tokens
- **Data Layer:** Dynamic BMS mock telemetry service (`bmsDataService.js`)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/archiveofbhavy/smart-hvac-bms.git
   cd smart-hvac-bms
   ```

2. **Install project dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the local development server:**
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`.

---

## 📁 Project Structure

```text
smart-hvac-bms/
├── public/                  # Static assets and index.html
├── src/
│   ├── components/          # Reusable UI components & charts
│   │   ├── OccupancyHvacHistory.jsx  # Dual aligned history timeline
│   │   ├── RoomInspector.jsx         # Detailed room drilldown view
│   │   ├── Sidebar.jsx               # Navigation bar
│   │   └── Topbar.jsx                # System status header & live metrics
│   ├── scenes/              # View routes
│   │   ├── dashboard/       # 2x2 Live Monitor grid
│   │   ├── events/          # BMS Events log
│   │   └── systemHealth/    # 6-stage telemetry health
│   ├── services/
│   │   └── bmsDataService.js # BMS data state & telemetry provider
│   ├── App.js               # Application router & layout
│   └── index.js             # React entry point
└── README.md
```

---

## 📄 License

This project is licensed under the MIT License.
