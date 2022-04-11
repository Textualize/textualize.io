# textualize

## start dev server for maintaining purpose

-   `npm i`
-   `npm run dev`

## How get the plain CSS and HTML

-   `npm run build`
-   CSS -> go to folder `.next/static/css/[token].css` This is the generated minified plain css out of the Sass
-   HTML -> go to folder `.next/server/pages/index.html`
    Attention! Since the HTML is build by NextJS the HTML contains NextJS specific tags.
    Make sure you are coping the content of `<div id="__next" data-reactroot="">`
