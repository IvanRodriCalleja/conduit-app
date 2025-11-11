# Running React on CoderPad

This pad is running a React app that is served by Vite. Changes are automatically captured as you type them, and other people in the Pad can see them. You can add as many files to the project as you need, as well as any NPM packages.

## IntelliSense

IntelliSense is running across your entire project, allowing you to see when there are syntax errors or to get quick hints for how to resolve errors or TypeScript issues.

## Shell

A shell is provided to you so you can inspect your container in more detail. The shell can be used to install NPM packages using `yarn add <package>`. In addition to installing packages, the shell can be used for executing a test suite if you have one defined.

**Note: while it's possible to edit files directly from the shell, we recommend using the editor to make your changes. That way, other people in the Pad can see your changes as they're being made.**

## Hot Module Reloading

Vite provides Hot Module Reloading by default, meaning that changes you make to the files in your project are automatically applied (after a 2 second debounce); there is no need to refresh the iframe to see the changes. Vite will display any errors directly in the application output, or if there is a system-wide error, in the Logs.

Note that changes to certain files (index.html, vite.config.ts, and others) will cause the entire application to reload, while changes to other files (App.tsx) will not cause an app reload. The state of the application will be reset whenever the application reloads.

## Assets

Out-of-the-box support for SVG files is included, just add a `whatever.svg` file and then import it wherever you need it. Other assets will need to be hosted elsewhere and fetched via the shell, or just referenced directly in HTML tags.
