import { useSearch } from "@tanstack/react-router";
import { paymentRoute } from "../Router";
// import { numberFmt } from "../helper";
import { useState } from "react";

export default function Payment() {
  const [paymentMethod, setPaymentMethod] = useState<
    "qris" | "gopay" | "dana" | null
  >(null);
  const search = useSearch({ from: paymentRoute.id });
  console.log({ search });
  // const { orderItems } = search;
  // const subTotal = orderItems.reduce(
  //   (acc, val) => acc + val.quantity * val.product.price,
  //   0
  // );
  // const tax11percent = subTotal * 0.11;
  // const total = subTotal + tax11percent;

  return (
    <main className="mx-auto w-full p-4 lg:w-3/5 mt-5">
      <div className="text-3xl">Payment</div>
      <div className="mt-4">
        Customer name: <b>Fulan</b>
      </div>
      <div className="mt-2">Order Items</div>
      <div className="mt-1">
        <div className="border">
          <div className="flex flex-row bg-slate-300">
            <div className="flex-1 px-3 text-slate-600">Menu</div>
            <div className="flex-1 px-3 text-slate-600">Unit price</div>
            <div className="flex-1 px-3 text-slate-600">Qty</div>
            <div className="flex-1 px-3 text-slate-600 text-right">Total</div>
          </div>
          {/* {[].map((orderItem) => {
            const unitPrice = orderItem.product.price;
            const price = unitPrice * orderItem.quantity;
            return (
              <div key={orderItem.id} className="border flex flex-row">
                <div className="flex-1 p-3">{orderItem.product.name}</div>
                <div className="flex-1 p-3">{numberFmt(unitPrice)}</div>
                <div className="flex-1 p-3">x{orderItem.quantity}</div>
                <div className="flex-1 p-3 text-right">{numberFmt(price)}</div>
              </div>
            );
          })} */}
        </div>

        <div className="flex gap-4 items-center justify-end mt-2">
          <div>Subtotal</div>
          {/* <div className="w-20 text-right">{numberFmt(subTotal)}</div> */}
        </div>
        <div className="flex gap-4 items-center justify-end">
          <div>Tax (11%)</div>
          {/* <div className="w-20 text-right">{numberFmt(tax11percent)}</div> */}
        </div>
        <div className="flex gap-4 items-center justify-end">
          <div>Total</div>
          <div className="w-20 text-right font-bold text-lg">
            {/* {numberFmt(total)} */}
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mt-8 flex items-center justify-between">
        <h4 className="text-xl">Choose Payment Method</h4>
        {paymentMethod !== null ? (
          <button
            onClick={() => setPaymentMethod(null)}
            className="bg-slate-200 px-4 py-1 rounded-md text-sm active:scale-90 transition"
          >
            Cancel
          </button>
        ) : null}
      </div>
      <div className="grid grid-cols-3 gap-4 mt-2">
        <button
          onClick={() => setPaymentMethod("qris")}
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
        <button className="bg-slate-300 h-20 flex items-center justify-center rounded-md p-4 cursor-not-allowed">
          <img
            src="https://1.bp.blogspot.com/-NwSMFZdU8l4/XZxj8FxN6II/AAAAAAAABdM/oTjizwstkRIqQZ7LOZSPMsUG3EYXF3E4wCEwYBhgL/s400/logo-gopay-vector.png"
            className="max-h-16"
          />
        </button>
        <button className="bg-slate-300 h-20 flex items-center justify-center rounded-md p-4 cursor-not-allowed">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Logo_dana_blue.svg/512px-Logo_dana_blue.svg.png"
            className="max-h-16"
          />
        </button>
      </div>

      <div className="mt-10">
        <button
          disabled={paymentMethod === null}
          className="disabled:bg-slate-600 flex items-center justify-center gap-2 enabled:hover:gap-4 transition-all bg-green-700 px-4 py-4 w-full rounded-md text-white enabled:active:scale-95"
        >
          <div className="text-2xl">Continue Payment</div>
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
        </button>
      </div>
    </main>
  );
}
