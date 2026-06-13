"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShipmentForm } from "@/types/shipment";
import { useShipment } from "@/context/ShipmentContext";
import { Loader2 } from "lucide-react";


interface InputField {
  label: string;
  name: keyof Pick<ShipmentForm, 'senderName' | 'receiverName' | 'receiverEmail' | 'weight' | 'deliveryType' | 'orderPlace' | 'recipientAddress'>;
  type: string;
  placeholder: string;
}

const AddProduct = () => {
  const { createShipment } = useShipment();
  const [formData, setFormData] = useState<ShipmentForm>({
    senderName: '',
    receiverName: '',
    receiverEmail: '',
    weight: '',
    deliveryType: '',
    orderPlace: '',
    recipientAddress: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false)

  const inputs: InputField[] = [
    { label: 'Sender Name', name: 'senderName', type: 'text', placeholder: 'John Doe' },
    { label: 'Receiver Name', name: 'receiverName', type: 'text', placeholder: 'Jane Doe' },
    { label: 'Receiver Email', name: 'receiverEmail', type: 'email', placeholder: 'jane@example.com' },
    { label: 'Weight', name: 'weight', type: 'text', placeholder: 'e.g., 5kg' },
    { label: 'Delivery Type', name: 'deliveryType', type: 'select', placeholder: 'Select delivery type' },
    { label: 'Order Place', name: 'orderPlace', type: 'text', placeholder: 'Texas, USA' },
    { label: 'Recipient Address', name: 'recipientAddress', type: 'text', placeholder: '123 Main Street' },
  ];


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    // Ensure deliveryType is either 'express' or 'standard'
    if (!['express', 'standard'].includes(formData.deliveryType)) {
      setError('Please select a valid delivery type (Express or Standard)');
      setIsLoading(false);
      return;
    }

    const response = await createShipment(formData);
    if (response.success) {
      setSuccess(response.message);
      setFormData({
        senderName: '',
        receiverName: '',
        receiverEmail: '',
        weight: '',
        deliveryType: '',
        orderPlace: '',
        recipientAddress: '',
      });
    } else {
      setError(response.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 p-3">
      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg"
      >
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Add New Shipment
        </h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {success && <p className="text-green-500 mb-4 text-center">{success}</p>}

        <div className="space-y-4">
          {inputs.map((input) => (
            <div key={input.name} className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">{input.label}</label>
              {input.type === 'select' ? (
                <select
                  aria-label="name"
                  name={input.name}
                  value={formData[input.name]}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                  disabled={isLoading}
                >
                  <option value="" disabled>
                    {input.placeholder}
                  </option>
                  <option value="express">Express</option>
                  <option value="standard">Standard</option>
                </select>
              ) : (
                <input
                  type={input.type}
                  name={input.name}
                  placeholder={input.placeholder}
                  value={formData[input.name]}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                  disabled={isLoading}
                />
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          className={`w-full mt-6 flex items-center justify-center py-3 rounded-lg font-medium shadow-md transition ${
            isLoading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
          disabled={isLoading} // Disable button during loading
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={20} />
              Creating...
            </>
          ) : (
            'Add Shipment'
          )}
        </button>
      </motion.form>
    </div>
  );
};

export default AddProduct;
