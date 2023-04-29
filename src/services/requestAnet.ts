import { User } from '../models/User';

export const requestAnet = (emitter: { emit: (arg0: string, arg1: any) => void; }) => {
  // store interval
  let isTimerActive = false;

  // response handler
  const requestApi = async () => { 
    try {
      // check data
      const usersList = await User.find().select('_id apiKey').lean();

      if (usersList && Array.isArray(usersList) && usersList.length > 0) {
        for (const user of usersList) {

          // do stuff

          emitter.emit('update', { stuff: true });
        }
      }

    } catch (err) {
      console.log(err);
      emitter.emit('err', 'Could not fetch data');
    }
  };

  return async (action: string) => {
    let timer = setInterval(() => { null });

    if (action === 'start') {
      if (isTimerActive === false) {
        // immediately request info and start the timer afterward
        requestApi();
        timer = setInterval(() => {
          requestApi();
        }, 30*60*60); // every 30 minutes
        isTimerActive = true;
      }
    }
    
    if (action === 'stop') {
      // stop timer (no connections)
      clearInterval(timer);
      isTimerActive = false;
    }
  };
};