import React from "react";
import { Editor } from "./editor";

export const Hero = () => {
  return (
    <section className="container hero">
      <div className="hero__text">
        <h1 className="hero__headline">
          We love{" "}
          <span className="u-no-wrap">
            terminals
            <span className="hero__cursor" />
          </span>
        </h1>
        <p className="hero__desc">
          At Textualize, we are working on making terminals more{" "}
          <strong>beautiful</strong> and <strong>powerful</strong> than ever
          before.{" "}
        </p>
        <a href="#" className="button button--hero">
          &gt; We're&nbsp;<b> hiring</b>!_
        </a>
      </div>
      <div className="hero__terminal-wrapper">
        <div className="hero__terminal-animation">
          <div className="hero__terminal">
            <div className="hero__terminal-back-layout" />
            <Editor />
          </div>
        </div>
      </div>
    </section>
  );
};
