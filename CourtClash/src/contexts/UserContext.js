// SETUP
import React, {useState, useEffect} from 'react';
import {ReactNode} from 'react';

// REDUCERS
import {UserReducer, UserReducer_InitialState} from '@reducers';
// AUTH
// import {Magic} from '@magic-sdk/react-native-bare';
// import {FlowExtension} from '@magic-ext/flow';
import * as fcl from '@onflow/fcl';

// API
import {MAGIC_LINK_API_KEY} from '@env';

export const UserContext = React.createContext({});

const UserProvider = ({children}) => {
  const [user, setUser] = useState(null);
  console.log('MAGIC_LINK_API_KEY---', MAGIC_LINK_API_KEY);
  // const magic = new Magic(MAGIC_LINK_API_KEY);

  // useEffect(() => {
  //   magic.user.isLoggedIn().then(isLoggedIn => {
  //     if (isLoggedIn) {
  //       magic.user.getMetadata().then(userData => {
  //         setUser(userData);
  //       });
  //     }
  //   });
  // }, []);

  // const loginWithMagicLink = async email => {
  //   await magic.auth.loginWithMagicLink({email});
  //   const userData = await magic.user.getMetadata();
  //   setUser(userData);
  // };

  // const logout = async () => {
  //   await magic.user.logout();
  //   setUser(null);
  // };

  // const UserContextValue = {user, loginWithMagicLink, logout};

  return (
    <>
      <UserContext.Provider value={null}>{children}</UserContext.Provider>
      {/* <magic.Relayer /> */}
    </>
  );
};

export default UserProvider;
