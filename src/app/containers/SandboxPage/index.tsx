/**
 *
 * SandboxPage
 *
 */

import React, { useReducer, useState } from 'react';
import axios from 'axios';
import { useAccount } from '../../hooks/useAccount';

// function getUser() {
//   axios
//     .post(
//       srv + 'getUser',
//       {
//         email: 'k.shall0507@gmail.com',
//       },
//       {
//         headers: {
//           Authorization: apiKey,
//         },
//       },
//     )
//     .then(res => {
//       console.log('got user');
//       console.log(res.data);
//     })
//     .catch(e => console.log(e));
// }

export function SandboxPage(props) {
  return <div className="container mt-5 bg-white p-5"></div>;
}
