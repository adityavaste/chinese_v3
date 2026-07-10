import { supabase } from "./supabase";

export async function registerGuest(deviceId: string) {
  const { data, error } = await supabase
    .from("guests")
    .upsert(
      {
        device_id: deviceId,
      },
      {
        onConflict: "device_id",
      }
    )
    .select()
    .single();

  if (error) {
  console.log("Supabase Error:", error);
  console.log("Message:", error.message);
  console.log("Details:", error.details);
  console.log("Hint:", error.hint);

  throw error;
}

  return data;
}

export async function getGuestByDeviceId(deviceId: string) {
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .eq("device_id", deviceId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}