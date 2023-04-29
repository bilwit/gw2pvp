import { User } from '../models/User';
import { Match } from '../models/Match';
import { PlayerMatch } from '../models/PlayerMatch';
import client from 'gw2api-client';

export const requestAnet = (emitter: { emit: (arg0: string, arg1: any) => void; }) => {
  // store interval
  let isTimerActive = false;

  // response handler
  const requestApi = async () => { 
    try {
      // get list of users
      const usersList = await User.find().select('_id apiKey').lean();

      // request latest info for eech user
      if (usersList && Array.isArray(usersList) && usersList.length > 0) {
        for (const user of usersList) {

          try {
            // Get an instance of an API client
            const api = client();
            api.authenticate(user.apiKey);
            const gameResults = await api().pvp().games();
            // [
            //   {
            //     "id": "ABCDE02B-8888-FEBA-1234-DE98765C7DEF",
            //     "map_id": 894,
            //     "started": "2015-07-08T21:29:50.000Z",
            //     "ended": "2015-07-08T21:37:02.000Z",
            //     "result": "Defeat",
            //     "team": "Red",
            //     "profession": "Guardian",
            //     "scores": {
            //       "red": 165,
            //       "blue":507
            //     }
            //     "rating_type" : "Ranked",
            //     "rating_change" : -26,
            //     "season" : "49CCE661-9DCC-473B-B106-666FE9942721"
            //   }
            // ]

            for (const game of gameResults) {
              var query = {},
              update = { expire: new Date() },
              options = { upsert: true, new: true, setDefaultsOnInsert: true };

              // Create PlayerMatch document

              // Upsert Match document
              // Match.findOneAndUpdate(query, update, options, (error, result) => {
              //     if (error) return;

              //     // do something with the document
              // })
            } 

          } catch (err) {
            null;
          }

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