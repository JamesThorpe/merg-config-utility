# MCU

In order to run this, you'll need Visual Studio and node.js installed.  Clone the repo.

To run the server, you'll need to get a copy of [Asgard](https://github.com/RichardCrawshaw/Asgard) - we're working on
making it available in Nuget.  For now, either build it locally and add a dll reference, or add a project reference
from inside mcu-server.  The server should now start - you should be able to load it at

http://localhost:5290/swagger/index.html

This will load up a GUI showing the various API operations available.

To run the frontend, load up a console and navigate to the root repo directory.  Run:
```
npm ci
npm run serve
```

The first command runs a clean installation of all the NPM dependencies needed, the second starts a webpack based
server to serve the files from.  You should now be able to navigate to:

http://localhost:8080/

