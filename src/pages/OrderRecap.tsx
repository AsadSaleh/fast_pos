import { useNavigate, useSearch } from "@tanstack/react-router";
import { orderRecapRoute } from "../Router";
import { numberFmt } from "../helper";
import { useState } from "react";
import { createOrder } from "../repositories";

export default function OrderRecap() {
  const [paymentMethod, setPaymentMethod] = useState<
    "qris" | "gopay" | "dana" | null
  >(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const search = useSearch({ from: orderRecapRoute.id });
  const { orderItems } = search;
  const subTotal = orderItems.reduce(
    (acc, val) => acc + val.quantity * val.product.price,
    0
  );
  const tax11percent = subTotal * 0.11;
  const total = subTotal + tax11percent;

  async function continuePayment(formData: {
    customerName: string;
    customerAddress: string;
    customerPhone: string;
  }) {
    // Validate input:
    if (paymentMethod === null) {
      setShake(true);
      setTimeout(() => {
        setShake(false);
      }, 600);
      return;
    }

    // Save trx to DB:
    setLoading(true);
    const res = await createOrder({
      customer_name: formData.customerName,
      customer_address: formData.customerAddress,
      customer_phone: formData.customerPhone,
      items: orderItems,
    });
    if (res.error != null) {
      console.log("error: ", res.error);
      setLoading(false);
      return;
    }

    console.log("hasil mutation ke supabase: ", res.data[0].id);

    // Navigate to next screen:
    navigate({ to: "/payment", search: { orderId: res.data[0].id } });
  }

  return (
    <main className="mx-auto w-full p-4 lg:w-3/5 mt-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const customerName = formData.get("customer_name") as string;
          const customerAddress = formData.get("customer_address") as string;
          const customerPhone = formData.get("customer_phone") as string;
          continuePayment({ customerName, customerAddress, customerPhone });
        }}
      >
        <div className="text-3xl">Order Recap</div>
        <div className="mt-2 text-xl">1. Check Order Items</div>
        <div className="mt-1">
          <div className="border rounded-lg">
            <div className="flex flex-row rounded-t-lg bg-slate-300">
              <div className="flex-1 p-2 px-3 text-slate-600">Menu</div>
              <div className="flex-1 p-2 px-3 text-slate-600">Unit price</div>
              <div className="p-2 px-3 text-slate-600">Qty</div>
              <div className="flex-1 p-2 px-3 text-slate-600 text-right">
                Total
              </div>
            </div>
            {orderItems.map((orderItem) => {
              const unitPrice = orderItem.product.price;
              const price = unitPrice * orderItem.quantity;
              return (
                <div
                  key={orderItem.id}
                  className="border last:rounded-b-lg flex flex-row"
                >
                  <div className="flex-1 p-3">{orderItem.product.name}</div>
                  <div className="flex-1 p-3">{numberFmt(unitPrice)}</div>
                  <div className="flex p-3">{orderItem.quantity}</div>
                  <div className="flex-1 p-3 text-right">
                    {numberFmt(price)}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-4 items-center justify-end mt-2">
            <div>Subtotal</div>
            <div className="w-20 text-right">{numberFmt(subTotal)}</div>
          </div>
          <div className="flex gap-4 items-center justify-end">
            <div>Tax (11%)</div>
            <div className="w-20 text-right">{numberFmt(tax11percent)}</div>
          </div>
          <div className="flex gap-4 items-center justify-end">
            <div>Total</div>
            <div className="w-20 text-right font-bold text-lg">
              {numberFmt(total)}
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <h4 className="text-xl">2. Input Customer Information</h4>
        </div>
        <div className="flex gap-2 mt-2">
          <input
            name="customer_name"
            placeholder="Customer name"
            className="rounded-md p-2 bg-gray-200 focus:bg-white"
            required
          />
          <input
            name="customer_phone"
            placeholder="Phone number"
            className="rounded-md p-2 bg-gray-200 focus:bg-white"
            required
          />
          <input
            name="customer_address"
            placeholder="Address"
            className="rounded-md p-2 bg-gray-200 focus:bg-white w-80"
            required
          />
        </div>
        {/* Payment Method */}
        <div className="mt-8 flex items-center justify-between">
          <h4 className="text-xl">3. Choose Payment Method</h4>
          {paymentMethod !== null ? (
            <button
              onClick={() => setPaymentMethod(null)}
              type="button"
              className="bg-slate-200 px-4 py-1 rounded-md text-sm active:scale-90 transition"
            >
              Unselect
            </button>
          ) : null}
        </div>
        <div
          className={`grid grid-cols-3 gap-4 mt-2 transition-all ${
            shake ? "animate-shaking" : ""
          }`}
        >
          <button
            onClick={() => setPaymentMethod("qris")}
            type="button"
            className="bg-slate-100 h-20 flex items-center justify-center rounded-md active:scale-95 transition relative"
          >
            {paymentMethod === "qris" ? (
              <div className="absolute right-2 top-2 text-white bg-green-700 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            ) : null}
            <img
              src="https://seeklogo.com/images/Q/quick-response-code-indonesia-standard-qris-logo-F300D5EB32-seeklogo.com.png"
              className="max-h-16"
            />
          </button>
          <button
            type="button"
            className="bg-slate-300 h-20 flex items-center justify-center rounded-md p-4 cursor-not-allowed"
          >
            <img
              src="https://1.bp.blogspot.com/-NwSMFZdU8l4/XZxj8FxN6II/AAAAAAAABdM/oTjizwstkRIqQZ7LOZSPMsUG3EYXF3E4wCEwYBhgL/s400/logo-gopay-vector.png"
              className="max-h-16"
            />
          </button>
          <button
            type="button"
            className="bg-slate-300 h-20 flex items-center justify-center rounded-md p-4 cursor-not-allowed"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Logo_dana_blue.svg/512px-Logo_dana_blue.svg.png"
              className="max-h-16"
            />
          </button>
        </div>

        <div className="mt-10">
          <button
            type="submit"
            className="disabled:bg-slate-600 flex items-center justify-center gap-2 enabled:hover:gap-4 transition-all bg-green-700 px-4 py-4 w-full rounded-md text-white enabled:active:scale-95"
          >
            <div className="text-2xl">Continue Payment</div>
            {loading ? (
              <svg
                className="animate-spin h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            )}
          </button>
        </div>
      </form>
    </main>
  );
}
