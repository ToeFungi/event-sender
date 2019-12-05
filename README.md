# Event Sender
[![Build Status](https://travis-ci.org/ToeFungi/event-sender.svg?branch=master)](https://travis-ci.org/ToeFungi/event-sender)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=event-sender&metric=alert_status)](https://sonarcloud.io/dashboard?id=event-sender)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=event-sender&metric=bugs)](https://sonarcloud.io/dashboard?id=event-sender)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=event-sender&metric=code_smells)](https://sonarcloud.io/dashboard?id=event-sender)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=event-sender&metric=coverage)](https://sonarcloud.io/dashboard?id=event-sender)

This is the event sender module within the Event Scheduler Domain. It is triggered every minute by an AWS CloudWatch
event. It retrieves all items scheduled for the minute of execution from DynamoDB and attempts to publish the scheduled
events back to the client via the callback mechanism specified by the client in the initial request.

## Installation
To get started with this project, you need to clone this repository and install the node dependencies
```
$ git clone git@github.com:ToeFungi/event-sender.git
$ cd event-sender
$ npm install
```

## Tests
This project is completely covered by unit tests. To run these tests you can run the following commands
```
$ npm run lint
$ npm run test
$ npm run coverage
```

## Contribution
Any feedback and contributions are welcome. Just create a pull request. Please ensure to include any adjustments to the
existing tests and to cover the new code with unit tests.
