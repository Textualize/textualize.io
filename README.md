# Textualize.io

This is the code that powers https://www.textualize.io

We welcome PRs to add projects to the Rich / Textual galleries. Can't promise we will accept anything else, but feel free to ask!

## Start dev server for maintaining purpose

You will need Node.js (version 16 to run the site locally.  
Using [nvm](https://github.com/nvm-sh/nvm#intro) is the recommended way to install such a version. Once it is installed, you can run the following commands:

-   `nvm install 16 && nvm use 16` - installs Node.js v16
-   `npm i` - installs the Node.js dependencies
-   `npm run dev` - starts the local development server

Open [http://localhost:3000](http://localhost:3000) with your browser to see the local website.

## Tech stack

The UI is made with React and TypeScript, compiled to static web pages thanks to [Next.js](https://nextjs.org/),
and hosted on [Vercel](https://vercel.com/).

## Run prettier

Run the following before committing:

```
npm run format:fix
```
