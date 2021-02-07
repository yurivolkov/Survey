import React from 'react';
import { Link } from 'react-router-dom';
import { Language, Login, Register, Account, ForgotPassword, Notifications } from 'components';
import { Divider } from 'antd';
import MobileMenu from './MobileMenu';
import MobileSider from './MobileSider';

export default ({ account }) => {

  return (
    <div className="full-height d-flex a-center">
      <MobileSider />
      <Link to="/">
        <img className="Logo" src="/static/img/logo.svg" alt="Optimal Rating" />
      </Link>
      <MobileMenu account={account} />
      <div className="ml-auto Menu">
        {account ?
          <>
            <Notifications />
            <Account account={account} />
          </>
          :
          <>
            <Login />
            <Divider type="vertical" />
            <Register />
            <ForgotPassword />
          </>
        }
        <Language />
      </div>
    </div>
  );
};