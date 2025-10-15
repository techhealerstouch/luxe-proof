"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { getOrders, Order } from "@/lib/api-order";
import {
  getStatusBadgeOrder,
  getShipmentStatusBadgeOrder,
} from "@/utils/badges";
import {
  Search,
  Package,
  Download,
  RefreshCw,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MapPin,
  Phone,
  User,
  Truck,
  DollarSign,
  Eye,
  Mail,
  Calendar,
  Hash,
} from "lucide-react";
import { formatTimeAgo } from "@/utils/formatting";

export default function NFCOrderDashboard() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [from, setFrom] = useState<number>(0);
  const [to, setTo] = useState<number>(0);

  const fetchOrders = async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await getOrders(page, perPage);
      if (response.success) {
        setOrders(response.data.data);
        setCurrentPage(response.data.current_page);
        setLastPage(response.data.last_page);
        setTotal(response.data.total);
        setFrom(response.data.from);
        setTo(response.data.to);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [perPage]);

  const filteredOrders = orders.filter((order) =>
    Object.values(order).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalValue = filteredOrders.reduce(
    (sum, order) => sum + parseFloat(order.amount || "0"),
    0
  );
  const totalQuantity = filteredOrders.reduce(
    (sum, order) => sum + (order.quantity || 0),
    0
  );

  const handleRefresh = () => {
    fetchOrders(currentPage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchOrders(page);
  };

  const handlePerPageChange = (value: string) => {
    setPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setSheetOpen(true);
  };

  const handleExport = () => {
    const headers = [
      "Invoice Number",
      "Shipment Number",
      "Customer Name",
      "Customer Email",
      "Package Type",
      "Quantity",
      "Amount",
      "Shipping Cost",
      "Order Status",
      "Shipment Status",
      "Created Date",
    ];

    const rows = filteredOrders.map((order) => [
      order.invoice_number || "",
      order.shipment?.shipment_number || "",
      order.user?.name || order.added_by?.name || "",
      order.user?.email || "",
      order.credit_name || "",
      order.quantity?.toString() || "",
      parseFloat(order.amount || "0").toFixed(2),
      parseFloat(order.shipping_cost || "0").toFixed(2),
      order.status || "",
      order.shipment?.status || "",
      new Date(order.created_at).toLocaleDateString(),
    ]);

    const escapeCSV = (value: string) => {
      if (value.includes(",") || value.includes('"') || value.includes("\n")) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `nfc-orders-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">NFC Orders</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track your orders
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Units
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalQuantity.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Value
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₱
                {totalValue.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Export */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                variant="outline"
                onClick={handleExport}
                disabled={filteredOrders.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Loading orders...
                  </p>
                </div>
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="space-y-4">
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr className="border-b">
                        <th className="text-left p-3 text-xs font-medium text-muted-foreground">
                          Invoice
                        </th>
                        <th className="text-left p-3 text-xs font-medium text-muted-foreground">
                          Customer
                        </th>
                        <th className="text-left p-3 text-xs font-medium text-muted-foreground">
                          Package
                        </th>
                        <th className="text-right p-3 text-xs font-medium text-muted-foreground">
                          Qty
                        </th>
                        <th className="text-right p-3 text-xs font-medium text-muted-foreground">
                          Amount
                        </th>
                        <th className="text-left p-3 text-xs font-medium text-muted-foreground">
                          Order Status
                        </th>
                        <th className="text-left p-3 text-xs font-medium text-muted-foreground">
                          Shipment
                        </th>
                        <th className="text-left p-3 text-xs font-medium text-muted-foreground">
                          Created
                        </th>
                        <th className="text-center p-3 text-xs font-medium text-muted-foreground">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-b hover:bg-muted/30 transition-colors"
                        >
                          <td className="p-3">
                            <div className="font-medium text-sm">
                              {order.invoice_number}
                            </div>
                            {order.shipment?.shipment_number && (
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {order.shipment.shipment_number}
                              </div>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="text-sm font-medium">
                              {order.user?.name ||
                                order.added_by?.name ||
                                "N/A"}
                            </div>
                            {order.user?.email && (
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {order.user.email}
                              </div>
                            )}
                          </td>
                          <td className="p-3">
                            <span className="text-sm">{order.credit_name}</span>
                          </td>
                          <td className="p-3 text-right">
                            <span className="text-sm font-semibold">
                              {order.quantity?.toLocaleString()}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <span className="text-sm font-semibold">
                              ₱
                              {parseFloat(order.amount).toLocaleString(
                                "en-US",
                                {
                                  minimumFractionDigits: 2,
                                }
                              )}
                            </span>
                          </td>
                          <td className="p-3">
                            {getStatusBadgeOrder(order.status)}
                          </td>
                          <td className="p-3">
                            {order.shipment?.status &&
                              getShipmentStatusBadgeOrder(
                                order.shipment.status
                              )}
                          </td>
                          <td className="p-3">
                            <div className="text-sm">
                              {formatTimeAgo(order.created_at)}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {new Date(order.created_at).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="text-sm text-muted-foreground">
                    Showing {from} to {to} of {total} orders
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Rows:
                      </span>
                      <Select
                        value={perPage.toString()}
                        onValueChange={handlePerPageChange}
                      >
                        <SelectTrigger className="w-[70px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1 || loading}
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || loading}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="px-3 text-sm">
                        <span className="font-medium">{currentPage}</span>
                        <span className="text-muted-foreground">
                          {" "}
                          / {lastPage}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === lastPage || loading}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handlePageChange(lastPage)}
                        disabled={currentPage === lastPage || loading}
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No orders found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Details Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedOrder && (
            <>
              <SheetHeader>
                <SheetTitle>Order Details</SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Order Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">
                        Invoice Number
                      </p>
                      <p className="font-semibold">
                        {selectedOrder.invoice_number}
                      </p>
                    </div>
                  </div>

                  {selectedOrder.shipment?.shipment_number && (
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">
                          Shipment Number
                        </p>
                        <p className="font-mono text-sm">
                          {selectedOrder.shipment.shipment_number}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">
                        Order Date
                      </p>
                      <p className="text-sm">
                        {new Date(selectedOrder.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Customer Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">
                    Customer Information
                  </h3>

                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="font-medium">
                        {selectedOrder.user?.name ||
                          selectedOrder.added_by?.name ||
                          "N/A"}
                      </p>
                    </div>
                  </div>

                  {selectedOrder.user?.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm">{selectedOrder.user.email}</p>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Order Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Order Details</h3>

                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Package
                      </span>
                      <span className="font-medium text-sm">
                        {selectedOrder.credit_name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Quantity
                      </span>
                      <span className="font-semibold">
                        {selectedOrder.quantity}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Amount
                      </span>
                      <span className="font-semibold">
                        ₱
                        {parseFloat(selectedOrder.amount).toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                          }
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Shipping
                      </span>
                      <span className="font-medium">
                        ₱
                        {parseFloat(selectedOrder.shipping_cost).toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                          }
                        )}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-medium">Total</span>
                      <span className="font-bold text-lg">
                        ₱
                        {(
                          parseFloat(selectedOrder.amount) +
                          parseFloat(selectedOrder.shipping_cost)
                        ).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Order Status
                      </p>
                      {getStatusBadgeOrder(selectedOrder.status)}
                    </div>
                    {selectedOrder.shipment?.status && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Shipment Status
                        </p>
                        {getShipmentStatusBadgeOrder(
                          selectedOrder.shipment.status
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Shipping Details */}
                {selectedOrder.shipment && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h3 className="font-semibold text-sm">
                        Shipping Information
                      </h3>

                      <div className="flex items-start gap-2">
                        <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">
                            Recipient
                          </p>
                          <p className="font-medium">
                            {selectedOrder.shipment.full_name}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">Phone</p>
                          <p className="font-medium">
                            {selectedOrder.shipment.phone_number}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">
                            Address
                          </p>
                          <p className="text-sm leading-relaxed">
                            {selectedOrder.shipment.street}
                            <br />
                            {selectedOrder.shipment.city},{" "}
                            {selectedOrder.shipment.province}
                            <br />
                            {selectedOrder.shipment.postal_code}
                            <br />
                            {selectedOrder.shipment.country}
                          </p>
                        </div>
                      </div>

                      {selectedOrder.shipment.tracking_number && (
                        <div className="flex items-start gap-2">
                          <Truck className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground">
                              Tracking Number
                            </p>
                            <p className="font-mono font-semibold text-blue-600">
                              {selectedOrder.shipment.tracking_number}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
}
