# API

> Development API for an exjobb
> This API runs Node/Typescript/Express with a Firestore Database

## Code structure

This API is structured in a modular manner, where dependencies are injected to make it easier
to test, scale, modify, isolate or compose the system at a later point.

Dependencies are injected from `index.ts` into the `controllers`, `services` and `server` -> `router`

`index.ts` (creates all dependencies and starts the server)<br>
↓<br>
`server.ts` (server configuration)<br>
↓<br>
`/router/` (defines all routes, connects routes and controllers, sends final response and response type)<br>
↓<br>
`/controllers/` (contains the "story" for each endpoint, doing the actions needed and talking to services to get the job done)<br>
↓<br>
`/services/` (contains isolated services. These are to be thought about as "standalone", containing their own dependencies, tooling, types, models and whatever else they need to fill their function)<br>

## Tips

### Git commands

##### *Delete multiple branches*

Run this command to test what branches will be deleted

    git branch | grep "<pattern>"

Then run this command to actually delete them

    git branch | grep "<pattern>" | xargs git branch -D

For example

    git branch | grep "feature-*"
    git branch | grep "feature-*" | xargs git branch -D

