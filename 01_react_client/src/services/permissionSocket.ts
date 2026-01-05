/**
 * Permission WebSocket Service
 * 
 * 권한 변경 실시간 알림을 위한 WebSocket 연결
 */

const WS_BASE_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:8000';

/**
 * 권한 변경 WebSocket 연결
 * 
 * @param onPermissionChanged 권한 변경 시 호출될 콜백
 * @returns WebSocket 인스턴스
 */
export const connectPermissionSocket = (
  onPermissionChanged: () => void
): WebSocket => {
  const ws = new WebSocket(`${WS_BASE_URL}/ws/permissions/`);

  ws.onopen = () => {
    console.log('[PermissionSocket] Connected');
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('[PermissionSocket] Message received:', data);

      if (
        data.type === 'PERMISSION_CHANGED' ||
        data.type === 'MENU_PERMISSION_UPDATED'
      ) {
        onPermissionChanged();
      }
    } catch (error) {
      console.error('[PermissionSocket] Failed to parse message:', error);
    }
  };

  ws.onerror = (error) => {
    console.error('[PermissionSocket] Error:', error);
  };

  ws.onclose = () => {
    console.log('[PermissionSocket] Disconnected');
  };

  return ws;
};
