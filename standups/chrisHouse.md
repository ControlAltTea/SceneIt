**Note-taker**: Chris House
**Daily Standup** - Monday
**Team Member**: Chris House

### What did you work on?
- Reviewed and debugged `ratings.js`.
- Identified Prisma `upsert` issues for media and playlist ratings.
- Prepared Postman test data (user "Chris", media `tmdbId: 157336`).

### What are you going to work on?
- Test ratings routes in Postman (media & playlist CRUD).

### Any near-future blockers and how can we support you?
- Confirm database has seeded user "Chris" and sample media/playlist data.

--- 

**Note-taker**:
**Daily Standup** - Tuesday
**Team Member**: 

### What did you work on?
- Tested `/ratings` routes: create, read, update, delete.
- Resolved HTTP/HTTPS issue in Postman.

### What are you going to work on?
- Begin designing `/comments` route for media & playlists.
- Define Prisma `Comment` model.

### Any near-future blockers and how can we support you?
- Ensure Prisma schema matches intended relationships (User, Media, Playlist, Comment).


--- 

**Note-taker**: Chris House
**Daily Standup** - Wednesday
**Team Member**: Chris House

### What did you work on?
- Implemented `/comments` route with full CRUD operations.
- Integrated `Comment` model with cascade deletes and indexes.
- Updated `server.js` to register `/comments` route.


### What are you going to work on?
- Test `/comments` routes in Postman.
- Validate relationships between comments, users, media, and playlists.



### Any near-future blockers and how can we support you?
- Ensure cascade deletes work correctly without affecting unrelated data.

**Note-taker**: Chris House
**Daily Standup** - Saturday
**Team Member**: Chris House

### What did you work on?
- Performed end-to-end Postman testing of `/comments` routes.
- Updated `/ratings` and `/comments` PR messages and commit description.
- Verified documentation and code style.



### What are you going to work on?
- Push feature branch to GitHub and prepare PR.
- Address any merge conflicts.


### Any near-future blockers and how can we support you?
- Awaiting PR approval/merge to `dev` branch.

**Note-taker**: Chris House
**Daily Standup** - Sunday
**Team Member**: Chris House

### What did you work on?
- Finalized PR description and commit message for Ratings and Comments routes.
- Investigated missing GitHub merge button (existing PR).
- Organized Postman test plans and documented workflows for Ratings & Comments.



### What are you going to work on?
- Monitor PR merge status.
- Plan next feature update for comments (nested replies or reactions).



### Any near-future blockers and how can we support you?
- Merge approval pending for open PR.
- Future tasks depend on successful integration of Ratings and Comments into `dev`.