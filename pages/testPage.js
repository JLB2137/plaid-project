import React, { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';

const Link = () => {
  const [pubToken, setPubToken] = useState(null); // Store the public token

  // Function to fetch public token
  const getPublicToken = async () => {
    const response = await fetch('/api/public-token-exchange', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Response status:', response.status); // Log status
  
    if (!response.ok) {
      console.error('Failed to fetch public token');
      return null;
    }
    
    const data = await response.json();
    console.log('Public token data:', data.public_token); // Log data after parsing
    setPubToken(data.public_token);
    return data.public_token;
  };

  // Callback function that runs after Plaid's link is successful
  const onSuccess = React.useCallback(async (public_token, metadata) => {
    console.log('Plaid public token received:', public_token);
    try {
      const response = await fetch('/api/access-token-exchange', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public_token }),
      });
      const data = await response.json();
      console.log('Access token received:', data.access_token); // Log access token
      // You can store the access token in the state if needed
    } catch (error) {
      console.error('Error exchanging public token:', error);
    }
  }, []);

  // Fetch public token on mount
  useEffect(() => {
    const fetchToken = async () => {
      await getPublicToken(); // Fetch the public token and set it in state
    };

    fetchToken();
  }, []); // Empty dependency array ensures this only runs once on component mount

  // Plaid link configuration, only use pubToken after it is fetched
  const config = {
    token: pubToken.public_token, // Use the public token to initialize Plaid Link
    onSuccess, // onSuccess is the callback that will handle token exchange
  };

  console.log('here',pubToken.public_token)

  const { open, ready } = usePlaidLink(config);

  // Render the button once pubToken is available
  if (!pubToken) {
    return <div>Loading...</div>; // Show a loading state while the token is being fetched
  }

  return (
    <div>
      <button onClick={() => open()} disabled={!ready}>
        Link account
      </button>
    </div>
  );
};

export default Link;
