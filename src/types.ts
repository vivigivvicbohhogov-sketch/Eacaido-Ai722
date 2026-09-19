export type Language = 'ar' | 'en' | 'ku' | 'tr' | 'fa' | 'fr' | 'es' | 'de';

export interface AccessCode {
  code: string;
  is_active: boolean;
  user_email?: string;
  used_by_device?: string;
  first_linked_at?: string;
  last_seen?: string;
  is_blocked?: boolean;
  created_at: string;
}

export interface UsageEvent {
  id: string;
  code: string;
  device_id: string;
  action: 'code_linked' | 'create_video' | 'create_image';
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface BannedDevice {
  deviceId: string;
  codeAssociated?: string;
  reason: string;
  banned_at: string;
}

export interface SupportTicket {
  id: string;
  user_code: string;
  message: string;
  image_urls: string[];
  status: 'pending' | 'replied' | 'closed';
  admin_reply?: string;
  created_at: string;
}

export interface UserTheme {
  user_email: string;
  language: Language;
  background_color: string;
  background_effect: 'particles' | 'grid' | 'waves' | 'none';
  color_theme: 'zinc' | 'slate' | 'neutral';
  button_design: 'rounded' | 'pill' | 'sharp';
  ui_layout: 'centered' | 'sidebar';
  day_night_mode: 'night' | 'day';
  frame_rate: number;
}

export interface AppLogoConfig {
  selected_logo: string;
  custom_name: string;
  animation_style: 'rotateY' | 'pulsate3d' | 'float' | 'flipCard';
}

export interface AppSettings {
  admin_portal_password: string;
  daily_video_limit: number;
  maintenance_mode: boolean;
  video_generation_url: string;
  image_generation_url: string;
  video_login_url: string;
  image_login_url: string;
  protection_mode: 'internal_frame' | 'secure_workspace';
}
