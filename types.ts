
export interface CameraOrder {
  id: string;
  customerName: string;
  cameraName: string;
  startDate: string;
  endDate: string;
  days: number;
  totalBill: number;
  status: 'pending' | 'confirmed';
}

export enum AIService {
  SEARCH = 'search',
  MAPS = 'maps',
  IMAGE_GEN = 'image_gen',
  IMAGE_EDIT = 'image_edit',
  ANIMATE = 'animate',
  ANALYZE_IMAGE = 'analyze_image',
  ANALYZE_VIDEO = 'analyze_video',
  TRANSCRIBE = 'transcribe',
  FAST_CHAT = 'fast_chat',
  DEEP_THINK = 'deep_think'
}

export type AspectRatio = '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9';
export type ImageSize = '1K' | '2K' | '4K';
