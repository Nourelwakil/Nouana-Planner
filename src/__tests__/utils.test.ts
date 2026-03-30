import { describe, it, expect } from 'vitest';

// Priority classification logic (extracted from PriorityMatrix)
function getPriorityLabel(urgent: boolean, important: boolean): string {
  if (urgent && important) return 'Critical';
  if (important) return 'High Priority';
  if (urgent) return 'Urgent';
  return 'Normal';
}

function getPriorityColor(urgent: boolean, important: boolean): string {
  if (urgent && important) return 'red';
  if (important) return 'orange';
  if (urgent) return 'blue';
  return 'gray';
}

// Motivation message logic (extracted from App.tsx)
function getMotivation(percent: number): string {
  if (percent === 0) return "Every journey begins with a single step. Let's get started!";
  if (percent < 30) return "Great start! You're building momentum.";
  if (percent < 60) return "You're halfway there! Keep pushing, you're doing amazing.";
  if (percent < 90) return "Almost at the finish line! Your hard work is paying off.";
  if (percent === 100) return "Incredible! You've mastered your goals for this cycle. Take a well-deserved rest!";
  return "Keep going, you've got this!";
}

// Timer formatting logic (extracted from PomodoroTimer)
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Progress calculation (extracted from PomodoroTimer)
function calculateProgress(timeLeft: number, totalSeconds: number): number {
  return ((totalSeconds - timeLeft) / totalSeconds) * 100;
}

describe('Priority Matrix Classification', () => {
  it('returns Critical when both urgent and important', () => {
    expect(getPriorityLabel(true, true)).toBe('Critical');
  });

  it('returns High Priority when important but not urgent', () => {
    expect(getPriorityLabel(false, true)).toBe('High Priority');
  });

  it('returns Urgent when urgent but not important', () => {
    expect(getPriorityLabel(true, false)).toBe('Urgent');
  });

  it('returns Normal when neither urgent nor important', () => {
    expect(getPriorityLabel(false, false)).toBe('Normal');
  });
});

describe('Priority Color Assignment', () => {
  it('assigns red to Critical tasks', () => {
    expect(getPriorityColor(true, true)).toBe('red');
  });

  it('assigns orange to High Priority tasks', () => {
    expect(getPriorityColor(false, true)).toBe('orange');
  });

  it('assigns blue to Urgent tasks', () => {
    expect(getPriorityColor(true, false)).toBe('blue');
  });

  it('assigns gray to Normal tasks', () => {
    expect(getPriorityColor(false, false)).toBe('gray');
  });
});

describe('Motivation Messages', () => {
  it('shows starter message at 0%', () => {
    expect(getMotivation(0)).toContain('single step');
  });

  it('shows encouragement below 30%', () => {
    expect(getMotivation(15)).toContain('momentum');
  });

  it('shows halfway message below 60%', () => {
    expect(getMotivation(45)).toContain('halfway');
  });

  it('shows near-finish message below 90%', () => {
    expect(getMotivation(85)).toContain('finish line');
  });

  it('shows completion message at 100%', () => {
    expect(getMotivation(100)).toContain('mastered');
  });

  it('shows fallback message for other values', () => {
    expect(getMotivation(95)).toContain('got this');
  });
});

describe('Pomodoro Timer Formatting', () => {
  it('formats 25 minutes correctly', () => {
    expect(formatTime(1500)).toBe('25:00');
  });

  it('formats 5 minutes correctly', () => {
    expect(formatTime(300)).toBe('05:00');
  });

  it('formats zero correctly', () => {
    expect(formatTime(0)).toBe('00:00');
  });

  it('formats seconds correctly', () => {
    expect(formatTime(65)).toBe('01:05');
  });

  it('pads single digit minutes and seconds', () => {
    expect(formatTime(61)).toBe('01:01');
  });
});

describe('Timer Progress Calculation', () => {
  it('returns 0 at start', () => {
    expect(calculateProgress(1500, 1500)).toBe(0);
  });

  it('returns 50 at halfway', () => {
    expect(calculateProgress(750, 1500)).toBe(50);
  });

  it('returns 100 when done', () => {
    expect(calculateProgress(0, 1500)).toBe(100);
  });
});
```

Commit.

**File 4: Update `package.json`**

Go to `package.json`, click the pencil to edit. Find the `"scripts"` section and add the test script. Change it from:
```
    "lint": "tsc --noEmit"
```

to:
```
    "lint": "tsc --noEmit",
    "test": "vitest run"
