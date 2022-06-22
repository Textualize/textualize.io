---
# ⚠️This is not parsed by MDX, it's just a plain Markdown file with a FrontMatter header
# Also, HTML markup is left as-is, and with great power comes great responsibility.
title: "Hello World!"
---

#### lorem ipsum

At Textualize we love the terminal—and we're not alone.

<div class="callout">
What motivates us is the realisation that the terminal is a platform. Many developers and technical users live in the terminal for a large part of the day, and would happily do more with it.
</div>

Terminal software comes pre-installed on every Apple, Linux, and Windows desktop.

In a survey of 1025 developers, 89% reported having the terminal open more than half of the day.

<!-- end excerpt -->

As ubiquitous as terminals are, there has been surprisingly little innovation for terminal-based user interfaces. The applications developers use day-to-day rarely focus on aesthetics or even basic readability. This is why Will McGugan, our CEO / Founder, wrote the hugely popular Rich library for Python in 2020. It gave developers the tools to make beautiful command line apps and has since spawned a vibrant ecosystem and clones for other languages (1 2 3).

While Rich has made a generation of command line applications easier to work with, there is another class of application which we want to focus on. A TUI (Text User Interface) is an application that runs fullscreen within the terminal. Such applications pre-date the desktop and the web, but never went away.

29.95% of developers said they anticipate writing a TUI in the next 12 months.

Developers are building TUI applications to this day. And they are prepared to use awkward decades old APIs to do it. The end results integrate tightly with the terminal yet fall well short of what modern terminal software is capable of in terms of both visuals and user experience.
A New TUI

Our answer to this is Textual, an Open-source framework for building TUI applications with a minimal and modern Python API. Textual applications deploy a number of techniques to create a richer user experience than previous generations of TUIs, but remain as quick and responsive.

By lowering the barriers to building such applications and enhancing their appeal, Textual can become the de-facto solution for many interfaces needs.
Textual in Action

The following demonstrates a little of what is possible with a Textual TUI. Note the light / dark mode switch a few seconds in.
