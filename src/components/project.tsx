import React from "react";
import { Editor } from "./editor";

interface Props {
  headline: string;
  stars: string;
  desc: string;
  tabName: string;
  nth: number;
}

export const Project = (props: Props) => {
  const { headline, stars, desc, tabName, nth } = props;

  return (
    <section className="container project">
      <div className="project__editor-wrapper">
        <div className="project__editor-back-layout-wrapper">
          <div className={"project__back-layout project__back-layout-" + nth} />
          <Editor tabName={tabName} />
        </div>
      </div>
      <div className="project__text-wrapper">
        <div className="project__head">
          <h3 className="project__headline">{headline}</h3>
          <div className="badge">
            <svg height="1em" width="1em" className="badge__icon">
              <use xlinkHref="#icon-start" />
            </svg>
            <span className="badge__label">{stars}</span>
          </div>
        </div>
        <p className="project__desc">{desc}</p>
        <div className="project__btns">
          <a href="#" className="button button--lilac u-fx-no-shrink">
            <svg height="1em" width="1em">
              <use xlinkHref="#icon-github" />
            </svg>
            Code
          </a>
          <a href="#" className="button button--blue u-fx-no-shrink">
            <svg height="1em" width="1em">
              <use xlinkHref="#icon-doc" />
            </svg>
            Docs
          </a>
        </div>
      </div>
    </section>
  );
};
