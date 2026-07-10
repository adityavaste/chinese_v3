import { Order } from "./types";

export function dbToOrder(dbOrder: any): Order {
  return {
    id: dbOrder.id,
    orderNumber: dbOrder.order_number,
    customerInfo: dbOrder.customer_info,
    items: dbOrder.items,
    subtotal: Number(dbOrder.subtotal),
    tax: Number(dbOrder.tax),
    deliveryFee: Number(dbOrder.delivery_fee),
    total: Number(dbOrder.total),
    status: dbOrder.status,
    createdAt: dbOrder.created_at,
    estimatedPrepTime: dbOrder.estimated_prep_time,
    completedAt: dbOrder.completed_at,
  };
}

export function orderToDb(order: Order, guestId: string) {
  return {
    guest_id: guestId,
    order_number: order.orderNumber,
    customer_info: order.customerInfo,
    items: order.items,
    subtotal: order.subtotal,
    tax: order.tax,
    delivery_fee: order.deliveryFee,
    total: order.total,
    status: order.status,
    estimated_prep_time: order.estimatedPrepTime,
    completed_at: order.completedAt ?? null,
  };
}