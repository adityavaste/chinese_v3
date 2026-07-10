import {
  getGuestDeviceId,
  getGuestId,
  saveGuestId,
} from "./guest";

import { registerGuest } from "./guest-service";

export async function initializeGuest() {
  // Already initialized
  const existingGuestId = getGuestId();

  if (existingGuestId) {
    return existingGuestId;
  }

  // Register this device
  const deviceId = getGuestDeviceId();

  const guest = await registerGuest(deviceId);

  saveGuestId(guest.id);

  return guest.id;
}