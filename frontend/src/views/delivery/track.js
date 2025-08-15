import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../assets/delivery-tracker.css';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Breadcrumb from 'views/utilities/breadcrumb';

const DeliveryTracker = () => {
  const { id } = useParams(); // get tracking number from URL
  const [trackingNumber, setTrackingNumber] = useState(id || '');
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);

  const menu = {
    list: [{ title: 'Deliveries', url: '/deliveries' }],
    active: 'Track Delivery'
  };

  // Mock tracking data
  const mockTrackingData = {
    TRK123456789: {
      trackingNumber: 'TRK123456789',
      status: 'out for delivery',
      estimatedDelivery: '2024-01-15',
      currentLocation: 'Local Distribution Center',
      timeline: [
        { status: 'pending', date: '2024-01-10', time: '09:00 AM', location: 'Order Placed', completed: true },
        { status: 'in transit', date: '2024-01-12', time: '02:30 PM', location: 'Sorting Facility', completed: true },
        { status: 'out for delivery', date: '2024-01-15', time: '08:00 AM', location: 'Local Distribution Center', completed: true },
        { status: 'delivered', date: '', time: '', location: 'Your Address', completed: false }
      ]
    },
    TRK987654321: {
      trackingNumber: 'TRK987654321',
      status: 'delivered',
      estimatedDelivery: '2024-01-10',
      currentLocation: 'Delivered',
      timeline: [
        { status: 'pending', date: '2024-01-08', time: '10:00 AM', location: 'Order Placed', completed: true },
        { status: 'in transit', date: '2024-01-09', time: '01:15 PM', location: 'Sorting Facility', completed: true },
        { status: 'out for delivery', date: '2024-01-10', time: '07:30 AM', location: 'Local Distribution Center', completed: true },
        { status: 'delivered', date: '2024-01-10', time: '03:45 PM', location: 'Front Door', completed: true }
      ]
    },
    TRK555666777: {
      trackingNumber: 'TRK555666777',
      status: 'cancelled',
      estimatedDelivery: 'N/A',
      currentLocation: 'Cancelled',
      timeline: [
        { status: 'pending', date: '2024-01-12', time: '11:00 AM', location: 'Order Placed', completed: true },
        { status: 'cancelled', date: '2024-01-13', time: '09:30 AM', location: 'Processing Center', completed: true }
      ]
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleTrack = () => {
    if (!trackingNumber.trim()) return;

    setLoading(true);

    setTimeout(() => {
      const data = mockTrackingData[trackingNumber.toUpperCase()];
      setTrackingData(data || null);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (trackingNumber) {
      handleTrack();
    }
  }, [trackingNumber]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#ffa500';
      case 'in transit':
        return '#2196f3';
      case 'out for delivery':
        return '#ff9800';
      case 'delivered':
        return '#4caf50';
      case 'cancelled':
        return '#f44336';
      default:
        return '#666';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'in transit':
        return '🚛';
      case 'out for delivery':
        return '🚚';
      case 'delivered':
        return '✅';
      case 'cancelled':
        return '❌';
      default:
        return '📦';
    }
  };

  return (
    <>
      <Breadcrumb menu={menu} />

      <div className="delivery-tracker">
        <div className="header">
          <h1>📦 Delivery Tracking</h1>
          <p>Track your package in real-time</p>
        </div>

        <div className="search-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Enter tracking number (e.g., TRK123456789)"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="tracking-input"
              onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
            />
            <AnimateButton>
              <Button
                onClick={handleTrack}
                disableElevation
                className="track-button"
                disabled={loading}
                variant="contained"
                color="secondary"
              >
                {loading ? 'Tracking...' : 'Track Package'}
              </Button>
            </AnimateButton>
          </div>
        </div>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Searching for your package...</p>
          </div>
        )}

        {trackingData && !loading && (
          <div className="tracking-results">
            <div className="package-info">
              <h2>Package Information</h2>
              <div className="info-grid">
                <div className="info-item">
                  <strong>Tracking Number:</strong> <span>{trackingData.trackingNumber}</span>
                </div>
                <div className="info-item">
                  <strong>Current Status:</strong>
                  <span className="status" style={{ color: getStatusColor(trackingData.status) }}>
                    {getStatusIcon(trackingData.status)} {trackingData.status.toUpperCase()}
                  </span>
                </div>
                <div className="info-item">
                  <strong>Current Location:</strong> <span>{trackingData.currentLocation}</span>
                </div>
                <div className="info-item">
                  <strong>Estimated Delivery:</strong> <span>{formatDate(trackingData.estimatedDelivery)}</span>
                </div>
              </div>
            </div>

            <div className="timeline-section">
              <h3>Tracking Timeline</h3>
              <div className="timeline">
                {trackingData.timeline.map((event, index) => (
                  <div key={index} className={`timeline-item ${event.completed ? 'completed' : 'pending'}`}>
                    <div className="timeline-marker" style={{ backgroundColor: event.completed ? getStatusColor(event.status) : '#ddd' }}>
                      {event.completed ? getStatusIcon(event.status) : '⭕'}
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-status">{event.status.toUpperCase()}</div>
                      <div className="timeline-location">{event.location}</div>
                      {event.date && (
                        <div className="timeline-datetime">
                          {formatDate(event.date)} at {event.time}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {trackingData === null && !loading && trackingNumber && (
          <div className="no-results">
            <h3>❌ Package Not Found</h3>
            <p>
              {`We couldn't find a package with tracking number:`} <strong>{trackingNumber}</strong>
            </p>
            <p>Please check your tracking number and try again.</p>
            <div className="sample-numbers">
              <p>Try these sample tracking numbers:</p>
              <ul>
                <li>TRK123456789 (Out for Delivery)</li>
                <li>TRK987654321 (Delivered)</li>
                <li>TRK555666777 (Cancelled)</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DeliveryTracker;
