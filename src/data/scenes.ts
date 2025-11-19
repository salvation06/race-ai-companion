export interface Scene {
  id: number;
  title: string;
  visual: string;
  speaker?: string;
  narration: string;
  videoSrc?: string;
  imageSrc?: string;
  additionalInfo?: string;
}

export const scenes: Scene[] = [
  {
    id: 1,
    title: "Welcome to X-RaceIQ",
    visual: "AI commercial introduction",
    speaker: "Narrator",
    narration:
      "Imagine having a world-class AI race engineer and crew in your helmet along with your racing team having insights to live analytics generated via AI. The XRaceIQ  platform combines our AI Crew Chief device with the HeartBeat dashboard powered by eight autonomous agents analyzing every data point in real-time. Ask a question, get tactical coaching in two seconds. This isn't just racing data, this is your AI teammate and crew making you faster, smarter, and safer every lap. Welcome to the future of racing!",
    videoSrc: "/videos/AICommercialIntro.mp4",
  },
  {
    id: 2,
    title: "Pit Strategy",
    visual: "Pit operations and team coordination",
    narration: "",
    videoSrc: "/videos/pit-stop.mp4",
  },
  {
    id: 3,
    title: "Dashboard Overview",
    visual: "Futuristic Toyota GR dashboard with race data",
    narration: "",
    videoSrc: "/videos/dashboard.mp4",
  },
  {
    id: 4,
    title: "AI Crew Chief Response",
    visual: "Dashboard displaying race data and telemetry",
    speaker: "AI Crew Chief",
    narration:
      "Race data loaded. Indy GP layout. 26-lap event. P1 car number 55 finished in 46 minutes 41.553 seconds with a fastest lap of 1 minute 39.748 seconds at 141.7 kilometers per hour. Your target: maintain lap times in the 1:40.1 to 1:40.4 range for competitive pace.",
    imageSrc: "/src/assets/dashboard-cockpit.png",
  },
  {
    id: 5,
    title: "Driver Ready Check",
    visual: "Driver in cockpit preparing for race start",
    speaker: "Driver",
    narration: "AI Crew Chief, confirm race data loaded.",
    imageSrc: "/src/assets/dashboard-cockpit.png",
  },
  {
    id: 6,
    title: "Race Start Simulation",
    visual: "Race start sequence with car positioning",
    speaker: "Driver",
    narration: "AI Crew Chief, what's my strategy for the opening laps?",
    imageSrc: "/src/assets/dashboard-cockpit.png",
  },
  {
    id: 7,
    title: "Opening Strategy",
    visual: "Track map with strategic points highlighted",
    speaker: "AI Crew Chief",
    narration:
      "Based on race history: The top five drivers all set their fastest laps before lap 10. Overtakes were most successful between Turns 7 through 12. Maintain a clean opening with throttle modulation. GR86 stability control favors early-race tire conservation.",
    imageSrc: "/src/assets/dashboard-cockpit.png",
  },
  {
    id: 8,
    title: "Mid-Race Live Analytics",
    visual: "Driver's dash showing speed, gears, track map with real-time data",
    speaker: "Driver",
    narration: "Crew Chief, measure my pace versus the leaders.",
    imageSrc: "/src/assets/dashboard-cockpit.png",
  },
  {
    id: 9,
    title: "Pace Analysis",
    visual: "Comparative lap time analysis display",
    speaker: "AI Crew Chief",
    narration:
      "Copy. Based on comparable laps: The leaders' consistent pace is 1:40.0 to 1:40.3. Your current pace is 0.35 seconds slower per lap. Recommendation: brake 5 meters later entering Turn 1 and open steering sooner on exit of Turn 4. Those were the key differentiators for cars number 55 and 98.",
    imageSrc: "/src/assets/dashboard-cockpit.png",
  },
  {
    id: 10,
    title: "Gap Analysis",
    visual: "Real-time gap analysis with competitor positions",
    speaker: "Driver",
    narration: "How far am I from the driver ahead?",
    imageSrc: "/src/assets/dashboard-cockpit.png",
  },
  {
    id: 11,
    title: "Real-Time Telemetry",
    visual: "Detailed telemetry data from Indy race",
    speaker: "AI Crew Chief",
    narration:
      "Using real Indy race telemetry: Car 13, Workman, held a plus 0.427 gap to the leader. Car 46 trailed Workman by plus 0.588. Car 98 was plus 1.261 off the front. If you match the 1:40.062 fast lap from car 98, you will close a full second over the next three laps.",
    imageSrc: "/src/assets/dashboard-cockpit.png",
  },
  {
    id: 12,
    title: "Engineering Insight",
    visual: "Technical breakdown of GR86 performance characteristics",
    speaker: "Driver",
    narration: "What can I adjust to improve cornering?",
    imageSrc: "/src/assets/dashboard-cockpit.png",
  },
  {
    id: 13,
    title: "GR86 Platform Analysis",
    visual: "Technical diagrams and performance zones",
    speaker: "AI Crew Chief",
    narration:
      "The GR86 platform favors: High entry rotation. Use confident braking to load the front MacPherson struts. Late apex technique allows you to leverage the Torsen limited-slip differential on exit. Smooth throttle roll-on prevents rear slip with the naturally aspirated flat-4 torque curve. Use 4th gear early in fast sweepers. Keeps you inside the GR86 power band at 5,800 to 7,200 RPM.",
    imageSrc: "/src/assets/dashboard-cockpit.png",
  },
  {
    id: 14,
    title: "Performance Summary",
    visual: "Race completion metrics and performance data",
    speaker: "AI Crew Chief",
    narration:
      "Race analysis complete. You completed 26 laps with consistent pace improvement. Your fastest lap matched the top 5 performers. Strategy recommendations have been logged for your next session.",
    imageSrc: "/src/assets/dashboard-cockpit.png",
  },
  {
    id: 15,
    title: "Closing Statement",
    visual: "Futuristic HUD with complete race summary and performance metrics",
    speaker: "Narrator",
    narration:
      "AI Crew Chief brings strategy, coaching, and engineering insight into the cockpit. Built for Toyota GR Cup. Powered by LLM intelligence. Designed to help every driver find the perfect racing line.",
    additionalInfo: "Race complete. Performance summary uploaded.",
    imageSrc: "/src/assets/dashboard-cockpit.png",
  },
];
