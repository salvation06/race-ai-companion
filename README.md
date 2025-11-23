## Inspiration
Racing demands split-second decisions and perfect awareness of machine and environment. We built X-RaceIQ: a voice-activated AI race engineer that lives in your helmet. The AI Crew Chief Radio hardware device delivers real-time telemetry analysis and tactical coaching in under 2 seconds, while the HeartBeat Dashboard coordinates 8 autonomous agents to provide world-class engineering intelligence (**DEMO HERE** - [link](https://x-raceiq.lovable.app)):

## What it does

The **AI Crew Chief Device** provides professional-grade, real-time telemetry analysis and strategic coaching through eight autonomous agents. It monitors:

**1. Car Telemetry Agent**  
Responsible for loading race data from CSV, tracking current position (P2), and monitoring gap to leader (1.26s)

**2. Pace Regression Agent**  
Responsible for analyzing the last 5 laps to identify performance trends and consistency patterns

**3. Weather Agent**  
Responsible for monitoring track temperature (18.2°C) and calculating grip score (85%) based on environmental conditions

**4. Engine/Tire Agent**  
Responsible for predicting tire wear (67%) and estimating remaining tire life (5 more laps)

**5. Driver State Agent**  
Responsible for monitoring driver biometrics including heart rate (158 bpm) and fatigue levels (38%)

**6. Lead Chase Agent**  
Responsible for calculating required pace to catch the leader (-0.16s/lap) and determining if overtaking is possible

**7. LLM Insight Agent**  
Responsible for calling OpenAI/Claude with full race context and generating natural language coaching messages

**8. Heartbeat Dashboard**  
Responsible for combining all agent outputs and making strategic race decisions via Heartbeat Dashboard

##How we built it
We combined embedded hardware, on-helmet audio feedback, sensor fusion, and a multi-agent AI architecture. Each agent specializes in a domain: performance, strategy, health, or environment, and syncs data with our HeartBeat dashboard for live team analytics.

# Complete System Integration Guide
## AI Chief Radio Device + Agent2Agent API Platform

---

## 🎯 Overview: How Hardware and Software Work Together

There are TWO complete systems that work together:

1. **Agent2Agent API** (Software Backend) - The intelligence
2. **AI Chief Radio** (Hardware Device) - The communication interface

Here's how they integrate:

```
┌──────────────────────────────────────────────────────────────┐
│                    IN THE RACE CAR                           │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │        AI Chief Radio Device (Hardware)                │ │
│  │                                                        │ │
│  │  • Driver wears helmet with device                    │ │
│  │  • Speaks: "Hey Chief, what's my gap?"               │ │
│  │  • Bone conduction mic captures voice                 │ │
│  │  • Speech-to-text on Jetson Nano (300ms)             │ │
│  │  • Text sent via 5G to cloud                         │ │
│  └────────────┬───────────────────────────────────────────┘ │
│               │                                              │
└───────────────┼──────────────────────────────────────────────┘
                │
                │ 5G / WiFi
                │
                ▼
┌──────────────────────────────────────────────────────────────┐
│               YOUR AGENT2AGENT API SERVER                    │
│               (Running on Cloud / Local Server)              │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  POST /api/orchestrator/process-heartbeat              │ │
│  │                                                        │ │
│  │  {                                                     │ │
│  │    "lapNumber": 18,                                    │ │
│  │    "carNumber": 55,                                    │ │
│  │    "driverQuery": "what's my gap"                     │ │
│  │  }                                                     │ │
│  └────────────┬───────────────────────────────────────────┘ │
│               │                                              │
│               ▼                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │        8 Agents Process in Parallel:                  │ │
│  │                                                        │ │
│  │  1. Car Telemetry Agent                                   │ │
│  │     → Loads race data from CSV                        │ │
│  │     → Current position: P2                            │ │
│  │     → Gap to leader: 1.26s                            │ │
│  │                                                        │ │
│  │  2. Pace Regression Agent                             │ │
│  │     → Analyzes last 5 laps                            │ │
│  │     → Trend: consistent                               │ │
│  │                                                        │ │
│  │  3. Weather Agent                                     │ │
│  │     → Track temp: 18.2°C                              │ │
│  │     → Grip score: 85%                                 │ │
│  │                                                        │ │
│  │  4. Engine/Tire Agent                                 │ │
│  │     → Tire wear: 67%                                  │ │
│  │     → Good for 5 more laps                            │ │
│  │                                                        │ │
│  │  5. Driver State Agent                               │ │
│  │     → Heart rate: 158 bpm                             │ │
│  │     → Fatigue: 38%                                    │ │
│  │                                                        │ │
│  │  6. Lead Chase Agent                                  │ │
│  │     → Required pace: -0.16s/lap                       │ │
│  │     → Catchup possible: Yes                           │ │
│  │                                                        │ │
│  │  7. LLM Insight Agent                                 │ │
│  │     → Calls OpenAI/Claude with context                │ │
│  │     → Generates coaching message                      │ │
│  │                                                        │ │
│  │  8. Heartbeat Dashboard                            │ │
│  │     → Combines all agent outputs                      │ │
│  │     → Makes strategic decisions                       │ │
│  └────────────┬───────────────────────────────────────────┘ │
│               │                                              │
│               ▼                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Response:                                             │ │
│  │  {                                                     │ │
│  │    "aiInsight": "One-point-two-six seconds to P-one. │ │
│  │    You're closing. Carry more speed through turn     │ │
│  │    seven. Tires are good for five more laps."        │ │
│  │  }                                                     │ │
│  └────────────┬───────────────────────────────────────────┘ │
│               │                                              │
└───────────────┼──────────────────────────────────────────────┘
                │
                │ Return text to device
                │
                ▼
┌──────────────────────────────────────────────────────────────┐
│                    BACK IN THE CAR                           │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │        AI Chief Radio Device (Hardware)                │ │
│  │                                                        │ │
│  │  • Receives text response from API                    │ │
│  │  • Text-to-Speech synthesis (300ms)                   │ │
│  │  • Audio plays in driver's IEMs                       │ │
│  │                                                        │ │
│  │  🔊 "One-point-two-six seconds to P-one.              │ │
│  │      You're closing. Carry more speed through         │ │
│  │      turn seven. Tires are good for five more laps."  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Total time: ~2 seconds from speaking to hearing response   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔌 API Integration Points

### 1. Device → API: Send Driver Query

**Endpoint:** `POST /api/voice/query`

```javascript
// AI Chief Radio device sends:
{
  "deviceId": "ai-chief-55",
  "carNumber": 55,
  "lapNumber": 18,
  "driverQuery": "what's my gap to the leader",
  "timestamp": "2025-11-18T20:15:03Z"
}

// API responds:
{
  "aiResponse": "One-point-two-six seconds to P-one...",
  "telemetrySnapshot": { /* current data */ },
  "priority": "high"
}
```

### 2. API → Device: Real-Time Updates

**WebSocket:** `ws://your-server.com/voice/stream`

```javascript
// Device connects to WebSocket
const ws = new WebSocket('ws://your-server.com/voice/stream');

// API pushes proactive alerts:
{
  "type": "proactive-alert",
  "carNumber": 55,
  "message": "Tire wear reaching 75%. Consider pit stop in 3 laps.",
  "urgency": "high",
  "ttsAudio": "base64-encoded-audio-data"
}

// Device plays audio immediately
```

### 3. Device → API: Telemetry Upload

**Endpoint:** `POST /api/telemetry/upload`

```javascript
// Device continuously sends telemetry:
{
  "carNumber": 55,
  "timestamp": "2025-11-18T20:15:03Z",
  "biometrics": {
    "heartRate": 158,
    "hrv": 42,
    "skinTemp": 35.2
  },
  "audioMetrics": {
    "micQuality": 94,
    "noiseCancellationActive": true
  }
}
```
---

## 🎬 Complete User Flow Example

### Scenario: Driver asks about tire wear

**1. Driver speaks** (in car, ~110dB engine noise)
```
Driver: [Presses PTT button]
"Hey Chief, how are my tires?"
```

**2. Device processes** (AI Chief Radio hardware)
```
• Bone conduction mic captures voice (50ms)
• Noise cancellation removes engine (20ms)
• Whisper STT: "how are my tires" (300ms)
• Send to API via 5G (30ms)
```

**3. Your API processes** (Agent2Agent backend)
```
POST /api/voice/query
{
  "carNumber": 55,
  "lapNumber": 18,
  "driverQuery": "how are my tires"
}

→ Car Telemetry Agent: Load car #55 data
→ Engine/Tire Agent: Calculate wear = 67%
→ Weather Agent: Track temp stable
→ LLM Insight Agent: Generate response
→ Return: "Tires at 67%. Good for 5 more laps..."
```

**4. Device responds** (AI Chief Radio hardware)
```
• Receive response text (100ms)
• Azure TTS synthesis (300ms)
• Stream audio to IEMs (100ms)
```

**5. Driver hears** (~2 seconds after speaking)
```
AI Chief: 🔊
"Tires at sixty-seven percent. You've got good life left. 
Track temperature is stable. You can push for another 
five laps before considering conservation mode."
```

**6. Driver acknowledges**
```
Driver: [Quick button press = ACK]
Device: [Green LED flash]
```

---

## 📊 Data Flow Summary

```
┌─────────────────────────────────────────────────────────────┐
│  WHAT FLOWS WHERE                                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Device → API:                                              │
│  • Driver voice queries (text after STT)                    │
│  • Device status (battery, connection quality)              │
│  • Button presses / interactions                            │
│                                                             │
│  API → Device:                                              │
│  • AI coaching responses (text for TTS)                     │
│  • Proactive alerts (without driver asking)                 │
│  • Telemetry updates (position, gaps, lap times)            │
│  • System notifications (warnings, errors)                  │
│                                                             │
│  API → LLM (OpenAI/Claude):                                 │
│  • Race context from 8 agents                               │
│  • Driver query + telemetry snapshot                        │
│  • Historical conversation context                          │
│                                                             │
│  LLM → API:                                                 │
│  • Natural language coaching response                       │
│  • Urgency level (low/medium/high/critical)                 │
│  • Suggested follow-up questions                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

**This is a complete, integrated system that showcases:**
- Real hardware innovation (the device)
- Advanced AI/ML (the 8 agents)
- Practical application (racing)
- Market opportunity ($850M)
- Technical execution (code + detailed specs)

## Challenges we ran into
Integrating multiple data streams and simulating a real time race strategy for the purpose of a demo
Designing coaching prompts that are fast, actionable, and never distracting
Ensuring the system performs with responsiveness
Working with AI LLM models to create a realistic looking design for the helmet and AI device integration

## Accomplishments that we're proud of
Delivering tactical coaching responses in under two seconds
Creating a fully autonomous AI race engineering stack
Developing a holistic driver-and-machine performance model
Design of seamless communication between the helmet device and HeartBeat dashboard

## What we learned
We learned that the right AI insights at the right moment can dramatically elevate a driver’s pace, confidence, and safety. We also discovered the importance of intuitive audio coaching and the power of combining physiological, mechanical, and environmental data into one unified system.

##What's next for X-RaceIQ
We’re expanding into more racing disciplines, refining predictive models, and developing deeper team-side analytics. Next up: enhanced driver biometrics and biometric tracking models, more adaptive coaching personalities, and expanded integrations to become the ultimate AI teammate in motorsport we are proud of.
