import React, { useContext, useEffect, useState } from 'react';
import { Cookies } from 'react-cookie';
import { AuthContext } from '../components/withAuth';
import { OktaAuth } from '@okta/okta-auth-js';
import { useRouter } from 'next/router';

export const getServerSideProps = () => {
  return {
    props: {
      clientId: process.env.OKTA_CLIENT_ID,
      issuer: `${process.env.OKTA_DOMAIN}/oauth2/default`,
    },
  };
};

const Callback = ({ clientId, issuer }) => {
  const router = useRouter();

  const [context, setContext] = useState(useContext(AuthContext));

  useEffect(() => {
    setContext({
      client: new OktaAuth({
        clientId,
        issuer,
        scopes: ['openid', 'email', 'profile'],
      }),
    });
  }, []);

  useEffect(() => {
    const getToken = async () => {
      const { client } = context;
      try {
        if (client !== null) {
          const { tokens } = await client.token.parseFromUrl();
          await client.tokenManager.setTokens(tokens);
          router.push('/private');
        }
      } catch (error) {
        router.push('/');
      }
    };
    getToken();
  }, [context]);

  return null;
};

export default Callback;
