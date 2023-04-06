import React, { useState, useEffect } from 'react';
import { updateApiUser,resendVerifyEmail } from '../dashboard/ServiceAPI';
import PricingContent  from '../main/PricingContent';




const Message = ({ message }) => (
  <section>
    <p>{message}</p>
  </section>
);

export function StripeCheckout({ apiUser, token, siteId }) {
  let [message, setMessage] = useState('');
  let [success, setSuccess] = useState(false);
  let [sessionId, setSessionId] = useState('');
 


  
  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get('success')) {
      setSuccess(true);
      setSessionId(query.get('session_id'));
    }

    if (query.get('canceled')) {
      setSuccess(false);
      setMessage(
        "Order canceled -- continue to use Free Network Monitor and subcribe when you're ready."
      );
    }
  }, [sessionId]);

  if (apiUser.accountType=='Free' ) {
    return <PricingContent token={token} siteId={siteId} noRedirect={false} apiUser={apiUser}/>;
  } else if (apiUser.accountType!='Free' ) {
    return <PricingContent token={token} siteId={siteId} noRedirect={false} apiUser={apiUser}/>;
  } else {
    return <Message message={message} />;
  }
}
export default React.memo(StripeCheckout);
