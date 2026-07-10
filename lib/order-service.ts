import { supabase } from "./supabase";

export async function createOrder(order: any) {
  const { data, error } = await supabase
    .from("orders")
    .insert(order)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function getOrdersByGuest(guestId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("guest_id", guestId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function getAllOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function updateOrderStatus(
  orderNumber: string,
  status: string
) {
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("order_number", orderNumber)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function getOrderByNumber(orderNumber: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .single();

  if (error) throw error;

  return data;
}