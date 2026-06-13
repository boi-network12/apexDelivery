export interface PaymentDetails {
  amount?: string;
  btcAddress?: string;
  usdtAddress?: string;
  giftCardDetails?: string;
}

export interface Location {
  interactionLocation?: string;
  layoverLocation?: string;
  landedAtAirportLocation?: string;
  customProcessingLocation?: string;
}

export interface ShipmentLocation {
  interactionLocation?: string;
  layoverLocation?: string;
  landedAtAirportLocation?: string;
  customProcessingLocation?: string;
}

export interface Status {
  inTransit?: { status: 'pending' | 'cancel' | 'complete'; timestamp?: string; paymentAmount?: string };
  layover?: { status: 'pending' | 'cancel' | 'complete'; timestamp?: string; paymentAmount?: string };
  landedAtAirport?: { status: 'pending' | 'cancel' | 'complete'; timestamp?: string; paymentAmount?: string };
  customsProcessing?: { status: 'pending' | 'cancel' | 'complete'; timestamp?: string; paymentAmount?: string };
  delivered?: { status: 'pending' | 'cancel' | 'complete'; timestamp?: string; paymentAmount?: string };
}

export interface Shipment {
  _id?: string;
  trackingId: string;
  senderName: string;
  receiverName: string;
  receiverEmail: string;
  weight: string;
  deliveryType: 'express' | 'standard';
  orderPlace: string;
  recipientAddress: string;
  delivered?: string;
  paymentDetails?: PaymentDetails;
  location?: ShipmentLocation;
  status?: Status;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShipmentForm {
  senderName: string;
  receiverName: string;
  receiverEmail: string;
  weight: string;
  deliveryType: 'express' | 'standard' | string;
  orderPlace: string;
  recipientAddress: string;
  paymentDetails?: PaymentDetails;
}

// Fix the update type - make it more specific
export interface UpdateShipmentData {
  status?: Status;
  location?: ShipmentLocation;
  paymentDetails?: PaymentDetails;
}

export interface ShipmentResponse {
  success: boolean;
  message: string;
  shipment?: Shipment;
  shipments?: Shipment[];
}

export interface ShipmentContextType {
  shipments: Shipment[];
  createShipment: (formData: ShipmentForm) => Promise<ShipmentResponse>;
  updateShipment: (
    id: string,
    data: UpdateShipmentData
  ) => Promise<ShipmentResponse>;
  deleteShipment: (id: string) => Promise<ShipmentResponse>;
  getShipment: (id: string) => Promise<ShipmentResponse>;
  getShipmentByTrackingId: (trackingId: string) => Promise<ShipmentResponse>;
  getAllShipments: () => Promise<ShipmentResponse>;
}