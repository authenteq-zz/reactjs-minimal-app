This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

You can find the most recent version of this guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Integration Manual

For complete integration manual, refer to [Authenteq Integration Manual](https://authenteq.atlassian.net/wiki/spaces/CG/pages/98953/Authenteq+ID+Implementation+Guide).

## Installing and starting the app

First, you have to install all dependencies using the `npm` or `yarn` command. The application consists of a frontend part and backend API. We implement backend API, so we don't expose `Authenteq API key`. Backend is using `Authenteq API key` along with `Authenteq PartnerID` to query Authenteq service.

### Installation

Use `npm install` or `yarn` to install all dependencies.

### Client start

Run `npm run start` or `yarn start` to start client-side part of the application.

### Server start
Run `npm run server` or `yarn server` to start server-side part (API) of the application.

Server API will be running and http://localhost:3001 and frontend will run on http://localhost:3000 by default.

## Authenteq Claims

### Anti-money laundering (AML)

Sample result (JSON):
  `{"id":0,"ref":"1527688904-A1rpXA6h","match_status":"no_match"}`

### Know your customer (KYC)

The KYC endpoint will return a JPEG photo of user's passport in binary format.
