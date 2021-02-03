import React, { useContext } from 'react';
import { AuthContext } from '../components/withAuth';
import { OktaAuth } from '@okta/okta-auth-js';
import xw from 'xwind';

const Index = ({ clientId, issuer }) => {
  const handleLogin = () => {
    const client = new OktaAuth({
      devMode: process.env.NODE_ENV !== 'production',
      scopes: ['openid', 'email', 'profile'],
      redirectUri: 'http://localhost:3000/callback',
      clientId,
      issuer,
    });
    client.token.getWithRedirect();
  };

  return (
    <div css={xw`grid justify-center items-center h-screen space-y-20`}>
      <div css={xw`space-y-20`}>
        <button
          css={xw`bg-indigo-600 text-white px-8 py-2 rounded`}
          onClick={handleLogin}
        >
          Login with Okta
        </button>
      </div>
    </div>
  );
};

export default Index;

export const getServerSideProps = () => {
  return {
    props: {
      clientId: process.env.OKTA_CLIENT_ID,
      issuer: `${process.env.OKTA_DOMAIN}/oauth2/default`,
    },
  };
};
