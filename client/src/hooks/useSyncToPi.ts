import { useEffect, useRef } from 'react';

// ⚠️ CHANGE THIS TO YOUR PI'S IP ADDRESS!
const PI_IP = '192.168.1.154'; // ← UPDATE THIS
const PI_URL = `http://${PI_IP}:5000/update`;

interface WellnessData {
  wellnessScore: number;
  todaysFocus: string;
  streak: number;
  tasksCompleted: number;
  totalTasks: number;
  commuteTime: number;
  trends: {
    energy: string;
    stress: string;
    comfort: string;
  };
}

export function useSyncToPi(data: WellnessData) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Debounce: wait 2 seconds after data changes before syncing
    clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(async () => {
      try {
        console.log('📤 Sending to Pi:', data);
        
        const response = await fetch(PI_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('✅ Synced to Pi:', result);
        } else {
          console.log('⚠️ Pi sync failed (status:', response.status, ')');
        }
      } catch (error) {
        // Fail silently - Pi might not be on network
        console.log('⚠️ Could not reach Pi:', error);
      }
    }, 2000); // Wait 2 seconds before syncing

    return () => clearTimeout(timeoutRef.current);
  }, [
    data.wellnessScore,
    data.streak,
    data.tasksCompleted,
    data.commuteTime,
    data.trends.energy,
    data.trends.stress,
    data.trends.comfort
  ]);
}