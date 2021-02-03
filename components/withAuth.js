import React, { createContext, useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { OktaAuth } from '@okta/okta-auth-js';

export const AuthContext = createContext({ client: null });

export function withAuth(Component) {
  const AuthenticationWrapper = ({ clientId, issuer, ...props }) => {
    const router = useRouter();
    const [loggedIn, setLoggedIn] = useState(false);
    const client = new OktaAuth({
      clientId,
      issuer,
      devMode: process.env.NODE_ENV !== 'production',
      scopes: ['openid', 'email', 'profile'],
    });

    useEffect(() => {
      const checkSession = async () => {
        const session = await client.session.exists();
        if (session) {
          setLoggedIn(true);
        }
      };
      checkSession();
    });

    return loggedIn ? <Component {...props} /> : null;
  };

  return AuthenticationWrapper;
}

export function withAuthServerSideProps(getServerSidePropsFunc) {
  return async (context) => {
    if (getServerSidePropsFunc) {
      const pageProps = getServerSidePropsFunc(context);
      return {
        props: {
          ...pageProps,
          clientId: process.env.OKTA_CLIENT_ID,
          issuer: `${process.env.OKTA_DOMAIN}/oauth2/default`,
        },
      };
    }

    return {
      props: {
        clientId: process.env.OKTA_CLIENT_ID,
        issuer: `${process.env.OKTA_DOMAIN}/oauth2/default`,
      },
    };
  };
}
