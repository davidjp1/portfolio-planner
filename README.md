# portfolio-planner

[https://stock-portfolio-planner.web.app/](https://stock-portfolio-planner.web.app/)

## Prerequisites

- node.js v16
- An alpha vantage API key [https://www.alphavantage.co](https://www.alphavantage.co)
- A blaze plan firebase project

## Setup

- Update the `.env` file in `/` for the following keys:

```
REACT_APP_FUNCTIONS_URL=
REACT_APP_FIREBASE_API_KEY
REACT_APP_FIREBASE_APP_ID=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_MEASUREMENT_ID=
```

- Create a new `.env` file in `/functions` with the following keys:

```
ALPHA_VANTAGE_KEY=
```

- Run necessary firebase emulators/deployments as per your usecase.
