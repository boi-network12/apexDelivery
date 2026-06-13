'use client';

import React, { useEffect, useState } from 'react';
import { useShipment } from '@/context/ShipmentContext';
import { Shipment, Status, Location, PaymentDetails } from '@/types/shipment';
import { PencilIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const Packages = () => {
  const { shipments, getAllShipments, updateShipment, deleteShipment } = useShipment();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [expandedSection, setExpandedSection] = useState<'status' | 'location' | 'payment' | null>(null);

  // Updated interface to include paymentAmount in status fields
  interface StatusField {
    status: 'pending' | 'complete' | 'cancel';
    timestamp?: string;
    paymentAmount?: string; // Added this field
  }

  interface ShipmentForm {
    status: {
      inTransit: StatusField;
      layover: StatusField;
      landedAtAirport: StatusField;
      customsProcessing: StatusField;
      delivered: StatusField;
    };
    location: Location;
    paymentDetails: PaymentDetails;
  }

  const [formData, setFormData] = useState<ShipmentForm>({
    status: {
      inTransit: { 
        status: 'pending', 
        timestamp: undefined,
        paymentAmount: undefined // Added this
      },
      layover: { 
        status: 'pending', 
        timestamp: undefined,
        paymentAmount: undefined // Added this
      },
      landedAtAirport: { 
        status: 'pending', 
        timestamp: undefined,
        paymentAmount: undefined // Added this
      },
      customsProcessing: { 
        status: 'pending', 
        timestamp: undefined,
        paymentAmount: undefined // Added this
      },
      delivered: { 
        status: 'pending', 
        timestamp: undefined,
        paymentAmount: undefined // Added this
      },
    },
    location: {
      interactionLocation: '',
      layoverLocation: '',
      landedAtAirportLocation: '',
      customProcessingLocation: '',
    },
    paymentDetails: {
      amount: 'Pending',
      btcAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      usdtAddress: 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb',
      giftCardDetails: 'support@apexexpress.cfd',
    },
  });
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchShipments = async () => {
      setLoading(true);
      try {
        const response = await getAllShipments();
        if (!response.success && response.message !== 'No shipments found') {
          setError(response.message);
        }
      } catch (err) {
        setError('Failed to fetch shipments');
        console.error('Fetch shipments error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchShipments();
  }, [getAllShipments]);

  const openEditModal = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setFormData({
      status: {
        inTransit: { 
          status: shipment.status?.inTransit?.status || 'pending', 
          timestamp: shipment.status?.inTransit?.timestamp,
          paymentAmount: shipment.status?.inTransit?.paymentAmount // Added this
        },
        layover: { 
          status: shipment.status?.layover?.status || 'pending', 
          timestamp: shipment.status?.layover?.timestamp,
          paymentAmount: shipment.status?.layover?.paymentAmount // Added this
        },
        landedAtAirport: { 
          status: shipment.status?.landedAtAirport?.status || 'pending', 
          timestamp: shipment.status?.landedAtAirport?.timestamp,
          paymentAmount: shipment.status?.landedAtAirport?.paymentAmount // Added this
        },
        customsProcessing: { 
          status: shipment.status?.customsProcessing?.status || 'pending', 
          timestamp: shipment.status?.customsProcessing?.timestamp,
          paymentAmount: shipment.status?.customsProcessing?.paymentAmount // Added this
        },
        delivered: { 
          status: shipment.status?.delivered?.status || 'pending', 
          timestamp: shipment.status?.delivered?.timestamp,
          paymentAmount: shipment.status?.delivered?.paymentAmount // Added this
        },
      },
      location: {
        interactionLocation: shipment.location?.interactionLocation || '',
        layoverLocation: shipment.location?.layoverLocation || '',
        landedAtAirportLocation: shipment.location?.landedAtAirportLocation || '',
        customProcessingLocation: shipment.location?.customProcessingLocation || '',
      },
      paymentDetails: {
        amount: shipment.paymentDetails?.amount || 'Pending',
        btcAddress: shipment.paymentDetails?.btcAddress || '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        usdtAddress: shipment.paymentDetails?.usdtAddress || 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb',
        giftCardDetails: shipment.paymentDetails?.giftCardDetails || 'support@apexexpress.cfd',
      },
    });
    setExpandedSection('status');
    setFormErrors({});
    setError(null);
    setIsEditModalOpen(true);
  };

  const formatDateForInput = (dateString: string | undefined): string => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      return date.toISOString().slice(0, 16);
    } catch {
      return '';
    }
  };

  // Added validation function for payment amounts
  const validatePaymentAmount = (value: string): boolean => {
    if (!value || value.trim() === '') return true; // Empty is valid (optional field)
    
    const trimmedValue = value.trim();
    // Check if it matches pattern like "123 USD" or "123.45 EUR" or just "123"
    const amountPattern = /^(\d+(?:\.\d{1,2})?)\s*(USD|EUR|GBP|\$|€|£)?$/i;
    
    return amountPattern.test(trimmedValue);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof Location | keyof Status | keyof PaymentDetails,
    subField?: 'status' | 'timestamp' | 'paymentAmount'
  ) => {
    const value = e.target.value;
    
    try {
      if (subField === 'status' && typeof field === 'string' && field in formData.status) {
        setFormData((prev) => ({
          ...prev,
          status: {
            ...prev.status,
            [field]: { 
              ...prev.status[field as keyof Status], 
              status: value as 'pending' | 'complete' | 'cancel' 
            },
          },
        }));
      } else if (subField === 'timestamp' && typeof field === 'string' && field in formData.status) {
        const timestampValue = value ? new Date(value).toISOString() : undefined;
        setFormData((prev) => ({
          ...prev,
          status: {
            ...prev.status,
            [field]: { 
              ...prev.status[field as keyof Status], 
              timestamp: timestampValue 
            },
          },
        }));
      } else if (subField === 'paymentAmount' && typeof field === 'string' && field in formData.status) {
        setFormData((prev) => ({
          ...prev,
          status: {
            ...prev.status,
            [field]: { 
              ...prev.status[field as keyof Status], 
              paymentAmount: value 
            },
          },
        }));
      } else if (field in formData.paymentDetails) {
        setFormData((prev) => ({
          ...prev,
          paymentDetails: { ...prev.paymentDetails, [field]: value },
        }));
      } else if (field in formData.location) {
        setFormData((prev) => ({
          ...prev,
          location: { ...prev.location, [field]: value },
        }));
      }
    } catch (err) {
      console.error('Error updating form field:', err);
    }
    
    // Clear specific field error
    setFormErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`${field}${subField ? '-' + subField : ''}`];
      return newErrors;
    });
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Validate status timestamps
    ['inTransit', 'layover', 'landedAtAirport', 'customsProcessing', 'delivered'].forEach((field) => {
      const statusField = formData.status[field as keyof Status];
      const timestamp = statusField?.timestamp;
      
      if (timestamp) {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
          errors[`${field}-timestamp`] = 'Invalid timestamp format';
        }
      }
    });

    // Fixed: Validate payment amounts for specific status fields - only validate if field has a value
    ['inTransit', 'customsProcessing'].forEach((field) => {
      const statusField = formData.status[field as keyof Status];
      const paymentAmount = statusField?.paymentAmount;
      
      if (paymentAmount && !validatePaymentAmount(paymentAmount)) {
        errors[`${field}-paymentAmount`] = 'Invalid amount format (e.g., "500 USD" or "500")';
      }
    });

    // Validate required location fields if status is complete
    ['inTransit', 'layover', 'landedAtAirport', 'customsProcessing', 'delivered'].forEach((field) => {
      const statusField = formData.status[field as keyof Status];
      if (statusField?.status === 'complete') {
        const locationField = field === 'inTransit' ? 'interactionLocation' :
                            field === 'layover' ? 'layoverLocation' :
                            field === 'landedAtAirport' ? 'landedAtAirportLocation' :
                            field === 'customsProcessing' ? 'customProcessingLocation' :
                            'interactionLocation';
        
        if (!formData.location[locationField as keyof Location]?.trim()) {
          errors[locationField] = `Location required for ${field} status`;
        }
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdate = async () => {
    if (!selectedShipment?._id) {
      setError('No shipment selected');
      return;
    }
    
    // Validate form before proceeding
    if (!validateForm()) {
      setError('Please fix the form errors before saving.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await updateShipment(selectedShipment._id, {
        status: formData.status,
        location: formData.location,
        paymentDetails: formData.paymentDetails,
      });
      
      if (response.success) {
        setIsEditModalOpen(false);
        setSelectedShipment(null);
        setFormErrors({});
        setError(null);
        // Refresh the shipments list
        await getAllShipments();
      } else {
        setError(response.message || 'Failed to update shipment');
      }
    } catch (error) {
      console.error('Update error:', error);
      setError('Failed to update shipment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) {
      setError('Cannot delete shipment without ID');
      return;
    }

    if (window.confirm('Are you sure you want to delete this shipment?')) {
      setLoading(true);
      setError(null);
      try {
        const response = await deleteShipment(id);
        if (!response.success) {
          setError(response.message || 'Failed to delete shipment');
        } else {
          // Refresh the shipments list
          await getAllShipments();
        }
      } catch (error) {
        console.error('Delete error:', error);
        setError('Failed to delete shipment. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleSection = (section: 'status' | 'location' | 'payment') => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const closeModal = () => {
    setIsEditModalOpen(false);
    setSelectedShipment(null);
    setFormErrors({});
    setError(null);
    setFormData({
      status: {
        inTransit: { status: 'pending', timestamp: undefined, paymentAmount: undefined },
        layover: { status: 'pending', timestamp: undefined, paymentAmount: undefined },
        landedAtAirport: { status: 'pending', timestamp: undefined, paymentAmount: undefined },
        customsProcessing: { status: 'pending', timestamp: undefined, paymentAmount: undefined },
        delivered: { status: 'pending', timestamp: undefined, paymentAmount: undefined },
      },
      location: {
        interactionLocation: '',
        layoverLocation: '',
        landedAtAirportLocation: '',
        customProcessingLocation: '',
      },
      paymentDetails: {
        amount: 'Pending',
        btcAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        usdtAddress: 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb',
        giftCardDetails: 'support@apexexpress.cfd',
      },
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Packages</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading && <p className="text-gray-600">Loading...</p>}

      {shipments.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-600 text-lg">No shipments found.</p>
          <p className="text-gray-500">Create a new shipment to get started!</p>
          <a href="/add" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Create Shipment
          </a>
        </div>
      )}

      {shipments.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Tracking ID</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Sender</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Receiver</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Location</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Payment</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment, index) => (
                <tr
                  key={shipment._id || index}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-sm text-gray-700">{shipment.trackingId || 'N/A'}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{shipment.senderName || 'N/A'}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{shipment.receiverName || 'N/A'}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {shipment.status?.inTransit?.status || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {shipment.location?.interactionLocation || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {shipment.paymentDetails?.amount || 'Pending'}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <button
                      onClick={() => openEditModal(shipment)}
                      className="text-blue-600 hover:text-blue-800 mr-4"
                      title="Edit"
                      disabled={loading}
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(shipment._id || '')}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                      disabled={!shipment._id || loading}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isEditModalOpen && selectedShipment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-4 sm:px-0">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-xl">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Edit Shipment (Tracking ID: {selectedShipment.trackingId})
            </h2>
            
            <button
              type='button'
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label='Close'
              disabled={loading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Form Errors Summary */}
            {Object.keys(formErrors).length > 0 && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p className="font-medium">Please correct the following errors:</p>
                <ul className="mt-1 list-disc list-inside text-sm">
                  {Object.values(formErrors).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="border-b border-gray-200 mb-4">
              <button
                type="button"
                className="w-full flex justify-between items-center py-3 text-lg font-medium text-gray-700 hover:text-gray-900"
                onClick={() => toggleSection('status')}
                disabled={loading}
              >
                Status Details
                {expandedSection === 'status' ? (
                  <ChevronUpIcon className="w-5 h-5" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5" />
                )}
              </button>
              {expandedSection === 'status' && (
                <div className="space-y-4 py-4">
                  {[
                    { field: 'inTransit', label: 'In Transit' },
                    { field: 'layover', label: 'Layover' },
                    { field: 'landedAtAirport', label: 'Landed at Airport' },
                    { field: 'customsProcessing', label: 'Customs Processing' },
                    { field: 'delivered', label: 'Delivered' },
                  ].map(({ field, label }) => {
                    const statusField = formData.status[field as keyof Status];
                    const statusValue = statusField?.status || 'pending';

                    return (
                      <div key={field} className="space-y-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">{`${label} Status`}</label>
                          <select
                            aria-label={`${field}-status`}
                            value={statusValue}
                            onChange={(e) => handleInputChange(e, field as keyof Status, 'status')}
                            className={`mt-1 block w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              formErrors[`${field}-status`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            disabled={loading}
                          >
                            <option value="pending">Pending</option>
                            <option value="complete">Complete</option>
                            <option value="cancel">Cancel</option>
                          </select>
                          {formErrors[`${field}-status`] && (
                            <p className="mt-1 text-sm text-red-600">{formErrors[`${field}-status`]}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">{`${label} Timestamp`}</label>
                          <input
                            aria-label={`${field}-timestamp`}
                            type="datetime-local"
                            value={formatDateForInput(statusField?.timestamp)}
                            onChange={(e) => handleInputChange(e, field as keyof Status, 'timestamp')}
                            className={`mt-1 block w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              formErrors[`${field}-timestamp`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            disabled={loading}
                          />
                          {formErrors[`${field}-timestamp`] && (
                            <p className="mt-1 text-sm text-red-600">{formErrors[`${field}-timestamp`]}</p>
                          )}
                        </div>
                        {['inTransit', 'customsProcessing', 'landedAtAirport', 'layover'].includes(field) && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">{`${label} Payment Amount`}</label>
                            <input
                              aria-label={`${field}-paymentAmount`}
                              type="text"
                              value={statusField?.paymentAmount || ''}
                              onChange={(e) => handleInputChange(e, field as keyof Status, 'paymentAmount')}
                              className={`mt-1 block w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                formErrors[`${field}-paymentAmount`] ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="e.g., 500 USD"
                              disabled={loading}
                            />
                            {formErrors[`${field}-paymentAmount`] && (
                              <p className="mt-1 text-sm text-red-600">{formErrors[`${field}-paymentAmount`]}</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="border-b border-gray-200 mb-4">
              <button
                type="button"
                className="w-full flex justify-between items-center py-3 text-lg font-medium text-gray-700 hover:text-gray-900"
                onClick={() => toggleSection('location')}
                disabled={loading}
              >
                Location Details
                {expandedSection === 'location' ? (
                  <ChevronUpIcon className="w-5 h-5" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5" />
                )}
              </button>
              {expandedSection === 'location' && (
                <div className="space-y-4 py-4">
                  {[
                    { field: 'interactionLocation', label: 'Interaction Location' },
                    { field: 'layoverLocation', label: 'Layover Location' },
                    { field: 'landedAtAirportLocation', label: 'Landed at Airport Location' },
                    { field: 'customProcessingLocation', label: 'Customs Processing Location' },
                  ].map(({ field, label }) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700">{label}</label>
                      <input
                        aria-label={field}
                        type="text"
                        value={formData.location[field as keyof Location] || ''}
                        onChange={(e) => handleInputChange(e, field as keyof Location)}
                        className={`mt-1 block w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors[field] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={loading}
                      />
                      {formErrors[field] && (
                        <p className="mt-1 text-sm text-red-600">{formErrors[field]}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-b border-gray-200 mb-4">
              <button
                type="button"
                className="w-full flex justify-between items-center py-3 text-lg font-medium text-gray-700 hover:text-gray-900"
                onClick={() => toggleSection('payment')}
                disabled={loading}
              >
                Payment Details
                {expandedSection === 'payment' ? (
                  <ChevronUpIcon className="w-5 h-5" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5" />
                )}
              </button>
              {expandedSection === 'payment' && (
                <div className="space-y-4 py-4">
                  {[
                    { field: 'amount', label: 'Payment Amount' },
                    { field: 'btcAddress', label: 'BTC Address' },
                    { field: 'usdtAddress', label: 'USDT Address' },
                    { field: 'giftCardDetails', label: 'Gift Card Details' },
                  ].map(({ field, label }) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700">{label}</label>
                      <input
                        aria-label={field}
                        type="text"
                        value={formData.paymentDetails[field as keyof PaymentDetails] || ''}
                        onChange={(e) => handleInputChange(e, field as keyof PaymentDetails)}
                        className={`mt-1 block w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors[field] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder={field === 'amount' ? 'e.g., 500 USD' : ''}
                        disabled={loading}
                      />
                      {formErrors[field] && (
                        <p className="mt-1 text-sm text-red-600">{formErrors[field]}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading || Object.keys(formErrors).length > 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Packages;