> This is a very rough initial pass to get started and is intended for internal use only at this point

## Performance Analysis Tool

This tool is designed to aid in simple, automatable performance tests running in the browser.
The tests can be run (currently) on any WebKit based browser and will automatically store results
in a database for analysis.

## Setup

Ensure that you `npm install` inside the directory once you've downloaded the repository. Then simply `./index.js`
and it will startup a local server listening for HTTP connections from browsers on the port `18980`.

So, if I am running the service locally and intend to run it from a local browser I navigate to `http://localhost:18980`
to run tests and to see results I navigate to `http://localhost:18980/results.html`. To execute the tests on another
device or machine simply use your local machines IPv4 address and the port `18980`.

## Copyright and License Information

Unless otherwise specified, all content, including all source code files and
documentation files in this repository are:

Copyright (c) 2012-2014 LG Electronics

Unless otherwise specified or set forth in the NOTICE file, all content,
including all source code files and documentation files in this repository are:
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this content except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.