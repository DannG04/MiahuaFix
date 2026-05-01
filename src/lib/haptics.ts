import * as Haptics from 'expo-haptics';

let _enabled = true;

export function setHapticsEnabled(v: boolean) { _enabled = v; }
export function isHapticsEnabled() { return _enabled; }

const run = (fn: () => Promise<void>) => {
  if (_enabled) fn().catch(() => {});
};

export const haptic = {
  selection: () => run(() => Haptics.selectionAsync()),
  light:     () => run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  medium:    () => run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)),
  success:   () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  warning:   () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
  error:     () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)),
};
