import React, { useState, useEffect } from 'react';
import { updateApiUser,resendVerifyEmail } from '../dashboard/ServiceAPI';
import PricingContent  from '../main/PricingContent';



const SuccessDisplay = ({ sessionId,userApi }) => {
  return (
    <section>
      <div className="product Box-root">

        <div className="description Box-root">
          <h3>You are Subscribed to the {userApi.accountType} Plan</h3>
        </div>
      </div>
      
      <form action="http://localhost:2058/customer-portal" method="POST">
        <input
          type="hidden"
          id="customer-id"
          name="customer_id"
          value={userApi.customerId}
        />
        <button id="checkout-and-portal-button" type="submit">
          Manage your Subcription
        </button>
      </form>
    </section>
  );
};

const Message = ({ message }) => (
  <section>
    <p>{message}</p>
  </section>
);

export default function StripeCheckout({ apiUser, token, siteId }) {
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
    return <PricingContent noRedirect={false}/>;
  } else if (apiUser.accountType!='Free' ) {
    return <SuccessDisplay sessionId={sessionId} userApi={apiUser}/>;
  } else {
    return <Message message={message} />;
  }
}

