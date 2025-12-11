import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
    totalItems: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Auto-calc totals before save
cartSchema.pre("save", async function () {
  let itemsCount = 0;
  let priceTotal = 0;

  this.items.forEach((item) => {
    itemsCount += item.quantity;
    priceTotal += item.quantity * item.price;
  });

  this.totalItems = itemsCount;
  this.totalPrice = priceTotal;
});

export const Cart = mongoose.model("Cart", cartSchema);
