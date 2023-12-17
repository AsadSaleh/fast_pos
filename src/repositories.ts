import { createClient } from "@supabase/supabase-js";
import { OrderItem } from "./Router";
import { addHours } from "date-fns";
import { Database } from "./supabase";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_API_KEY;

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_API_KEY);

export async function getProducts() {
  return await supabase.from("product").select("*").eq("archived", false);
}

export async function createOrder(payload: {
  items: OrderItem[];
  customer_name: string;
  customer_address: string;
  customer_phone: string;
}) {
  return await supabase
    .from("order")
    .insert({ ...payload, deadline_at: addHours(new Date(), 1).toUTCString() })
    .select();
}

export async function getOrderById(id: number) {
  return await supabase.from("order").select("*").eq("id", id).single();
}
