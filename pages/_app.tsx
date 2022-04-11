import Head from "next/head";
import React from "react";
import "../src/style/index.scss";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Textualize</title>
        <link rel="icon" href="/favicon.ico" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              try {
                var theme = localStorage.getItem('theme');
                if (theme === 'dark') {
                  return;
                }
                
                if (theme === 'light' || window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
                  document.documentElement.setAttribute('light', true);
                }
              } catch (e) {
                console.error(e);
              }
            })();
          `,
          }}
        />
      </Head>

      <Component {...pageProps} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // theme toggler listener
              var themeToggler = document.getElementById('theme-toggler');
              themeToggler.addEventListener('click', function() {
                try {
                  if (document.documentElement.getAttribute('light')) {
                    localStorage.setItem('theme', 'dark');
                    document.documentElement.removeAttribute('light');
                  } else {
                    localStorage.setItem('theme', 'light');
                    document.documentElement.setAttribute('light', true);
                  }
                } catch (e) {
                  console.error(e);
                }
              });

              // Intersection Observer - Projects
              document.querySelectorAll('.project__editor-back-layout-wrapper').forEach(function(el) {
                var observerProjects = new window.IntersectionObserver(function(entries) { 
                  entries.forEach(function(item) {
                    if (item.isIntersecting) {
                      el.classList.add('project__editor-back-layout-wrapper--visible');
                    }
                  });
                }, { 
                  rootMargin: "0px",
                  threshold: 1.0,
                });
                observerProjects.observe(el);
              });

              // Intersection Observer - Footer
              var footerEl = document.querySelector('footer');
              var observerProjects = new window.IntersectionObserver(function(entries) { 
                entries.forEach(function(item) {
                  footerEl.classList.toggle('footer--visible', item.isIntersecting);
                });
              }, {
                rootMargin: "0px",
                threshold: 0.3,
              });
              observerProjects.observe(footerEl);
              
            })();
          `,
        }}
      />
    </>
  );
}

export default MyApp;
