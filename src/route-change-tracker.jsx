import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
//import { sendGA4Event } from './ga4';

const RouteChangeTracker = () => {
  const location = useLocation();

  /*useEffect(() => {
    sendGA4Event({ hitType: "pageview", page: location.pathname });
  }, [location]);*/

  return null;
};

export default RouteChangeTracker;
