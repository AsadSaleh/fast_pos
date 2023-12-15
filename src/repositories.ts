import { createClient } from "@supabase/supabase-js";
import { OrderItem } from "./Router";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_API_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

export async function getProducts() {
  return await supabase.from("product").select("*").eq("archived", false);
}

export async function createOrder(payload: {
  items: OrderItem[];
  customer_name: string;
  customer_address: string;
  customer_phone: string;
}) {
  return await supabase.from("order").insert(payload);
}

export async function getOrderById(id: number) {
  return await supabase.from("order").select("*").eq("id", id);
}
