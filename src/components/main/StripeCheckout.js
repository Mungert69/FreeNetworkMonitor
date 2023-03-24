import React, { useState, useEffect } from 'react';
import { updateApiUser,resendVerifyEmail } from '../dashboard/ServiceAPI';


const ProductDisplay = (userId) => {
  const checkoutUrl='http://localhost:2058/CreateCheckoutSession/'+userId.userId;
  return <React.Fragment>
    <section>
      <form action={checkoutUrl} method="POST">
        <input type="hidden" id="basicPrice" name="priceId" value="price_1MmoEnD5M5d8AAHNeTLVHOma" />
        <img
          src="/img/starter.png"
          width="120"
          height="120"
        />
        <div class="name">Starter</div>
        <div class="price">£1</div>
        <div class="duration">per month</div>
        <button id="basic-plan-btn">Select</button>
      </form>
    </section>
    <section>
      <form action={checkoutUrl} method="POST">
        <input type="hidden" id="proPrice" name="priceId" value="price_1MmoHiD5M5d8AAHNuM1pMwtI" />
        <img
          src="/img/professional.png"
          width="120"
          height="120"
        />
        <div class="name">Professional</div>
        <div class="price">£2</div>
        <div class="duration">per month</div>
        <button id="pro-plan-btn">Select</button>
      </form>
    </section>
  </React.Fragment>;
 
};

const SuccessDisplay = ({ sessionId,customerId }) => {
  return (
    <section>
      <div className="product Box-root">
        <Logo />
        <div className="description Box-root">
          <h3>Subscription to starter plan successful!</h3>
        </div>
      </div>
      <form action="http://localhost:2058/customer-portal" method="POST">
        <input
          type="hidden"
          id="session-id"
          name="session_id"
          value={sessionId}
        />
        <button id="checkout-and-portal-button" type="submit">
          Manage your billing information
        </button>
      </form>
      <form action="http://localhost:2058/customer-portal" method="POST">
        <input
          type="hidden"
          id="customer-id"
          name="customer_id"
          value={customerId}
        />
        <button id="checkout-and-portal-button" type="submit">
          Manage your billing information from CustomerID
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
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, [sessionId]);

  if (!success && message === '') {
    return <ProductDisplay userId={apiUser.userID}/>;
  } else if (success && sessionId !== '') {
    return <SuccessDisplay sessionId={sessionId} customerId={apiUser.customerId}/>;
  } else {
    return <Message message={message} />;
  }
}

const Logo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="14px"
    height="16px"
    viewBox="0 0 14 16"
    version="1.1"
  >
    <defs />
    <g id="Flow" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g
        id="0-Default"
        transform="translate(-121.000000, -40.000000)"
        fill="#E184DF"
      >
        <path
          d="M127,50 L126,50 C123.238576,50 121,47.7614237 121,45 C121,42.2385763 123.238576,40 126,40 L135,40 L135,56 L133,56 L133,42 L129,42 L129,56 L127,56 L127,50 Z M127,48 L127,42 L126,42 C124.343146,42 123,43.3431458 123,45 C123,46.6568542 124.343146,48 126,48 L127,48 Z"
          id="Pilcrow"
        />
      </g>
    </g>
  </svg>
);