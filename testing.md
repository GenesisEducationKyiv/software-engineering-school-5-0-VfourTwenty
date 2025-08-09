### SkyFetch Testing Guide

**Integration tests:** <br>
run locally: npm run test:integration <br>
run in docker: npm run test:integration:docker

**E2E test:** <br>
run locally: npm run test:e2e <br>
run in docker: npm run test:e2e:docker <br>
[(please see a note on e2e tests)](https://github.com/GenesisEducationKyiv/software-engineering-school-5-0-VfourTwenty/blob/93d3e5b9647e143c73b04c8d9738621e34fcf357/test/e2e/end2end.js#L218)

**Unit tests:** <br>
run locally: npm run test:unit

It was discovered during test creation that the utils module is closely tied to Sequelize, which complicates scalability and test coverage. This issue will be addressed in further refactoring. The idea is to provide a level of abstraction between CRUD operations on the db tables and high level utilities that build on services and storage interactions. Overall logic placement might need to be reconsidered. Also, as there has have been difficulties validating function input/output format, it is being considered to switch to typescript and/or implement zod schema validations.