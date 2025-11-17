export interface Scene {
  id: number;
  title: string;
  visual: string;
  speaker?: string;
  narration: string;
  videoSrc?: string;
  additionalInfo?: string;
}

export const scenes: Scene[] = [
  {
    id: 1,
    title: "Opening Shot",
    visual: "Indy track panorama → futuristic Toyota GR dashboard loads → 'AI CREW CHIEF SYSTEM – ONLINE'",
    speaker: "Narrator",
    narration: "In the Toyota GR Cup, every millisecond matters. Today we introduce AI Crew Chief, an LLM-powered real-time racing strategist designed for the GR86 platform.",
    videoSrc: "/videos/dashboard.mp4"
  },
  {
    id: 2,
    title: "Driver Enters Sim / Cockpit",
    visual: "Driver preparing in cockpit with systems initializing",
    speaker: "Driver",
    narration: "AI Crew Chief, confirm race data loaded.",
    videoSrc: "/videos/pit-stop.mp4"
  },
  {
    id: 3,
    title: "AI Crew Chief Response",
    visual: "Dashboard displaying race data and telemetry",
    speaker: "AI Crew Chief",
    narration: "Race data loaded. Indy GP layout. 26-lap event. P1 car number 55 finished in 46 minutes 41.553 seconds with a fastest lap of 1 minute 39.748 seconds at 141.7 kilometers per hour. Your target: maintain lap times in the 1:40.1 to 1:40.4 range for competitive pace."
  },
  {
    id: 4,
    title: "Race Start Simulation",
    visual: "Race start sequence with car positioning",
    speaker: "Driver",
    narration: "AI Crew Chief, what's my strategy for the opening laps?"
  },
  {
    id: 5,
    title: "Opening Strategy",
    visual: "Track map with strategic points highlighted",
    speaker: "AI Crew Chief",
    narration: "Based on race history: The top five drivers all set their fastest laps before lap 10. Overtakes were most successful between Turns 7 through 12. Maintain a clean opening with throttle modulation. GR86 stability control favors early-race tire conservation."
  },
  {
    id: 6,
    title: "Mid-Race Live Analytics",
    visual: "Driver's dash showing speed, gears, track map with real-time data",
    speaker: "Driver",
    narration: "Crew Chief, measure my pace versus the leaders."
  },
  {
    id: 7,
    title: "Pace Analysis",
    visual: "Comparative lap time analysis display",
    speaker: "AI Crew Chief",
    narration: "Copy. Based on comparable laps: The leaders' consistent pace is 1:40.0 to 1:40.3. Your current pace is 0.35 seconds slower per lap. Recommendation: brake 5 meters later entering Turn 1 and open steering sooner on exit of Turn 4. Those were the key differentiators for cars number 55 and 98."
  },
  {
    id: 8,
    title: "Gap Analysis",
    visual: "Real-time gap analysis with competitor positions",
    speaker: "Driver",
    narration: "How far am I from the driver ahead?"
  },
  {
    id: 9,
    title: "Real-Time Telemetry",
    visual: "Detailed telemetry data from Indy race",
    speaker: "AI Crew Chief",
    narration: "Using real Indy race telemetry: Car 13, Workman, held a plus 0.427 gap to the leader. Car 46 trailed Workman by plus 0.588. Car 98 was plus 1.261 off the front. If you match the 1:40.062 fast lap from car 98, you will close a full second over the next three laps."
  },
  {
    id: 10,
    title: "Engineering Insight",
    visual: "Technical breakdown of GR86 performance characteristics",
    speaker: "Driver",
    narration: "What can I adjust to improve cornering?"
  },
  {
    id: 11,
    title: "GR86 Platform Analysis",
    visual: "Technical diagrams and performance zones",
    speaker: "AI Crew Chief",
    narration: "The GR86 platform favors: High entry rotation. Use confident braking to load the front MacPherson struts. Late apex technique allows you to leverage the Torsen limited-slip differential on exit. Smooth throttle roll-on prevents rear slip with the naturally aspirated flat-4 torque curve. Use 4th gear early in fast sweepers. Keeps you inside the GR86 power band at 5,800 to 7,200 RPM."
  },
  {
    id: 12,
    title: "Closing Statement",
    visual: "Futuristic HUD with complete race summary and performance metrics",
    speaker: "Narrator",
    narration: "AI Crew Chief brings strategy, coaching, and engineering insight into the cockpit. Built for Toyota GR Cup. Powered by LLM intelligence. Designed to help every driver find the perfect racing line.",
    additionalInfo: "Race complete. Performance summary uploaded."
  }
];
