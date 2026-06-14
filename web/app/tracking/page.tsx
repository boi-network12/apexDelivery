"use client";

import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Nav/Navbar";
import { ChevronUp, Package, Calendar, MapPin, Truck, Clock, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import Bg1Display from "../../assets/img/plane1.png";
import Bg3Display from "../../assets/img/footerbg.png";
import React, { useEffect, useState } from "react";
import TrackingHeroBg from "@/components/HeroBg/TrackingHeroBg";
import { useShipment } from "@/context/ShipmentContext";
import { Shipment, Status } from "@/types/shipment";
import dynamic from "next/dynamic";

const TrackingOrder = () => {
  const [showScroll, setShowScroll] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { getShipmentByTrackingId } = useShipment();

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTrackShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setShipment(null);

    if (!trackingId.trim()) {
      setError("Please enter a valid tracking ID");
      return;
    }

    setIsLoading(true);
    try {
      const response = await getShipmentByTrackingId(trackingId);
      if (response.success && response.shipment && response.shipment.trackingId) {
        console.log("Shipment data:", response.shipment);
        setShipment(response.shipment);
      } else {
        setError(response.message || "Shipment not found. Please check your tracking ID.");
      }
    } catch (err) {
      setError("Unable to fetch shipment details. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const getLatestLocation = (shipment: Shipment) => {
    if (!shipment) return { address: "Location unavailable", statusKey: "origin" };
    if (!shipment.location) {
      return { address: shipment.orderPlace || "Location unavailable", statusKey: "origin" };
    }

    const { interactionLocation, layoverLocation, landedAtAirportLocation, customProcessingLocation } = shipment.location;

    const statusEntries = Object.entries(shipment.status || {})
      .filter(([key]) => key !== "_id")
      .filter(([_, value]) => value?.status === "complete");

    if (statusEntries.length === 0) {
      return {
        address: interactionLocation || shipment.orderPlace || "Processing",
        statusKey: "origin",
      };
    }

    const latestStatus = statusEntries.sort((a, b) => {
      const timeA = new Date((a[1] as { timestamp?: string }).timestamp || "0").getTime();
      const timeB = new Date((b[1] as { timestamp?: string }).timestamp || "0").getTime();
      return timeB - timeA;
    })[0];

    const statusKey = latestStatus[0] as keyof Status;

    switch (statusKey) {
      case "inTransit":
        return { address: interactionLocation || "In Transit", statusKey };
      case "layover":
        return { address: layoverLocation || "Layover", statusKey };
      case "landedAtAirport":
        return { address: landedAtAirportLocation || "Arrived at Airport", statusKey };
      case "customsProcessing":
        return { address: customProcessingLocation || "Customs Clearance", statusKey };
      case "delivered":
        return { address: shipment.recipientAddress || "Delivered", statusKey };
      default:
        return { address: interactionLocation || shipment.orderPlace || "Processing", statusKey: "origin" };
    }
  };

  const getEstimatedDelivery = () => {
    if (!shipment) return null;
    if (shipment.status?.delivered?.status === "complete") {
      const deliveredTimestamp = shipment.status.delivered.timestamp ?? shipment.updatedAt;
      if (!deliveredTimestamp) return null;
      return new Date(deliveredTimestamp).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    const createdAt = shipment.createdAt;
    if (!createdAt) return null;
    const createdDate = new Date(createdAt);
    const estimatedDate = new Date(createdDate.setDate(createdDate.getDate() + 5));
    return estimatedDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getProgressPercentage = () => {
    if (!shipment) return 0;
    if (shipment.status?.delivered?.status === "complete") return 100;
    
    // Only count statuses that exist in the actual data
    const statusKeys = ["inTransit", "layover", "landedAtAirport", "customsProcessing", "delivered"];
    let completedSteps = 0;
    
    for (const key of statusKeys) {
      if (shipment.status?.[key as keyof typeof shipment.status]?.status === "complete") {
        completedSteps++;
      } else {
        break;
      }
    }
    
    return Math.floor((completedSteps / statusKeys.length) * 100);
  };

  // Get the current active status for display
  const getCurrentStatus = () => {
    if (!shipment) return "Processing";
    if (shipment.status?.delivered?.status === "complete") return "Delivered";
    
    const statusOrder = ["inTransit", "layover", "landedAtAirport", "customsProcessing"];
    for (const status of statusOrder) {
      if (shipment.status?.[status as keyof typeof shipment.status]?.status === "pending") {
        return status.replace(/([A-Z])/g, ' $1').trim();
      }
    }
    
    if (shipment.status?.inTransit?.status === "complete") return "In Transit";
    return "Order Placed";
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const _links = [
    { name: "Home", url: "#home" },
    { name: "About", url: "#about" },
    { name: "Team", url: "#team" },
    { name: "Service", url: "#service" },
    { name: "Contact", url: "#contact" },
  ];

  const TrackingMap = dynamic(() => import("@/components/Map/TrackingMap"), {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm">Loading map...</p>
        </div>
      </div>
    ),
  });

  // Define timeline steps based on actual data structure
  const getTimelineSteps = () => {
    if (!shipment) return [];
    
    const steps = [];
    
    // Order Placed - always show using createdAt
    steps.push({
      key: "orderPlaced",
      label: "Order Placed",
      description: "Your order has been confirmed and is being prepared",
      icon: Package,
      location: shipment.orderPlace,
      timestamp: shipment.createdAt,
      isComplete: true, // Order is always considered placed
      status: "complete"
    });
    
    // In Transit
    if (shipment.status?.inTransit) {
      steps.push({
        key: "inTransit",
        label: "In Transit",
        description: "Package has been picked up and is on its way",
        icon: Truck,
        location: shipment.location?.interactionLocation,
        timestamp: shipment.status.inTransit.timestamp,
        status: shipment.status.inTransit.status,
        isComplete: shipment.status.inTransit.status === "complete"
      });
    } else {
      steps.push({
        key: "inTransit",
        label: "In Transit",
        description: "Package will be picked up soon",
        icon: Truck,
        location: null,
        timestamp: null,
        status: "pending",
        isComplete: false
      });
    }
    
    // Layover
    if (shipment.status?.layover) {
      steps.push({
        key: "layover",
        label: "Layover / Sorting",
        description: "Package is at a sorting facility",
        icon: Clock,
        location: shipment.location?.layoverLocation,
        timestamp: shipment.status.layover.timestamp,
        status: shipment.status.layover.status,
        isComplete: shipment.status.layover.status === "complete"
      });
    }
    
    // Landed at Airport
    if (shipment.status?.landedAtAirport) {
      steps.push({
        key: "landedAtAirport",
        label: "Arrived at Airport",
        description: "Package has arrived at destination airport",
        icon: MapPin,
        location: shipment.location?.landedAtAirportLocation,
        timestamp: shipment.status.landedAtAirport.timestamp,
        status: shipment.status.landedAtAirport.status,
        isComplete: shipment.status.landedAtAirport.status === "complete"
      });
    }
    
    // Customs Processing
    if (shipment.status?.customsProcessing) {
      steps.push({
        key: "customsProcessing",
        label: "Customs Clearance",
        description: "Package is going through customs inspection",
        icon: AlertCircle,
        location: shipment.location?.customProcessingLocation,
        timestamp: shipment.status.customsProcessing.timestamp,
        status: shipment.status.customsProcessing.status,
        isComplete: shipment.status.customsProcessing.status === "complete"
      });
    }
    
    // Delivered
    if (shipment.status?.delivered) {
      steps.push({
        key: "delivered",
        label: "Delivered",
        description: "Package has been delivered successfully",
        icon: CheckCircle2,
        location: shipment.recipientAddress,
        timestamp: shipment.status.delivered.timestamp,
        status: shipment.status.delivered.status,
        isComplete: shipment.status.delivered.status === "complete"
      });
    }
    
    return steps;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="w-screen relative mb-[450px] md:mb-[380px] lg:mb-[350px]">
        <Navbar _links={_links} />
        <section
          id="header"
          className="w-full absolute bg-cover bg-center bg-no-repeat top-0 left-0"
          style={{ backgroundImage: `url(${Bg1Display.src})` }}
        >
          <TrackingHeroBg />
        </section>
      </section>

      <section className="w-full px-4 md:px-8 lg:px-16 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Track Your Shipment
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Enter your tracking number to get real-time updates on your package location and delivery status
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-2xl mx-auto mb-12">
            <form onSubmit={handleTrackShipment} className="relative">
              <input
                type="text"
                placeholder="Enter tracking number (e.g., APX-4463)"
                className="w-full h-14 px-5 pr-32 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-700 shadow-sm"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="absolute right-1 top-1 bottom-1 bg-blue-600 text-white px-6 rounded-full font-medium hover:bg-blue-700 transition-all disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Track"
                )}
              </button>
            </form>
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Shipment Details Card */}
          {shipment && (
            <div className="space-y-6 animate-fadeIn">
              {/* Map Section */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-800">Live Tracking Map</h3>
                  </div>
                </div>
                <TrackingMap
                  origin={shipment.orderPlace || "Origin"}
                  destination={shipment.recipientAddress || "Destination"}
                  currentLocation={getLatestLocation(shipment)?.address || "Current Location"}
                  status={shipment.status?.delivered?.status === "complete" ? "delivered" : "in-transit"}
                />
              </div>

              {/* Status Header */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <p className="text-gray-400 text-sm uppercase tracking-wide mb-1">Tracking Number</p>
                    <p className="text-2xl md:text-3xl font-mono font-bold tracking-tight">{shipment.trackingId}</p>
                  </div>
                  <div className="flex flex-col w-full md:w-auto items-end">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                      shipment.status?.delivered?.status === "complete"
                        ? "bg-green-500 text-white"
                        : shipment.status?.inTransit?.status === "complete"
                        ? "bg-blue-500 text-white"
                        : "bg-orange-500 text-white"
                    }`}>
                      {getCurrentStatus()}
                    </span>
                    <p className="text-gray-400 text-xs mt-2">
                      Last updated: {shipment.updatedAt ? new Date(shipment.updatedAt).toLocaleString() : "Unknown"}
                    </p>
                  </div>
                </div>
                
                {/* Progress Bar - based on actual statuses */}
                <div className="mt-6">
                  <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <span>Order Placed</span>
                    <span>In Transit</span>
                    <span>Customs</span>
                    <span>Delivered</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Key Information Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Weight</p>
                  </div>
                  <p className="text-lg font-semibold text-gray-800">{shipment.weight || "—"}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="w-4 h-4 text-gray-400" />
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Service Type</p>
                  </div>
                  <p className="text-lg font-semibold text-gray-800 capitalize">{shipment.deliveryType || "Standard"}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Order Date</p>
                  </div>
                  <p className="text-sm font-medium text-gray-800">
                    {shipment.createdAt ? new Date(shipment.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }) : "—"}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Est. Delivery</p>
                  </div>
                  <p className="text-sm font-medium text-gray-800">{getEstimatedDelivery() || "—"}</p>
                </div>
              </div>

              {/* Route Summary */}
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-4">Route Summary</h4>
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Origin</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <p className="font-medium text-gray-700">{shipment.orderPlace || "Unknown"}</p>
                    </div>
                  </div>
                  <div className="hidden md:block text-gray-300 text-xl">→</div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Destination</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <p className="font-medium text-gray-700">{shipment.recipientAddress || "Unknown"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Location Card */}
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 uppercase tracking-wide font-semibold">Current Location</p>
                    <p className="text-gray-800 font-semibold text-lg mt-0.5">{getLatestLocation(shipment)?.address}</p>
                    <p className="text-gray-500 text-sm mt-1">
                      Status: {getCurrentStatus()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tracking Timeline - Now using actual data */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <h4 className="font-semibold text-gray-800">Tracking History</h4>
                </div>
                <div className="p-5">
                  <div className="relative">
                    {getTimelineSteps().map((step, idx) => {
                      const isComplete = step.isComplete;
                      const isCurrent = step.status === "pending" && idx > 0 && 
                        getTimelineSteps().slice(0, idx).every(s => s.isComplete);
                      
                      return (
                        <div key={step.key} className="relative flex gap-4 pb-8 last:pb-0">
                          {/* Timeline line */}
                          {idx !== getTimelineSteps().length - 1 && (
                            <div className={`absolute left-4 top-10 w-0.5 h-[calc(100%-2rem)] ${
                              isComplete ? "bg-green-500" : "bg-gray-200"
                            }`}></div>
                          )}
                          
                          {/* Icon circle */}
                          <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isComplete ? "bg-green-500" : isCurrent ? "bg-blue-500" : "bg-gray-200"
                          }`}>
                            {isComplete ? (
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            ) : isCurrent ? (
                              <Circle className="w-4 h-4 text-white" />
                            ) : (
                              <step.icon className="w-4 h-4 text-gray-500" />
                            )}
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 mb-1">
                              <h5 className={`font-semibold ${
                                isComplete ? "text-green-700" : isCurrent ? "text-blue-700" : "text-gray-500"
                              }`}>
                                {step.label}
                              </h5>
                              {step.timestamp && (
                                <p className="text-xs text-gray-400">
                                  {new Date(step.timestamp).toLocaleString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{step.description}</p>
                            {step.location && (isComplete || isCurrent) && (
                              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {step.location}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Shipping Details & Support */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                  <h4 className="font-semibold text-gray-800 mb-3">Shipping Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Sender</span>
                      <span className="font-medium text-gray-700">{shipment.senderName || "—"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Receiver</span>
                      <span className="font-medium text-gray-700">{shipment.receiverName || "—"}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-500">Receiver Email</span>
                      <span className="font-medium text-gray-700">{shipment.receiverEmail || "—"}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                  <h4 className="font-semibold text-gray-800 mb-3">Need Help?</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Having issues with your shipment? Our support team is here to help.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-gray-600">📞</span>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Customer Support</p>
                        <p className="font-medium text-gray-800">+1 (000) 000-0000</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-gray-600">✉️</span>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Email Us</p>
                        <p className="font-medium text-gray-800">apexdelivery64@gmail.com</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <section
        id="footer"
        className="w-full relative bg-cover bg-center bg-no-repeat mt-16"
        style={{ backgroundImage: `url(${Bg3Display.src})` }}
      >
        <Footer />
        <div className="backdrop-blur-md bg-blue-950/70">
          <p className="text-white text-center py-4 text-sm">
            © {new Date().getFullYear()} Apex Delivery. All rights reserved.
          </p>
        </div>
      </section>

      {/* Scroll to top */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TrackingOrder;