import { v4 as uuid } from "uuid";

const DEVICE_ID_KEY = "dragon-palace-device-id";
const GUEST_ID_KEY = "dragon-palace-guest-id";

export function getGuestDeviceId() {
  if (typeof window === "undefined") return "";

  let deviceId = localStorage.getItem(DEVICE_ID_KEY);

  if (!deviceId) {
    deviceId = uuid();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }

  return deviceId;
}

export function getGuestId() {
  if (typeof window === "undefined") return "";

  return localStorage.getItem(GUEST_ID_KEY);
}

export function saveGuestId(id: string) {
  localStorage.setItem(GUEST_ID_KEY, id);
}