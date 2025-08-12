// Dummy watch data
export interface Watch {
  id: string;
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  referenceNumber: string;
  image: string;
}

export const DUMMY_WATCHES: Watch[] = [
  {
    id: "1",
    name: "Submariner Date",
    brand: "Rolex",
    model: "116610LN",
    serialNumber: "Z123456",
    referenceNumber: "116610LN",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "2",
    name: "Speedmaster Professional",
    brand: "Omega",
    model: "311.30.42.30.01.005",
    serialNumber: "12345678",
    referenceNumber: "311.30.42.30.01.005",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "3",
    name: "Nautilus",
    brand: "Patek Philippe",
    model: "5711/1A-010",
    serialNumber: "PP987654",
    referenceNumber: "5711/1A-010",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "4",
    name: "Royal Oak",
    brand: "Audemars Piguet",
    model: "15400ST.OO.1220ST.02",
    serialNumber: "AP456789",
    referenceNumber: "15400ST.OO.1220ST.02",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "5",
    name: "Daytona",
    brand: "Rolex",
    model: "116500LN",
    serialNumber: "Z987654",
    referenceNumber: "116500LN",
    image: "/placeholder.svg?height=200&width=200",
  },
];

export interface WatchAuthentication {
  id: string;
  watchId: string;
  watch: Watch;
  productVerification: "available" | "servicing" | "reserved" | "sold";
  waterResistantTest: "available" | "servicing" | "reserved" | "sold";
  timegraphTest: "available" | "servicing" | "reserved" | "sold";
  description: string;
  verificationImages: string[];
  accessoryImages: string[];
  createdAt: string;
  updatedAt: string;
  is_authorized_dealer: boolean;
  warranty_card_path?: string | null;
  purchase_receipt_path?: string | null;
  service_records_path?: string | null;
  warranty_card_notes?: string | null;
  service_history_notes?: string | null;
}
