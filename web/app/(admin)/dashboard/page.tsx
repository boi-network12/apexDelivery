// app/(admin)/dashboard/page.tsx

'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useShipment } from '@/context/ShipmentContext';
import { useAuth } from '@/context/AuthContext';
import dynamic from 'next/dynamic';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  PackagePlus
} from 'lucide-react';
import { Shipment, Status } from '@/types/shipment';

// Dynamically import the map with no SSR
const TrackingMap = dynamic(() => import('@/components/Map/TrackingMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[350px] bg-gray-100 rounded-xl flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 text-sm">Loading map...</p>
      </div>
    </div>
  ),
});

// Stats Card Component
const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  trend, 
  trendValue 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ElementType; 
  color: string; 
  trend?: 'up' | 'down'; 
  trendValue?: string;
}) => (
  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
    {(trend || trendValue) && (
      <div className="flex items-center gap-1 mt-3">
        {trend === 'up' ? (
          <ArrowUpRight className="w-4 h-4 text-green-500" />
        ) : trend === 'down' ? (
          <ArrowDownRight className="w-4 h-4 text-red-500" />
        ) : null}
        <span className={`text-xs font-medium ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
          {trendValue}
        </span>
      </div>
    )}
  </div>
);

// Recent Shipment Row Component
const RecentShipmentRow = ({ shipment }: { shipment: Shipment }) => {
  const getStatusColor = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case 'complete': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'cancel': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case 'complete': return <CheckCircle2 className="w-3 h-3" />;
      case 'pending': return <Clock className="w-3 h-3" />;
      case 'cancel': return <AlertCircle className="w-3 h-3" />;
      default: return <Package className="w-3 h-3" />;
    }
  };

  const latestStatus = shipment.status?.delivered?.status === 'complete' 
    ? 'Delivered' 
    : shipment.status?.inTransit?.status === 'complete' 
    ? 'In Transit' 
    : 'Processing';

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-gray-400" />
          <span className="font-mono text-sm font-medium text-gray-700">
            {shipment.trackingId || 'N/A'}
          </span>
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-gray-600">
        {shipment.senderName || 'N/A'}
      </td>
      <td className="py-3 px-4 text-sm text-gray-600">
        {shipment.receiverName || 'N/A'}
      </td>
      <td className="py-3 px-4">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(shipment.status?.inTransit?.status)}`}>
          {getStatusIcon(shipment.status?.inTransit?.status)}
          {latestStatus}
        </span>
      </td>
      <td className="py-3 px-4 text-sm text-gray-500">
        {shipment.updatedAt ? new Date(shipment.updatedAt).toLocaleDateString() : 'N/A'}
      </td>
    </tr>
  );
};

const Dashboard = () => {
  const { authState } = useAuth();
  const { shipments, getAllShipments } = useShipment();
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Fetch shipments on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await getAllShipments();
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Failed to fetch shipments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getAllShipments]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = shipments.length;
    const delivered = shipments.filter(s => s.status?.delivered?.status === 'complete').length;
    const inTransit = shipments.filter(s => 
      s.status?.inTransit?.status === 'complete' && 
      s.status?.delivered?.status !== 'complete'
    ).length;
    const pending = shipments.filter(s => 
      s.status?.inTransit?.status === 'pending' || 
      s.status?.inTransit?.status === 'cancel'
    ).length;

    // Calculate trends (mock data - you can replace with actual trend calculation)
    const deliveryRate = total > 0 ? Math.round((delivered / total) * 100) : 0;

    return {
      total,
      delivered,
      inTransit,
      pending,
      deliveryRate,
      // Mock trends - replace with actual data comparison
      trends: {
        total: '+12%',
        delivered: '+8%',
        inTransit: '-3%',
        pending: '-5%',
      }
    };
  }, [shipments]);

  // Get the most recent shipment for map display
  const latestShipment = useMemo(() => {
    if (shipments.length === 0) return null;
    return shipments.reduce((latest, current) => {
      const latestDate = latest?.updatedAt ? new Date(latest.updatedAt) : new Date(0);
      const currentDate = current?.updatedAt ? new Date(current.updatedAt) : new Date(0);
      return currentDate > latestDate ? current : latest;
    }, shipments[0]);
  }, [shipments]);

  // Get recent shipments (last 5)
  const recentShipments = useMemo(() => {
    return [...shipments]
      .sort((a, b) => {
        const dateA = a?.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const dateB = b?.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 5);
  }, [shipments]);

  // Get coordinates for map - FIXED: properly typed status keys
  const getMapCoordinates = () => {
    if (!latestShipment) {
      return {
        origin: { lat: 39.8283, lng: -98.5795 },
        destination: { lat: 40.7128, lng: -74.0060 },
        current: { lat: 39.8283, lng: -98.5795 }
      };
    }

    // Parse location strings to approximate coordinates
    const getCoords = (location: string | undefined) => {
      const cityMap: Record<string, { lat: number; lng: number }> = {
        'istanbul': { lat: 41.0082, lng: 28.9784 },
        'new york': { lat: 40.7128, lng: -74.0060 },
        'london': { lat: 51.5074, lng: -0.1278 },
        'paris': { lat: 48.8566, lng: 2.3522 },
        'dubai': { lat: 25.2048, lng: 55.2708 },
        'los angeles': { lat: 34.0522, lng: -118.2437 },
        'chicago': { lat: 41.8781, lng: -87.6298 },
        'usa': { lat: 39.8283, lng: -98.5795 },
        'turkey': { lat: 39.9334, lng: 32.8597 },
        'nigeria': { lat: 9.0820, lng: 8.6753 },
        'canada': { lat: 56.1304, lng: -106.3468 },
        'germany': { lat: 51.1657, lng: 10.4515 },
        'france': { lat: 46.6034, lng: 1.8883 },
        'italy': { lat: 41.8719, lng: 12.5674 },
        'spain': { lat: 40.4637, lng: -3.7492 },
        'australia': { lat: -25.2744, lng: 133.7751 },
        'japan': { lat: 36.2048, lng: 138.2529 },
        'china': { lat: 35.8617, lng: 104.1954 },
        'india': { lat: 20.5937, lng: 78.9629 },
        'brazil': { lat: -14.2350, lng: -51.9253 },
      };

      const lowerLocation = location?.toLowerCase() || '';
      for (const [key, coords] of Object.entries(cityMap)) {
        if (lowerLocation.includes(key)) {
          return coords;
        }
      }
      return { lat: 39.8283, lng: -98.5795 };
    };

    // FIXED: Use a properly typed status key array
    type StatusKey = keyof Status;
    const statusOrder: StatusKey[] = ['inTransit', 'layover', 'landedAtAirport', 'customsProcessing', 'delivered'];
    
    // Location map with proper typing
    const locationMap: Partial<Record<StatusKey, string | undefined>> = {
      'inTransit': latestShipment.location?.interactionLocation,
      'layover': latestShipment.location?.layoverLocation,
      'landedAtAirport': latestShipment.location?.landedAtAirportLocation,
      'customsProcessing': latestShipment.location?.customProcessingLocation,
      'delivered': latestShipment.recipientAddress,
    };

    let currentLocation = latestShipment.orderPlace || 'Origin';
    
    // Find the latest completed status
    for (const statusKey of statusOrder) {
      const statusObj = latestShipment.status?.[statusKey];
      if (statusObj?.status === 'complete') {
        const location = locationMap[statusKey];
        if (location) {
          currentLocation = location;
        }
        break;
      }
    }

    return {
      origin: getCoords(latestShipment.orderPlace),
      destination: getCoords(latestShipment.recipientAddress),
      current: getCoords(currentLocation),
    };
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header with refresh */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back, {authState.user?.name || 'Admin'}! Here&apos;s your shipment overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <button
            onClick={() => {
              setLoading(true);
              getAllShipments().finally(() => {
                setLoading(false);
                setLastUpdated(new Date());
              });
            }}
            disabled={loading}
            className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Shipments"
          value={stats.total}
          icon={Package}
          color="bg-blue-500"
          trend="up"
          trendValue={stats.trends.total}
        />
        <StatsCard
          title="Delivered"
          value={stats.delivered}
          icon={CheckCircle2}
          color="bg-green-500"
          trend="up"
          trendValue={stats.trends.delivered}
        />
        <StatsCard
          title="In Transit"
          value={stats.inTransit}
          icon={Truck}
          color="bg-orange-500"
          trend="down"
          trendValue={stats.trends.inTransit}
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          color="bg-purple-500"
          trend="down"
          trendValue={stats.trends.pending}
        />
      </div>

      {/* Map Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Live Tracking Map</h3>
            {latestShipment && (
              <span className="text-xs text-gray-400 ml-2">
                {latestShipment.trackingId}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <span className="text-gray-600">Origin</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-gray-600">Current</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              <span className="text-gray-600">Destination</span>
            </div>
          </div>
        </div>
        
        {latestShipment ? (
          <TrackingMap
            origin={latestShipment.orderPlace || 'Origin'}
            destination={latestShipment.recipientAddress || 'Destination'}
            currentLocation={latestShipment.location?.interactionLocation || latestShipment.orderPlace || 'Current Location'}
            status={latestShipment.status?.delivered?.status === 'complete' ? 'delivered' : 'in-transit'}
            coordinates={getMapCoordinates()}
          />
        ) : (
          <div className="w-full h-[350px] bg-gray-50 flex flex-col items-center justify-center">
            <Package className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No shipments to display</p>
            <p className="text-gray-400 text-sm">Create a shipment to see it on the map</p>
          </div>
        )}
      </div>

      {/* Two Column Layout: Recent Shipments + Quick Stats */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Shipments Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              Recent Shipments
            </h3>
            <span className="text-xs text-gray-400">
              {recentShipments.length} of {shipments.length}
            </span>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-500 text-sm mt-2">Loading shipments...</p>
            </div>
          ) : recentShipments.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No recent shipments</p>
              <p className="text-gray-400 text-sm">Create your first shipment to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tracking ID
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sender
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Receiver
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentShipments.map((shipment) => (
                    <RecentShipmentRow key={shipment._id} shipment={shipment} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Stats / Activity */}
        <div className="space-y-6">
          {/* Delivery Rate Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              Delivery Rate
            </h4>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-gray-800">
                {stats.deliveryRate}%
              </span>
              <span className="text-sm text-gray-500 mb-1">
                of {stats.total} shipments
              </span>
            </div>
            <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
                style={{ width: `${stats.deliveryRate}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h4 className="font-semibold text-gray-800 mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <a
                href="/add"
                className="w-full flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="p-2 bg-blue-500 rounded-lg">
                  <PackagePlus className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">Create Shipment</p>
                  <p className="text-xs text-gray-500">Add a new package</p>
                </div>
              </a>
              <a
                href="/packages"
                className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="p-2 bg-gray-500 rounded-lg">
                  <Package className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">View All Shipments</p>
                  <p className="text-xs text-gray-500">Manage your packages</p>
                </div>
              </a>
            </div>
          </div>

          {/* Status Summary */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h4 className="font-semibold text-gray-800 mb-3">Status Summary</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Delivered</span>
                </div>
                <span className="text-sm font-medium text-gray-800">{stats.delivered}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">In Transit</span>
                </div>
                <span className="text-sm font-medium text-gray-800">{stats.inTransit}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Pending</span>
                </div>
                <span className="text-sm font-medium text-gray-800">{stats.pending}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;