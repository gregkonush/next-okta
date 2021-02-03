import React from 'react';
import { withAuth, withAuthServerSideProps } from '../components/withAuth';
import xw from 'xwind';

const Private = () => (
  <div
    css={[
      xw`w-full h-full flex bg-rose-800 items-center justify-center text-white`,
      `height: 100vh;`,
    ]}
  >
    <div>some secret information</div>
  </div>
);

export default withAuth(Private);

export const getServerSideProps = withAuthServerSideProps();
