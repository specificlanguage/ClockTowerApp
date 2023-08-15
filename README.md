# ClockTowerApp

This is the backend for a (incredibly still in progress!) version of the game [Blood on the Clock Tower](https://bloodontheclocktower.com/), best described as a social deception, role-playing game of Mafia, but it's way more complicated than that. The game *does* have [an open-source implementation](https://clocktower.online/) that's now deprecated, and [a newer version which requires payment](https://online.bloodontheclocktower.com). Ideally, this would be closer to the first version.

**This should not be used to play a game,** it's still very much under construction.

To try to play the game, use `pnpm dev`, or your favorite package manager.

This repository is the frontend setup written in React for the game, which shows the game state to the client. It's incredibly barebones but it will include:
- Separate screens for players and storytellers
- Buttons and working modules for use during play
- Interactive updates from the [Go backend](https://github.com/specificlanguage/ClockTowerAPI).

At the moment this is nowhere near complete, and generally this will just be a long-term side project for me (and my friends') own enjoyment.

TODOs:
- [x] Joining games
- [x] Setup screen (for storyteller)
- [~] Game screens (working on it!)
  - [x] Main display of users
  - [ ] Night selection and information screens
  - [ ] Voting
- [ ] End of game summary

Side note: This current iteration is written in Vite, a previous attempt at a backend (and could very well be to this day) was made in Next.js' app router, but was scrapped as many elements in the game (notably, the WebSocket), require use of client-side Javascript, which today's frameworks generally frown upon. 
