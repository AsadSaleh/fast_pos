import { useState } from "react";
import { v4 } from "uuid";

type Product = {
  p_id: string;
  name: string;
  imageUrl: string;
  price: number;
};
type CartItem = {
  ci_id: string;
  quantity: number;
  product: Product;
};

const numberFormat = Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});
function currencyFmt(input: number) {
  return numberFormat.format(input);
}

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  function addToCart(product: (typeof products)[number]) {
    setCartItems((prevCartItems) => {
      const cartItemMatch =
        prevCartItems.find((item) => item.product.p_id === product.p_id) ??
        false;
      if (cartItemMatch) {
        return prevCartItems.map((item) => {
          if (item.ci_id === cartItemMatch.ci_id) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });
      }
      return prevCartItems.concat({ ci_id: v4(), quantity: 1, product });
    });
  }

  function addQty(cartItem: CartItem) {
    setCartItems((prevCartItems) =>
      prevCartItems.map((prevCartItem) =>
        prevCartItem.ci_id === cartItem.ci_id
          ? { ...prevCartItem, quantity: prevCartItem.quantity + 1 }
          : prevCartItem
      )
    );
  }

  function decreaseQty(cartItem: CartItem) {
    setCartItems((prevCartItems) => {
      // condition 1: if qty === 1, remove item form cartItems.
      if (cartItem.quantity === 1) {
        return prevCartItems.filter(
          (prevCartItem) => prevCartItem.ci_id !== cartItem.ci_id
        );
      }

      // condition 2: if qty >= 2, decrease the qty 1.
      return prevCartItems.map((prevCartItem) =>
        prevCartItem.ci_id === cartItem.ci_id
          ? { ...prevCartItem, quantity: prevCartItem.quantity - 1 }
          : prevCartItem
      );
    });
  }

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = new FormData(e.currentTarget);

    const a = Object.fromEntries(data);
    console.log({ a });
  }

  const subTotal = cartItems.reduce(
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {products.map((product) => (
            <ProductCard
              key={product.p_id}
              product={product}
              onClick={() => addToCart(product)}
            />
          ))}
        </div>
      </div>

      {/* Cart section */}
      <div className="border p-2 flex flex-col justify-between">
        <div>
          {/* Cart title and close button */}
          <div className="flex items-center justify-between">
            <h4 className="text-2xl">Cart</h4>
            <button className="border rounded-full py-1 px-4">new cust</button>
          </div>

          {/* Cart main content */}
          <div className="mt-8">
            <form onSubmit={handleFormSubmit} id="cart">
              <input
                name="customer_name"
                placeholder="Customer Name...."
                className="rounded-md p-2 bg-gray-300 focus:bg-white"
                required
              />
            </form>

            <div className="mt-4">
              <p className="font-bold">Items</p>
              {cartItems.length === 0 ? (
                <div className="py-1 italic text-gray-500">No items yet</div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.ci_id}
                    className="flex items-center justify-between mt-2"
                  >
                    <h4>{item.product.name}</h4>
                    <div className="">
                      <p className="text-right">
                        {currencyFmt(item.quantity * item.product.price)}
                      </p>
                      <div className="flex">
                        <button
                          className="bg-gray-200 w-8"
                          onClick={() => decreaseQty(item)}
                        >
                          -
                        </button>
                        <input
                          value={item.quantity}
                          className="w-10 text-center"
                        />
                        <button
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
                ({cartItems.reduce((acc, val) => acc + val.quantity, 0)} items)
              </p>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex gap-4 flex-col mb-4">
          <input
            form="cart"
            className=" bg-white text-green-700 text-xl w-full rounded-md py-2 border-green-700 border"
            type="submit"
            name="submission_type"
            value="Open Bill"
          ></input>

          <input
            form="cart"
            className="bg-blue-700 text-white text-xl w-full rounded-md py-2"
            type="submit"
            name="submission_type"
            value="Payment"
          ></input>
        </div>
      </div>
    </main>
  );
}

function ProductCard({
  product,
  onClick,
}: {
  product: (typeof products)[number];
  onClick?: VoidFunction;
}) {
  return (
    <button
      className="p-6 bg-white rounded-lg border border-gray-200 shadow-md active:scale-95 transition"
      onClick={onClick}
    >
      <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
        <p>{product.name}</p>
      </h2>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img
            className="w-30 h-14 aspect-square rounded-full"
            src={product.imageUrl}
            alt="Jese Leos avatar"
          />
        </div>
        <p>{currencyFmt(product.price)}</p>
      </div>
    </button>
  );
}

const products: Product[] = [
  {
    p_id: v4(),
    name: "Espresso",
    imageUrl:
      "https://img.freepik.com/free-photo/hot-coffee-mug-with-cream-rustic-wooden-table_123827-26354.jpg?size=626&ext=jpg&ga=GA1.1.1624922228.1701239498&semt=sph",
    price: 10_000,
  },
  {
    p_id: v4(),
    name: "Americano",
    imageUrl:
      "https://img.freepik.com/free-photo/glass-with-iced-coffee-table_23-2148937324.jpg?size=626&ext=jpg&ga=GA1.1.1624922228.1701239498&semt=sph",
    price: 14_000,
  },
  {
    p_id: v4(),
    name: "Cappucino",
    imageUrl:
      "https://img.freepik.com/premium-photo/hot-coffee-cappuccino-with-foam-white-background_33725-33.jpg?w=2000",
    price: 16_000,
  },
  {
    p_id: v4(),
    name: "Caffe Latte",
    imageUrl:
      "https://img.freepik.com/premium-photo/cup-coffee-with-design-top-it_787273-798.jpg?size=626&ext=jpg&ga=GA1.1.1624922228.1701239498&semt=ais",
    price: 16_000,
  },
  {
    p_id: v4(),
    name: "Ristreto",
    imageUrl:
      "https://img.freepik.com/premium-photo/hot-coffee-with-coffee-beans-wood-table_41969-15964.jpg?size=626&ext=jpg&ga=GA1.1.1624922228.1701239498&semt=sph",
    price: 12_000,
  },
  {
    p_id: v4(),
    name: "Lungo",
    imageUrl:
      "https://img.freepik.com/premium-photo/espresso-coffee-with-beans_839182-15276.jpg?size=626&ext=jpg&ga=GA1.1.1624922228.1701239498&semt=sph",
    price: 12_000,
  },
  {
    p_id: v4(),
    name: "Machiato",
    imageUrl:
      "https://img.freepik.com/premium-photo/glass-glass-latte-macchiato-coffee-table-cafe-ai-generated_447653-2737.jpg?size=626&ext=jpg&ga=GA1.1.1624922228.1701239498&semt=sph",
    price: 19_000,
  },
];
