import { AppProgressState, AssessmentAttempt, TraineeProfile } from '../types/clinical';

const STORAGE_KEY = 'anorectal_teaching_station_v1';

const DEFAULT_STATE: AppProgressState = {
  profile: {
    name: '临床学员',
    role: '进修医生',
    department: '肛肠外科',
    hospital: '教学合作单位'
  },
  attempts: [],
  bookmarkedIds: []
};

export function loadProgressState(): AppProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<AppProgressState>;
    return {
      profile: { ...DEFAULT_STATE.profile, ...(parsed.profile ?? {}) },
      attempts: Array.isArray(parsed.attempts) ? parsed.attempts : [],
      bookmarkedIds: Array.isArray(parsed.bookmarkedIds) ? parsed.bookmarkedIds : []
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveProgressState(state: AppProgressState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors in private browsing
  }
}

export function recordAttempt(
  state: AppProgressState,
  attempt: Omit<AssessmentAttempt, 'id' | 'timestamp'>
): AppProgressState {
  const newAttempt: AssessmentAttempt = {
    ...attempt,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString()
  };
  const next: AppProgressState = {
    ...state,
    attempts: [newAttempt, ...state.attempts]
  };
  saveProgressState(next);
  return next;
}

export function updateTraineeProfile(
  state: AppProgressState,
  profile: TraineeProfile
): AppProgressState {
  const next: AppProgressState = { ...state, profile };
  saveProgressState(next);
  return next;
}

export function toggleBookmark(state: AppProgressState, itemId: string): AppProgressState {
  const exists = state.bookmarkedIds.includes(itemId);
  const bookmarkedIds = exists
    ? state.bookmarkedIds.filter((id) => id !== itemId)
    : [...state.bookmarkedIds, itemId];
  const next: AppProgressState = { ...state, bookmarkedIds };
  saveProgressState(next);
  return next;
}

export function clearAllAttempts(state: AppProgressState): AppProgressState {
  const next: AppProgressState = { ...state, attempts: [] };
  saveProgressState(next);
  return next;
}
