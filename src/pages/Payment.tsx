import { useSearch } from "@tanstack/react-router";
import { OrderItem, orderItemArraySchema, paymentRoute } from "../Router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getOrderById } from "../repositories";
import { numberFmt } from "../helper";

export default function Payment() {
  const search = useSearch({ from: paymentRoute.id });

  const query = useQuery({
    queryKey: ["payment", search.orderId],
    queryFn: () => getOrderById(search.orderId),
  });

  console.log(query);

  if (query.data) {
    let items: OrderItem[] = [];
    const parsed = orderItemArraySchema.safeParse(query.data.data?.items);

    if (parsed.success) {
      items = parsed.data;
    }
    const subTotal = items.reduce(
      (acc, val) => acc + val.quantity * val.product.price,
      0
    );
    const tax11percent = subTotal * 0.11;
    const total = subTotal + tax11percent;

    return (
      <main className="mx-auto w-full p-4 lg:w-2/5 mt-5">
        {/* Pembayaran */}
        <div>
          <div className="flex justify-between items-center">
            <div className="text-3xl">Pembayaran</div>
            <div className="badge">
              Status:{" "}
              <span className="underline">
                {mapStatusToText(query.data.data?.status)}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <Countdown deadline={query.data?.data?.deadline_at ?? ""} />
            <img src="/images/random_qr_code.png" alt="qr code" />
            <p>PT Asad Software Engineer Pro</p>
            <p className="text-xl font-bold">Rp{numberFmt(total)}</p>
          </div>
        </div>

        {/* Detail Customer */}
        <div className="mt-10">
          <div className="mt-8 flex items-center justify-between">
            <h4 className="text-3xl">Detail Customer</h4>
          </div>
          <div className="flex gap-2 mt-2">
            <input
              name="customer_name"
              placeholder="Customer name"
              value={query.data.data?.customer_name}
              className="rounded-md p-2 bg-gray-200"
              readOnly
            />
            <input
              name="customer_phone"
              placeholder="Phone number"
              value={query.data.data?.customer_phone}
              className="rounded-md p-2 bg-gray-200"
              readOnly
            />
            <input
              name="customer_address"
              placeholder="Address"
              value={query.data.data?.customer_address}
              className="rounded-md p-2 bg-gray-200 w-80"
              readOnly
            />
          </div>
        </div>

        {/* Detail Pesanan */}
        <div className="mt-10">
          <h4 className="text-3xl">Detail Pesanan</h4>
          <div className="border mt-2 rounded-lg">
            <div className="flex flex-row rounded-t-lg bg-slate-300">
              <div className="flex-1 p-2 px-3 text-slate-600">Menu</div>
              <div className="flex-1 p-2 px-3 text-slate-600">Unit price</div>
              <div className="p-2 px-3 text-slate-600">Qty</div>
              <div className="flex-1 p-2 px-3 text-slate-600 text-right">
                Total
              </div>
            </div>
            {items.map((orderItem) => {
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
      </main>
    );
  }

  return null;
}

function mapStatusToText(status?: "pending" | "paid" | "failed_timeout") {
  if (status === "pending") {
    return "Menunggu Pembayaran";
  }
  if (status === "paid") {
    return "Pembayaran Berhasil";
  }
  if (status === "failed_timeout") {
    return "Pembayaran Gagal, Waktu Habis";
  }
  return "";
}

function Countdown({ deadline }: { deadline: string }) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setTick((p) => p + 1);
    }, 1000);
    return () => clearInterval(timerId);
  });

  const timeLeft = calculateTimeLeft(deadline);
  if (
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0
  ) {
    return <div>Waktu habis!</div>;
  }
  return (
    <div>
      <p>Mohon bayar sebelum {new Date(deadline).toLocaleString()}</p>
      <p>Kamu memiliki waktu:</p>
      <p>
        {timeLeft.hours} jam : {timeLeft.minutes} menit : {timeLeft.seconds}{" "}
        detik
      </p>
    </div>
  );
}

const calculateTimeLeft = (deadline: string) => {
  const now = new Date();
  const difference = new Date(deadline).getTime() - now.getTime();

  if (difference > 0) {
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  } else {
    return { hours: 0, minutes: 0, seconds: 0 };
  }
};
