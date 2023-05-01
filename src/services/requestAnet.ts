import { User } from '../models/User';
import { Match } from '../models/Match';
import { PlayerMatch } from '../models/PlayerMatch';
import client from 'gw2api-client';

export const requestAnet = (emitter: { emit: (arg0: string, arg1: any) => void; }) => {
  // store interval
  const isTimerActive = false;

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

            // process match results
            for (const game of gameResults) {
              try {
                // check if a document for this match with the user reference exists in db
                let foundMatchId;
                const foundMatch = await Match.findOne({
                  match_id: game.match_id,
                  players: { $in: [user._id] },
                }).lean();

                // if no document is found then create a new one or update the existing one
                if (!foundMatch) {
                  try {
                    const newMatch = await Match.updateOne(
                      { match_id: game.match_id },
                      {
                        $setOnInsert: {
                          players: [user._id],
                          started: new Date(game.started),
                          ended: new Date(game.ended),
                        },
                        $addToSet: { players: user._id }
                      },
                      { upsert: true },
                   ).lean();

                   if (newMatch) {
                    foundMatchId = newMatch._id;
                   }
                  } catch (er) {
                    console.error('Unable to create new match document');
                  }
                } else {
                  foundMatchId = foundMatch._id;
                }

                // check if a document for this playermatch exists
                if (foundMatchId) {
                  const foundPlayerMatch = await PlayerMatch.findOne({
                    user_ref: user._id,
                    match_ref: foundMatchId,
                  }).lean();

                  // if no document is founds then create a new one
                  if (!foundPlayerMatch) {
                    const newPlayerMatch = new PlayerMatch({
                      user_ref: user._id,
                      match_ref: foundMatchId,
                      map_id: game.map_id,
                      started: new Date(game.started),
                      ended: new Date(game.ended),
                      result: game.result,
                      team: game.team,
                      profession: game.profession,
                      scores: game.scores,
                      rating_type: game.rating_type,
                      rating_change: game.rating_change,
                      season: game.season,
                    });
                    const savedNewPlayerMatch = await newPlayerMatch.save();

                    if (savedNewPlayerMatch) {
                      try {
                        const returnNewMatchInfo = await PlayerMatch.findOne({ _id: savedNewPlayerMatch._id }).populate({
                          path: 'match_ref.players',
                          select: 'name',
                        }).lean();

                        if (returnNewMatchInfo) {
                          emitter.emit('update', {
                            user_id: user._id,
                            new_match: returnNewMatchInfo,
                          });
                        }
                      } catch {
                        console.error('Could not find new match reference');
                      }
                    }
                  }
                }
              } catch (e) {
                console.error('Unable to create new playermatch document');
              }
            }

          } catch (err) {
            console.log(err);
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
    // let timer = setInterval(() => {
    //   console.log('start interval')
    //  });

    // if (action === 'start') {
    //   if (isTimerActive === false) {
    //     // immediately request info and start the timer afterward
    //     requestApi();
    //     timer = setInterval(() => {
    //       requestApi();
    //     }, 30*60*60); // every 30 minutes
    //     isTimerActive = true;
    //   }
    // }

    // if (action === 'stop') {
    //   // stop timer (no connections)
    //   clearInterval(timer);
    //   isTimerActive = false;
    // }
  };
};