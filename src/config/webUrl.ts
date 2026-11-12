import Constants from 'expo-constants';
import { Platform } from 'react-native';

const DEFAULT_PORT = 3000;

/**
 * Expo Go / Metro가 연결된 개발 PC의 LAN IP를 추출한다.
 * 예: hostUri "192.168.35.150:8081" → "192.168.35.150"
 */
function getDevMachineHost(): string | null {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    Constants.expoGoConfig?.debuggerHost ??
    Constants.linkingUri?.replace(/^[a-z]+:\/\//, '') ??
    null;

  if (!hostUri) {
    return null;
  }

  const host = hostUri.split(':')[0]?.trim();
  if (!host || host === '127.0.0.1' || host === 'localhost') {
    return null;
  }

  return host;
}

/**
 * 로컬 mylab-web 주소.
 * - Expo Go 실기기: Metro와 같은 LAN IP (예: http://192.168.x.x:3000)
 * - Android 에뮬레이터: 10.0.2.2
 * - iOS 시뮬레이터: localhost
 * - 덮어쓰기: EXPO_PUBLIC_WEB_URL
 */
export function getLocalWebUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_WEB_URL?.trim();
  if (fromEnv) {
    return fromEnv;
  }

  const lanHost = getDevMachineHost();
  if (lanHost) {
    return `http://${lanHost}:${DEFAULT_PORT}`;
  }

  if (Platform.OS === 'android') {
    return `http://10.0.2.2:${DEFAULT_PORT}`;
  }

  return `http://localhost:${DEFAULT_PORT}`;
}
