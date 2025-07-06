import { SOCIAL_MEDIA_URLS } from '../configs/socialMediaConfigs';

export const getSocialMediaUrl = (platform: keyof typeof SOCIAL_MEDIA_URLS, handle: string) => {
  const baseUrl = SOCIAL_MEDIA_URLS[platform];
  if (platform === 'instagram' && !handle.startsWith('@')) {
    return `${baseUrl}${handle}`;
  }
  if (platform === 'youtube' && !handle.startsWith('@')) {
    return `${baseUrl}@${handle}`;
  }
  if (platform === 'instagram' && handle.startsWith('@')) {
    return `${baseUrl}${handle.substring(1)}`;
  }
  if (platform === 'naver') {
    return `${baseUrl}${handle}`;
  }
  return `${baseUrl}${handle}`;
};
