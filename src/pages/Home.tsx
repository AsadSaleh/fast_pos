import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
// import { v4 } from "uuid";
import { getProducts } from "../repositories";
import { OrderItem, Product } from "../Router";
import { currencyFmt, numberGen } from "../helper";

// type Product = {
//   id: string;
//   name: string;
//   imageUrl: string;
//   price: number;
// };
// type OrderItem = {
//   ci_id: string;
//   quantity: number;
//   product: Product;
// };

export default function Home() {
  const productsQuery = useQuery({
    queryKey: ["product", "list"],
    queryFn: getProducts,
  });
  const navigate = useNavigate();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  function addToCart(product: Product) {
    setOrderItems((prevCartItems) => {
      const cartItemMatch =
        prevCartItems.find((item) => item.product.id === product.id) ?? false;
      if (cartItemMatch) {
        return prevCartItems.map((item) => {
          if (item.id === cartItemMatch.id) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });
      }
      return prevCartItems.concat({ id: numberGen(), quantity: 1, product });
    });
  }

  function addQty(cartItem: OrderItem) {
    setOrderItems((prevCartItems) =>
      prevCartItems.map((prevCartItem) =>
        prevCartItem.id === cartItem.id
          ? { ...prevCartItem, quantity: prevCartItem.quantity + 1 }
          : prevCartItem
      )
    );
  }

  function decreaseQty(cartItem: OrderItem) {
    setOrderItems((prevCartItems) => {
      // condition 1: if qty === 1, remove item form cartItems.
      if (cartItem.quantity === 1) {
        return prevCartItems.filter(
          (prevCartItem) => prevCartItem.id !== cartItem.id
        );
      }

      // condition 2: if qty >= 2, decrease the qty 1.
      return prevCartItems.map((prevCartItem) =>
        prevCartItem.id === cartItem.id
          ? { ...prevCartItem, quantity: prevCartItem.quantity - 1 }
          : prevCartItem
      );
    });
  }

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    // const customerName = data.get("customer_name") as string;

    const a = Object.fromEntries(data);
    console.log(a);
    navigate({
      from: "/",
      to: "/order-recap",
      search: { orderItems },
    });
  }

  const subTotal = orderItems.reduce(
    (acc, val) => acc + val.quantity * val.product.price,
    0
  );
  const tax11percent = subTotal * 0.11;
  const total = subTotal + tax11percent;

  return (
    <main className="min-h-screen mx-auto grid grid-cols-3 gap-2">
      {/* Products section */}
      <div className="col-span-2 p-2">
        <h1 className="text-2xl mt-4">Menu</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
          {productsQuery.data?.data?.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => addToCart(product)}
            />
          ))}
        </div>
      </div>

      {/* Cart section */}
      <form
        onSubmit={handleFormSubmit}
        id="cart"
        className="border-l p-4 flex flex-col gap-10"
      >
        <div>
          {/* Cart title and close button */}
          <div className="flex items-center justify-between">
            <h4 className="text-2xl">Cart</h4>
            <button type="button" className="border rounded-full py-1 px-4">
              new cust
            </button>
          </div>

          {/* Cart main content */}
          <div className="mt-8">
            {/* <input
              name="customer_name"
              placeholder="Customer Name...."
              className="rounded-md p-2 bg-gray-300 focus:bg-white"
              required
            /> */}

            <div className="mt-4">
              <p className="font-bold">Items</p>
              {orderItems.length === 0 ? (
                <div className="py-1 italic text-gray-500">No items yet</div>
              ) : (
                orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between mt-2"
                  >
                    <h4>{item.product.name}</h4>
                    <div className="">
                      <p className="text-right">
                        {currencyFmt(item.quantity * item.product.price)}
                      </p>
                      <div className="flex">
                        <button
                          type="button"
                          className="bg-gray-200 w-8"
                          onClick={() => decreaseQty(item)}
                        >
                          -
                        </button>
                        <input
                          value={item.quantity}
                          className="w-10 text-center"
                          readOnly
                        />
                        <button
                          type="button"
                          className="bg-gray-200 w-8"
                          onClick={() => addQty(item)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              <div className="w-full h-[2px] rounded-md bg-gray-200 mt-4"></div>
              <p className="mt-2 flex justify-between">
                <span>Subtotal</span>
                <span>{currencyFmt(subTotal)}</span>
              </p>
              <p className="flex justify-between">
                <span>Tax 11%</span>
                <span>{currencyFmt(tax11percent)}</span>
              </p>

              <p className="mt-2 text-xl font-bold flex justify-between">
                <span>Total</span>
                <span>{currencyFmt(total)}</span>
              </p>

              <p className="text-right text-gray-700 text-sm">
                ({orderItems.reduce((acc, val) => acc + val.quantity, 0)} items)
              </p>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex gap-4 flex-col mb-4">
          {/* <input
            form="cart"
            className=" bg-white text-green-700 text-xl w-full rounded-md py-2 border-green-700 border"
            type="submit"
            name="submission_type"
            value="Open Bill"
          ></input> */}

          <button
            form="cart"
            className="bg-blue-700 text-white text-xl w-full rounded-md py-2"
          >
            Payment
          </button>
        </div>
      </form>
    </main>
  );
}

function ProductCard({
  product,
  onClick,
}: {
  product: Product;
  onClick?: VoidFunction;
}) {
  return (
    <button
      className=" bg-white rounded-lg border border-gray-200 shadow-md active:scale-95 transition flex flex-col justify-between"
      onClick={onClick}
    >
      <div className="flex rounded-t-lg bg-slate-200 w-full items-center justify-center">
        <img
          src={product.image_url ?? ""}
          className="rounded-lg w-auto h-auto max-h-80"
        />
      </div>
      <div className="py-2 px-4">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 text-left">
          {product.name}
        </h2>
        <p className="text-left text-slate-500">{product.description}</p>
        <div className="flex justify-between items-center">
          <p>{currencyFmt(product.price)}</p>
        </div>
      </div>
    </button>
  );
}
