2048 game Solver
===========

Watch & Play online here: http://vivinte.com/2048
-------------
The excellent Solver is borrowed from here: https://github.com/nneonneo/2048-ai

This project hocks that solver to a node.js app and uses socket.io to communicate between browser and a python process.
## Building
### Unix/Linux/OS X
1) Execute:

     cd ai
     make
Any relatively recent C++ compiler should be able to build the output.
Note that you don't do `make install`; this program is meant to be run from this directory.

2) Install node.js and npm: http://nodejs.org/  
3) Execute (from the repository directory):

    npm install
this will install the necessary packages.

4) Execute <code>node app.js</code> to run the app.

Go to http://localhost:8080 to play the game!



