// Helper functions to calculate wellness data

export function calculateWellnessScore(): number {
  // Get tasks from localStorage
  const tasksStr = localStorage.getItem('wellness-tasks');
  const tasks = tasksStr ? JSON.parse(tasksStr) : [];
  
  // Get check-ins from localStorage
  const checkInsStr = localStorage.getItem('wellness-checkins');
  const checkIns = checkInsStr ? JSON.parse(checkInsStr) : [];
  
  // Get profile
  const profileStr = localStorage.getItem('commutewell-user-profile');
  const profile = profileStr ? JSON.parse(profileStr) : {};
  
  let score = 50; // Base score
  
  // Task completion (0-30 points)
  const completed = tasks.filter((t: any) => t.completed).length;
  const total = tasks.length || 1;
  score += (completed / total) * 30;
  
  // Check-in average (0-20 points) - simplified
  if (checkIns.length > 0) {
    const recent = checkIns.slice(-7); // Last 7 days
    const avgEnergy = recent.reduce((sum: number, c: any) => sum + (c.energy || 0), 0) / recent.length;
    const avgStress = recent.reduce((sum: number, c: any) => sum + (c.stress || 0), 0) / recent.length;
    
    score += ((avgEnergy - 1) / 4) * 7; // Energy: 0-7 points
    score += ((5 - avgStress) / 4) * 7; // Stress: 0-7 points (inverted)
  }
  
  // Streak bonus (0-10 points)
  const streak = calculateStreak();
  score += Math.min(streak * 2, 10);
  
  // Commute penalty
  const commuteMinutes = profile.totalCommuteMinutes || 0;
  if (commuteMinutes >= 180) score -= 10;
  else if (commuteMinutes >= 120) score -= 5;
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function calculateStreak(): number {
  const checkInsStr = localStorage.getItem('wellness-checkins');
  if (!checkInsStr) return 0;
  
  const checkIns = JSON.parse(checkInsStr);
  if (checkIns.length === 0) return 0;
  
  // Count consecutive days from today backwards
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];
    
    const hasCheckIn = checkIns.some((c: any) => c.date === dateStr);
    if (hasCheckIn) {
      streak++;
    } else if (i > 0) {
      break; // Stop if we find a day without check-in (but not today)
    }
  }
  
  return streak;
}

export function getTasksCompleted(): number {
  const tasksStr = localStorage.getItem('wellness-tasks');
  if (!tasksStr) return 0;
  
  const tasks = JSON.parse(tasksStr);
  return tasks.filter((t: any) => t.completed).length;
}

export function getTotalTasks(): number {
  const tasksStr = localStorage.getItem('wellness-tasks');
  if (!tasksStr) return 5; // Default
  
  const tasks = JSON.parse(tasksStr);
  return tasks.length || 5;
}

export function getWeeklyCommuteHours(): number {
  const profileStr = localStorage.getItem('commutewell-user-profile');
  if (!profileStr) return 0;
  
  const profile = JSON.parse(profileStr);
  return profile.weeklyCommuteHours || 0;
}

export function getTrends(): { energy: string; stress: string; comfort: string } {
  const checkInsStr = localStorage.getItem('wellness-checkins');
  if (!checkInsStr) {
    return { energy: 'Stable →', stress: 'Stable →', comfort: 'Stable →' };
  }
  
  const checkIns = JSON.parse(checkInsStr);
  if (checkIns.length < 2) {
    return { energy: 'Stable →', stress: 'Stable →', comfort: 'Stable →' };
  }
  
  // Get last 7 days and previous 7 days
  const thisWeek = checkIns.slice(-7);
  const lastWeek = checkIns.slice(-14, -7);
  
  const calculateTrend = (metric: 'energy' | 'stress' | 'comfort') => {
    if (lastWeek.length === 0) return 'Stable →';
    
    const thisAvg = thisWeek.reduce((sum: number, c: any) => sum + (c[metric] || 0), 0) / thisWeek.length;
    const lastAvg = lastWeek.reduce((sum: number, c: any) => sum + (c[metric] || 0), 0) / lastWeek.length;
    
    const diff = thisAvg - lastAvg;
    
    if (metric === 'stress') {
      // For stress, lower is better
      if (diff < -0.3) return 'Improving ↗️';
      if (diff > 0.3) return 'Declining ↘️';
    } else {
      // For energy and comfort, higher is better
      if (diff > 0.3) return 'Improving ↗️';
      if (diff < -0.3) return 'Declining ↘️';
    }
    
    return 'Stable →';
  };
  
  return {
    energy: calculateTrend('energy'),
    stress: calculateTrend('stress'),
    comfort: calculateTrend('comfort'),
  };
}

export function getTodaysFocus(): string {
  const trends = getTrends();
  
  // Prioritize based on worst metric
  if (trends.energy.includes('↘️')) {
    return 'Try a 5-minute stretch before driving today';
  }
  if (trends.stress.includes('↘️')) {
    return 'Practice deep breathing: inhale 4, hold 4, exhale 4';
  }
  if (trends.comfort.includes('↘️')) {
    return 'Adjust your seat position and take breaks every 90 minutes';
  }
  
  // Default tips
  const tips = [
    'Take 5 deep breaths before starting your drive',
    'Pack a healthy snack for your commute',
    'Do a quick 2-minute stretch when you arrive',
    'Stay hydrated - bring a water bottle',
    'Listen to calming music during traffic',
  ];
  
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return tips[dayOfYear % tips.length];
}