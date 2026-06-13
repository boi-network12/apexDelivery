// frontend/context/ShipmentContext.tsx
'use client';

import { createContext, useState, useContext, useCallback, useEffect } from 'react';
import axios from 'axios';
import { ShipmentContextType, Shipment, ShipmentForm, ShipmentResponse, Status, ShipmentLocation, PaymentDetails } from '@/types/shipment';
import { API } from '@/config/api';
import { useAuth } from './AuthContext';

export const ShipmentContext = createContext<ShipmentContextType | undefined>(undefined);

export const ShipmentProvider = ({ children }: { children: React.ReactNode }) => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const { authState } = useAuth();

  // Helper function to get headers with token
  const getHeaders = useCallback(() => ({
    headers: { Authorization: `Bearer ${authState.token}` },
  }), [authState.token]);

  // Create a new shipment
  const createShipment = useCallback(async (formData: ShipmentForm): Promise<ShipmentResponse> => {
    try {
      if (!authState.isAuthenticated) {
        return { success: false, message: 'Please log in to create a shipment' };
      }

      const response = await axios.post(`${API}/api/shipments`, formData, getHeaders());
      const newShipment = response.data.shipment;
      setShipments((prev) => [...prev, newShipment]);

      return { success: true, message: response.data.message, shipment: newShipment };
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return {
          success: false,
          message: err.response?.data?.message || 'Failed to create shipment',
        };
      }
      return { success: false, message: 'Unexpected error occurred' };
    }
  }, [authState.isAuthenticated, getHeaders]);

  // Update a shipment
  const updateShipment = useCallback(async (
    id: string, 
    data: { status?: Status; location?: ShipmentLocation; paymentDetails?: PaymentDetails }
  ): Promise<ShipmentResponse> => {
    try {
      if (!authState.isAuthenticated) {
        return { success: false, message: 'Please log in to update a shipment' };
      }

      const response = await axios.put(`${API}/api/shipments/${id}`, data, getHeaders());
      const updatedShipment = response.data.shipment;

      setShipments((prev) =>
        prev.map((shipment) => (shipment._id === id ? updatedShipment : shipment))
      );

      return { success: true, message: response.data.message, shipment: updatedShipment };
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return {
          success: false,
          message: err.response?.data?.message || 'Failed to update shipment',
        };
      }
      return { success: false, message: 'Unexpected error occurred' };
    }
  }, [authState.isAuthenticated, getHeaders]);

  // Delete a shipment
  const deleteShipment = useCallback(async (id: string): Promise<ShipmentResponse> => {
    try {
      if (!authState.isAuthenticated) {
        return { success: false, message: 'Please log in to delete a shipment' };
      }

      await axios.delete(`${API}/api/shipments/${id}`, getHeaders());
      setShipments((prev) => prev.filter((shipment) => shipment._id !== id));

      return { success: true, message: 'Shipment deleted successfully' };
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return {
          success: false,
          message: err.response?.data?.message || 'Failed to delete shipment',
        };
      }
      return { success: false, message: 'Unexpected error occurred' };
    }
  }, [authState.isAuthenticated, getHeaders]);

  // Get a shipment by ID
  const getShipment = useCallback(async (id: string): Promise<ShipmentResponse> => {
    try {
      if (!authState.isAuthenticated) {
        return { success: false, message: 'Please log in to fetch a shipment' };
      }

      const response = await axios.get(`${API}/api/shipments/${id}`, getHeaders());
      return { success: true, message: response.data.message, shipment: response.data.shipment };
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return {
          success: false,
          message: err.response?.data?.message || 'Failed to fetch shipment',
        };
      }
      return { success: false, message: 'Unexpected error occurred' };
    }
  }, [authState.isAuthenticated, getHeaders]);

  // Get a shipment by tracking ID
  const getShipmentByTrackingId = useCallback(async (trackingId: string): Promise<ShipmentResponse> => {
    try {
      const response = await axios.get(`${API}/api/shipments/tracking/${trackingId}`);
      return { success: true, message: response.data.message, shipment: response.data.shipment };
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return {
          success: false,
          message: err.response?.data?.message || 'Failed to fetch shipment by tracking ID',
        };
      }
      return { success: false, message: 'Unexpected error occurred' };
    }
  }, []);

  // Fetch all shipments
   const getAllShipments = useCallback(async (): Promise<ShipmentResponse> => {
    try {
      const response = await axios.get(`${API}/api/shipments`);
      const shipments = response.data.shipments || []; // Ensure shipments is an array
      setShipments(shipments);

      return {
        success: true,
        message: shipments.length === 0 ? 'No shipments found' : response.data.message,
        shipments,
      };
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          // Handle empty shipment list gracefully
          setShipments([]);
          return {
            success: true, // Treat as success since an empty list is valid
            message: 'No shipments found',
            shipments: [],
          };
        }
        return {
          success: false,
          message: err.response?.data?.message || 'Failed to fetch shipments',
        };
      }
      return { success: false, message: 'Unexpected error occurred' };
    }
  }, []);

  // Load shipments on mount if authenticated
  useEffect(() => {
    getAllShipments();
  }, [getAllShipments]);

  return (
    <ShipmentContext.Provider
      value={{
        shipments,
        createShipment,
        updateShipment,
        deleteShipment,
        getShipment,
        getShipmentByTrackingId,
        getAllShipments,
      }}
    >
      {children}
    </ShipmentContext.Provider>
  );
};

// Custom hook to use ShipmentContext
export const useShipment = () => {
  const context = useContext(ShipmentContext);
  if (!context) {
    throw new Error('useShipment must be used within a ShipmentProvider');
  }
  return context;
};