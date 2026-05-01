import * as SecureStore from 'expo-secure-store';

const KEY_ANON_ID   = 'miahua.anon_id';
const KEY_ONBOARDED = 'miahua.onboarded';

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function getAnonId(): Promise<string> {
  const stored = await SecureStore.getItemAsync(KEY_ANON_ID);
  if (stored) return stored;

  const id = generateUUID();
  await SecureStore.setItemAsync(KEY_ANON_ID, id);
  return id;
}

// Returns the first 8 hex chars formatted as "xxxx-xxxx" (shown in profile as #xxxx-xxxx).
export async function getAnonIdShort(): Promise<string> {
  const id = await getAnonId();
  const hex = id.replace(/-/g, '');
  return `${hex.slice(0, 4)}-${hex.slice(4, 8)}`;
}

export async function regenerateAnonId(): Promise<string> {
  await SecureStore.deleteItemAsync(KEY_ANON_ID);
  return getAnonId();
}

// ─── Onboarding flag ──────────────────────────────────────────────────────────

export async function hasOnboarded(): Promise<boolean> {
  const value = await SecureStore.getItemAsync(KEY_ONBOARDED);
  return value === 'true';
}

export async function markOnboarded(): Promise<void> {
  await SecureStore.setItemAsync(KEY_ONBOARDED, 'true');
}
