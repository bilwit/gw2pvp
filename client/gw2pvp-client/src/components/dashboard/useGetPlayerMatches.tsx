import { useState, useEffect } from 'react';
// import socketIOClient from 'socket.io-client';

const ENDPOINT = '/';

function useGetPlayerMatches(): { 
  data: {},
  error: string, 
} {
  const [data, setData] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const wrapDispatch = async () => {

      // try {
      //   // get new socket from API
      //   // const { token } = getState().auth;
      //   const socket = socketIOClient(ENDPOINT, {
      //     transports: ['websocket'],
      //     // extraHeaders does not work with 'websocket' option
      //     // query: {
      //     //   type: type,
      //     // },
      //   });

      //   if (socket) {
      //     socket
      //     .on(playerId, (update) => {
      //       console.log(update);
      //     })
      //     .on('error', (error: string) => {
      //       console.log(error);
      //       setError(error);
      //     })
      //   }

      // } catch (err) {
      //   console.log(error);
      // }

      try {
        const result = await fetch(
          '/api/user',
          { method: 'GET' },
        );

        console.log(result);
      } catch (err) {
        console.log(err);
      }

    }

    if (true) {
      wrapDispatch();
    }

    return () => {
      wrapDispatch();
    }
  }, []);

  return { 
    data, 
    error, 
  };
}

export default useGetPlayerMatches;