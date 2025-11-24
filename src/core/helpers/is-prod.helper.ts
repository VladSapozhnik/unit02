import { settings } from '../settings/settings';

export const isProdHelper = (): boolean => settings.NODE_ENV === 'production';
