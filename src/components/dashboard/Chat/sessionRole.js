import { v4 as uuidv4 } from 'uuid';

export const halRoleForRunner = (runnerType) =>
  runnerType?.toLowerCase() === 'testllm' ? 'hal9000simple' : 'hal9000';

export const isHalSession = (sessionId) => {
  const separator = sessionId?.lastIndexOf(':') ?? -1;
  if (separator <= 0) return false;
  return ['hal', 'hal9000', 'halsimple', 'hal9000simple'].includes(
    sessionId.slice(separator + 1).toLowerCase()
  );
};

export const createConversationId = (runnerType, halEnabled) =>
  uuidv4() + (halEnabled ? `:${halRoleForRunner(runnerType)}` : '');

export const storeConversationId = (sessionId) => {
  localStorage.setItem('sessionId', sessionId);
  localStorage.setItem('sessionTimestamp', Date.now().toString());
};
