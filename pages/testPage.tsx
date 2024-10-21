import React, { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { LinkToken } from "./types/types";
import { PlaidLinkOnSuccess } from "react-plaid-link";

const Link = () => {
  const [pubToken, setPubToken] = useState<string | null>(null); // Store the public token
  const [linkToken, setLinkToken] = useState<LinkToken | null>(null);

  //currently input methods have no effect on apis
  const createLinkToken = async () => {
    const response = await fetch("/api/get-link-token", {});

    const data = await response.json();
    console.log("found response status LINK", response.status);
    console.log("found response status LINK", data!.link_token);
    setLinkToken(data.link_token);
    console.log("LINK", linkToken);
    return;
  };

  // Function to fetch public token
  const getPublicToken = async () => {
    const response = await fetch("/api/public-token-exchange", {});
    console.log("Response status:", response.status); // Log status

    if (!response.ok) {
      console.error("Failed to fetch public token");
      return null;
    }

    const data = await response.json();
    console.log("Public token data:", data.public_token); // Log data after parsing
    setPubToken(data.public_token);
    return data.public_token;
  };

  // Callback function that runs after Plaid's link is successful
  const onSuccess: PlaidLinkOnSuccess = React.useCallback(async (public_token, metadata) => {
    console.log("Plaid public token received:", public_token);

    console.log('metadata',metadata)

    try {
      const dbRoute = await fetch('/api/get-db-data',{
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({metadata})
      })
      const newData = await dbRoute.json()
      console.log("Access token received:", newData); // Log access token
      // You can store the access token in the state if needed
      return;
    } catch (error) {
      console.error("Error exchanging public token:", error);
    }
  }, []);

  const getBalances = async() => {


    try {
      const access_key = await fetch("/api/access-token-exchange", {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ pubToken }),
      });
      let access_token = await access_key.json()
      access_token = access_token.access_token
      const accounts = ['Q5ABxElGl6UG3NaAZNRxIe4WLdnVpPtwlgZwQ','Z5A7Qvaya6UJe3RAW36Quj1EQbAaeKfe1EPe6']
      const dbRoute = await fetch('/api/get-balance',{
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          access_token: access_token,
          accounts: accounts

        })
      })
      const newData = await dbRoute.json()
      console.log("Access token received:", newData); // Log access token
      // You can store the access token in the state if needed
      return;
    } catch (error) {
      console.error("Error exchanging public token:", error);
    }
  };

  // Fetch public token on mount
  useEffect(() => {
    const fetchToken = async () => {
      await createLinkToken();
      await getPublicToken(); // Fetch the public token and set it in state
    };

    fetchToken();
  }, []); // Empty dependency array ensures this only runs once on component mount

  let config = {
    token: "", // Use the public token to initialize Plaid Link
    onSuccess,
  };
  // Plaid link configuration, only use pubToken after it is fetched
  if (linkToken) {
    config = {
      token: linkToken?.link_token, // Use the public token to initialize Plaid Link
      onSuccess, // onSuccess is the callback that will handle token exchange
    };
  } else {
    config = {
      token: "", // Use the public token to initialize Plaid Link
      onSuccess, // onSuccess is the callback that will handle token exchange
    };
  }

  console.log("here", pubToken);
  console.log("linkToken", linkToken);
  console.log



  const { open, ready, exit } = usePlaidLink(config);

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
