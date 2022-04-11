import React from "react";
import { Footer } from "../src/components/footer";
import { Hero } from "../src/components/hero";
import { Icons } from "../src/components/icons";
import { MailList } from "../src/components/mail-list";
import { Nav } from "../src/components/nav";
import { Projects } from "../src/components/projects";

export default function Home() {
  return (
    <>
      <Icons />
      <Nav />
      <main>
        <Hero />
        <MailList />
        <Projects />
      </main>
      <Footer />
    </>
  );
}
