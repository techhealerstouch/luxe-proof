"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  Plus,
  Loader2,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatTimeAgo } from "@/utils/formatting";

export default function NFCOrderDashboard() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [orders, setOrders] = useState<Order[]>([]);
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

  const handleExport = () => {
    // Prepare CSV headers
    const headers = [
      "Invoice Number",
      "Shipment Number",
      "External ID",
      "Customer Name",
      "Customer Email",
      "Package Type",
      "Quantity",
      "Amount",
      "Shipping Cost",
      "Order Status",
      "Shipment Status",
      "Recipient Name",
      "Street",
      "City",
      "Province",
      "Postal Code",
      "Country",
      "Phone Number",
      "Tracking Number",
      "Created Date",
      "Created Time",
    ];

    // Prepare CSV rows
    const rows = filteredOrders.map((order) => [
      order.invoice_number || "",
      order.shipment?.shipment_number || "",
      order.external_id || "",
      order.user?.name || order.added_by?.name || "",
      order.user?.email || "",
      order.credit_name || "",
      order.quantity?.toString() || "",
      parseFloat(order.amount || "0").toFixed(2),
      parseFloat(order.shipping_cost || "0").toFixed(2),
      order.status || "",
      order.shipment?.status || "",
      order.shipment?.full_name || "",
      order.shipment?.street || "",
      order.shipment?.city || "",
      order.shipment?.province || "",
      order.shipment?.postal_code || "",
      order.shipment?.country || "",
      order.shipment?.phone_number || "",
      order.shipment?.tracking_number || "",
      new Date(order.created_at).toLocaleDateString(),
      new Date(order.created_at).toLocaleTimeString(),
    ]);

    // Escape CSV values
    const escapeCSV = (value: string) => {
      if (value.includes(",") || value.includes('"') || value.includes("\n")) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    // Build CSV content
    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    // Create blob and download
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
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">NFC Orders</h1>
            <p className="text-muted-foreground">
              Manage and track your NFC chip orders
            </p>
          </div>
          <div className="flex gap-3">
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
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{total}</div>
              <p className="text-xs text-muted-foreground">Active orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Units</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalQuantity.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">NFC chips ordered</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₱
                {totalValue.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-muted-foreground">Order value</p>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest NFC chip orders</CardDescription>
              </div>
              {filteredOrders.length > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary"
                >
                  {filteredOrders.length} orders
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-muted-foreground">Loading orders...</p>
                </div>
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead className="border-b bg-muted/50">
                        <tr>
                          <th className="text-left p-3 text-sm font-medium">
                            Invoice Number
                          </th>
                          <th className="text-left p-3 text-sm font-medium">
                            Customer
                          </th>
                          <th className="text-left p-3 text-sm font-medium">
                            Package Type
                          </th>
                          <th className="text-right p-3 text-sm font-medium">
                            Quantity
                          </th>
                          <th className="text-right p-3 text-sm font-medium">
                            Amount
                          </th>
                          <th className="text-left p-3 text-sm font-medium">
                            Shipping Cost
                          </th>
                          <th className="text-left p-3 text-sm font-medium">
                            Order Status
                          </th>
                          <th className="text-left p-3 text-sm font-medium">
                            Shipment Status
                          </th>
                          <th className="text-left p-3 text-sm font-medium">
                            Shipping Details
                          </th>
                          <th className="text-left p-3 text-sm font-medium">
                            Created
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order, index) => (
                          <tr
                            key={order.id}
                            className={`border-b hover:bg-muted/50 ${
                              index % 2 === 0 ? "bg-background" : "bg-muted/20"
                            }`}
                          >
                            <td className="p-3">
                              <div className="font-medium">
                                {order.invoice_number}
                              </div>
                              <div className="text-xs text-muted-foreground font-mono">
                                {order.shipment?.shipment_number}
                              </div>
                              {order.external_id && (
                                <div className="text-xs text-muted-foreground">
                                  Ext: {order.external_id.substring(0, 20)}...
                                </div>
                              )}
                            </td>
                            <td className="p-3">
                              <div className="font-medium">
                                {order.user?.name ||
                                  order.added_by?.name ||
                                  "N/A"}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {order.user?.email}
                              </div>
                            </td>
                            <td className="p-3">
                              <span className="font-medium text-blue-600">
                                {order.credit_name}
                              </span>
                            </td>
                            <td className="p-3 text-right font-semibold">
                              {order.quantity?.toLocaleString()}
                            </td>
                            <td className="p-3 text-right font-semibold">
                              ₱
                              {parseFloat(order.amount).toLocaleString(
                                "en-US",
                                {
                                  minimumFractionDigits: 2,
                                }
                              )}
                            </td>
                            <td className="p-3 text-sm text-muted-foreground">
                              ₱
                              {parseFloat(order.shipping_cost).toLocaleString(
                                "en-US",
                                {
                                  minimumFractionDigits: 2,
                                }
                              )}
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
                              <div className="text-sm max-w-xs">
                                <div className="font-medium">
                                  {order.shipment?.full_name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {order.shipment?.street}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {order.shipment?.city},{" "}
                                  {order.shipment?.province}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {order.shipment?.postal_code} -{" "}
                                  {order.shipment?.country}
                                </div>
                                <div className="text-xs text-muted-foreground font-medium mt-1">
                                  {order.shipment?.phone_number}
                                </div>
                                {order.shipment?.tracking_number && (
                                  <div className="text-xs text-blue-600 font-mono mt-1">
                                    Track: {order.shipment.tracking_number}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-1 text-sm">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span>{formatTimeAgo(order.created_at)}</span>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {new Date(
                                  order.created_at
                                ).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(
                                  order.created_at
                                ).toLocaleTimeString()}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>
                      Showing {from} to {to} of {total} orders
                    </span>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Rows per page:
                      </span>
                      <Select
                        value={perPage.toString()}
                        onValueChange={handlePerPageChange}
                      >
                        <SelectTrigger className="w-[70px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1 || loading}
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || loading}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center gap-1 px-2">
                        <span className="text-sm font-medium">
                          {currentPage}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          of {lastPage}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === lastPage || loading}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
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
                <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No orders found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
