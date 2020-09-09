#!/bin/bash

npm run-script build                                                                              │
docker build -t timesbook-front .                                                         │
docker tag timesbook-front localhost:5000/timesbook-front
                                      │
