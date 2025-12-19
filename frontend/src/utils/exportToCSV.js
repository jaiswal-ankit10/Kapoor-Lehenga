export const exportToCSV = (data, filename = "data.csv") => {
  if (!data.length) return;

  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers.map((header) => `"${row[header]}"`).join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

export const formatUsersForCSV = (users) => {
  return users.map((u, index) => ({
    "S.No": index + 1,
    "Full Name": u.fullName,
    Email: u.email,
    Mobile: u.mobile || "-",
    Role: u.role,
    "Joined Date": new Date(u.createdAt).toLocaleDateString(),
  }));
};

export const formatOrdersForCSV = (orders) => {
  return orders.map((order, index) => ({
    "S.No": index + 1,
    "Order ID": order.orderId,
    "Customer Email": order.user?.email || "",
    "Order Status": order.status,
    "Payment Method": order.paymentMethod,
    "Total Amount": order.totalAmount,
    "Order Date": new Date(order.createdAt).toLocaleDateString(),
  }));
};

export const formatPaymentHistorForCSV = (payments) => {
  return payments.map((payment, index) => ({
    "S.No": index + 1,
    "Order By": payment.user.email,
    "Order Number": payment.orderId,
    "Order Status": payment.status,
    "Payment Method": payment.paymentMethod,
    "Total Amount": payment.totalAmount,
    "Order Date": new Date(payment.createdAt).toLocaleDateString(),
  }));
};
