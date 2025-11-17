export interface RaceDriver {
  position: number;
  carNumber: string;
  status: string;
  laps: number;
  totalTime: string;
  gapFirst: string;
  gapPrevious: string;
  fastestLapNum: number;
  fastestLapTime: string;
  fastestLapKph: number;
  team: string;
  driverFirstName: string;
  driverLastName: string;
  driverCountry: string;
}

export const parseRaceData = (csvText: string): RaceDriver[] => {
  const lines = csvText.split('\n').filter(line => line.trim());
  const drivers: RaceDriver[] = [];
  
  // Skip header line
  for (let i = 1; i < lines.length; i++) {
    const fields = lines[i].split(';');
    if (fields.length > 30) {
      drivers.push({
        position: parseInt(fields[0]),
        carNumber: fields[1],
        status: fields[2],
        laps: parseInt(fields[3]),
        totalTime: fields[4],
        gapFirst: fields[5],
        gapPrevious: fields[6],
        fastestLapNum: parseInt(fields[7]),
        fastestLapTime: fields[8],
        fastestLapKph: parseFloat(fields[9]),
        team: fields[10],
        driverFirstName: fields[26],
        driverLastName: fields[27],
        driverCountry: fields[30]
      });
    }
  }
  
  return drivers;
};

export const generateLiveRaceData = (driver: RaceDriver, currentLap: number, maxLaps: number) => {
  const progress = currentLap / maxLaps;
  const avgLapTime = parseLapTime(driver.fastestLapTime) * 1.02; // Slightly slower than fastest
  const currentSpeed = driver.fastestLapKph * (0.95 + Math.random() * 0.1);
  
  return {
    carNumber: driver.carNumber,
    driverName: `${driver.driverFirstName} ${driver.driverLastName}`,
    currentLap,
    speed: Math.round(currentSpeed * 10) / 10,
    position: driver.position,
    gapToLeader: driver.gapFirst,
    lastLapTime: driver.fastestLapTime,
    team: driver.team,
    progress: Math.round(progress * 100)
  };
};

const parseLapTime = (timeStr: string): number => {
  const parts = timeStr.split(':');
  if (parts.length === 2) {
    return parseInt(parts[0]) * 60 + parseFloat(parts[1]);
  }
  return parseFloat(timeStr);
};
