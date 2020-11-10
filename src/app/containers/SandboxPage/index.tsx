/**
 *
 * SandboxPage
 *
 */

import React from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';

export function SandboxPage(props) {
  const dispatch = useDispatch();

  function getUser() {
    const apiKey = process.env.REACT_APP_MAIL_API_KEY;
    const srv = process.env.REACT_APP_MAIL_SRV;
    axios
      .post(
        srv + 'getUser',
        {
          email: 'k.shall0507@gmail.com',
        },
        {
          headers: {
            Authorization: apiKey,
          },
        },
      )
      .then(res => {
        console.log('got user');
        console.log(res.data);
        dispatch({ type: 'getUser' });
      })
      .catch(e => console.log(e));
  }
  return (
    <div>
      <button onClick={getUser}>Get User</button>
    </div>
  );
}
