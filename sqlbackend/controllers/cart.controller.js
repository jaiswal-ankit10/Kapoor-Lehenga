import prisma from "../config/prisma.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";

/* ---------- helper: recalc totals ---------- */
const recalcTotals = async (cartId) => {
  const items = await prisma.cartItem.findMany({
    where: { cartId },
    select: { quantity: true, price: true },
  });

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.quantity * i.price, 0);

  return prisma.cart.update({
    where: { id: cartId },
    data: { totalItems, totalPrice },
  });
};

/* ================= ADD TO CART ================= */
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, price, quantity = 1 } = req.body;
  const userId = req.user.id;

  if (!productId || !price) {
    throw new ApiError(400, "productId and price are required");
  }

  const cart = await prisma.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });

  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId,
    },
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + Number(quantity) },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity: Number(quantity),
        price: Number(price),
      },
    });
  }

  await recalcTotals(cart.id);

  const updatedCart = await prisma.cart.findUnique({
    where: { id: cart.id },
    include: {
      items: { include: { product: true } },
    },
  });

  res.status(200).json({
    success: true,
    message: "Item added to cart",
    cart: updatedCart,
  });
});

/* ================= UPDATE ITEM ================= */
export const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  const cart = await prisma.cart.findUnique({
    where: { userId },
  });
  if (!cart) throw new ApiError(404, "Cart not found");

  const item = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId },
  });
  if (!item) throw new ApiError(404, "Item not found in cart");

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: item.id } });
  } else {
    await prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity: Number(quantity) },
    });
  }

  await recalcTotals(cart.id);

  const updatedCart = await prisma.cart.findUnique({
    where: { id: cart.id },
    include: {
      items: { include: { product: true } },
    },
  });

  res.status(200).json({
    success: true,
    message: "Cart updated",
    cart: updatedCart,
  });
});

/* ================= REMOVE ITEM ================= */
export const removeCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  const cart = await prisma.cart.findUnique({
    where: { userId },
  });
  if (!cart) throw new ApiError(404, "Cart not found");

  const item = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId },
  });
  if (!item) throw new ApiError(404, "Item not found");

  await prisma.cartItem.delete({ where: { id: item.id } });
  await recalcTotals(cart.id);

  const updatedCart = await prisma.cart.findUnique({
    where: { id: cart.id },
    include: {
      items: { include: { product: true } },
    },
  });

  res.status(200).json({
    success: true,
    message: "Item removed",
    cart: updatedCart,
  });
});

/* ================= GET CART ================= */
export const getCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: { include: { product: true } },
    },
  });

  res.status(200).json({
    success: true,
    cart: cart || null,
  });
});

/* ================= CLEAR CART ================= */
export const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const cart = await prisma.cart.findUnique({
    where: { userId },
  });
  if (!cart) throw new ApiError(404, "Cart not found");

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });

  await prisma.cart.update({
    where: { id: cart.id },
    data: { totalItems: 0, totalPrice: 0 },
  });

  res.status(200).json({
    success: true,
    message: "Cart cleared",
    cart: { ...cart, items: [] },
  });
});
