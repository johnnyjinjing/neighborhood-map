##Neighborhood Map

###1. Build the project

**Grunt** is used for building the project. If you do not have it installed, you need to first install the Grunt's command line interface (CLI) globally. You may need to use ```sudo``` or run your command shell as Administrator to do this.
```
npm install -g grunt-cli
```
Then check out the repository and install all dependencies needed. To do that, enter the root directory of the project in terminal, and run
```
npm install
```
To build the project, in the root directory, simply run:
```
grunt
```
`package.json`, and `Gruntfile.js` are located in the root directory. `src/` directory includes all source files, and `dist/` is the distribution directory.