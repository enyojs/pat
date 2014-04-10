> This is a very rough initial pass to get started

### Performance Analysis Tool

This tool is designed to aid in simple, automatable performance tests running in the browser.
The tests can be run (currently) on any WebKit based browser and will automatically store results
in a database for analysis.

### Setup

Ensure that you `npm install` inside the directory once you've downloaded the repository. Then simply `./index.js`
and it will startup a local server listening for HTTP connections from browsers on the port `18980`.

So, if I am running the service locally and intend to run it from a local browser I navigate to `http://localhost:18980`
to run tests and to see results I navigate to `http://localhost:18980/results.html`. To execute the tests on another
device or machine simply use your local machines IPv4 address and the port `18980`.