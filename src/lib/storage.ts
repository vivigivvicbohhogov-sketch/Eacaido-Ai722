import { AccessCode, UsageEvent, BannedDevice, SupportTicket, UserTheme, AppSettings } from '../types';

const STORAGE_KEYS = {
  CODES: 'escaido_access_codes',
  EVENTS: 'escaido_usage_events',
  BANNED: 'escaido_banned_devices',
  TICKETS: 'escaido_support_tickets',
  THEME: 'escaido_user_theme',
  SETTINGS: 'escaido_app_settings',
  CURRENT_CODE: 'escaido_current_code',
  DEVICE_ID: 'escaido_device_id',
};

// Device ID generator
export function getOrCreateDeviceId(): string {
  let deviceId = localStorage.getItem(STORAGE_KEYS.DEVICE_ID);
  if (!deviceId) {
    deviceId = 'dev_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem(STORAGE_KEYS.DEVICE_ID, deviceId);
  }
  return deviceId;
}

// Initial seed codes
const INITIAL_CODES: AccessCode[] = [
  { code: 'ESCA-2026-TEST', is_active: true, is_blocked: false, created_at: new Date().toISOString() },
  { code: 'ADMIN-CODE-999', is_active: true, is_blocked: false, created_at: new Date().toISOString() },
  { code: 'VIP-VEO-888', is_active: true, is_blocked: false, created_at: new Date().toISOString() },
  { code: 'DEMO-5555-AI', is_active: true, is_blocked: false, created_at: new Date().toISOString() },
];

export function getAccessCodes(): AccessCode[] {
  const data = localStorage.getItem(STORAGE_KEYS.CODES);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.CODES, JSON.stringify(INITIAL_CODES));
    return INITIAL_CODES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_CODES;
  }
}

export function saveAccessCodes(codes: AccessCode[]) {
  localStorage.setItem(STORAGE_KEYS.CODES, JSON.stringify(codes));
}

export function getUsageEvents(): UsageEvent[] {
  const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function logUsageEvent(code: string, action: 'code_linked' | 'create_video' | 'create_image', metadata?: Record<string, any>) {
  const events = getUsageEvents();
  const newEvent: UsageEvent = {
    id: 'evt_' + Math.random().toString(36).substring(2, 9),
    code,
    device_id: getOrCreateDeviceId(),
    action,
    metadata,
    timestamp: new Date().toISOString(),
  };
  events.unshift(newEvent);
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
}

export function getBannedDevices(): BannedDevice[] {
  const data = localStorage.getItem(STORAGE_KEYS.BANNED);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveBannedDevices(devices: BannedDevice[]) {
  localStorage.setItem(STORAGE_KEYS.BANNED, JSON.stringify(devices));
}

export function getSupportTickets(): SupportTicket[] {
  const data = localStorage.getItem(STORAGE_KEYS.TICKETS);
  if (!data) {
    const initial: SupportTicket[] = [
      {
        id: 'tkt_1',
        user_code: 'ESCA-2026-TEST',
        message: 'كيف يمكنني رفع جودة الفيديو أكثر؟',
        image_urls: [],
        status: 'pending',
        created_at: new Date().toISOString(),
      }
    ];
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveSupportTickets(tickets: SupportTicket[]) {
  localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
}

const DEFAULT_SETTINGS: AppSettings = {
  admin_portal_password: 'ESCAESCA2006',
  daily_video_limit: 10,
  maintenance_mode: false,
  video_generation_url: 'https://opal.google/app/1B-c7kdO3CXSGcajleIvdsww4DIhMowqn',
  image_generation_url: 'https://opal.google/app/1tbDhMlw6N1nUNT7UpyCpR1nIbQ9jV3JE',
  video_login_url: 'https://opal.google/app/1B-c7kdO3CXSGcajleIvdsww4DIhMowqn',
  image_login_url: 'https://opal.google/app/1tbDhMlw6N1nUNT7UpyCpR1nIbQ9jV3JE',
  protection_mode: 'internal_frame',
};

export function getAppSettings(): AppSettings {
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    return DEFAULT_SETTINGS;
  }
  try {
    const parsed = JSON.parse(data);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveAppSettings(settings: AppSettings) {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}
