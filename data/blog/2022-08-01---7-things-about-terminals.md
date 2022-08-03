---
title: "7 things I've learned building a modern TUI framework"
---

I've be working on [Textual](https://github.com/Textualize/textual) for over a year now. Here's a few things I've discovered (or re-discovered) regarding working with terminals in Python, and software development in general.

&mdash; Will McGugan (CEO / Founder) [@willmcgugan](https://twitter.com/willmcgugan)

### Terminals are fast

A modern terminal emulator is a remarkably sophisticated piece of software. The protocol they run may be [ancient](https://en.wikipedia.org/wiki/Teleprinter), but many are powered by the same graphics technologies used in video games. Despite this, smooth animation is _not_ a given in the terminal. If you have ever tried any kind of visual effects in a terminal you may have been disappointed with flickering or _tearing_.

But it is possible to achieve smooth animation as you can see from the following screencast. So what trick(s) are we pulling?

<div style="text-align:center; margin: 1em 0;">
    <iframe width="560" height="364" style="margin: 20px;" src="https://www.youtube.com/embed/k5m3CQT9yDM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

There are a few factors which reduce flicker in the terminal. The first is the terminal emulator that you are using. Modern terminals use hardware-accelerated rendering and will synchronize updates with your display to reduce flicker. Although in my experience there are other factors which have a greater impact on reducing flicker than your choice of emulator. Even on older terminals, you can generally get flicker-free animation with this _one little trick_ (actually three).

The first _trick_ is "overwrite, don't clear". If you clear the "screen" and then add new content, you risk seeing a blank or partially blank frame for a brief moment. It's far better to overwrite the content in the terminal entirely so that there is no intermediate blank frame.

The second _trick_ would be to write new content in a single write to standard output. It may be convenient to make multiple `file.write` calls to display an update, but as with the blank frame you risk a partial update becoming visible.

The third _trick_ would be to use the [Synchronized Output](https://gist.github.com/christianparpart/d8a62cc1ab659194337d73e399004036) protocol; a relatively new addition to the terminal protocol, but already supported by many terminals. Details in the link, but the gist is that you tell the terminal when you begin and end a frame. It can then use this information to deliver flicker free updates.

With these three tricks in place you can create very smooth animation as long as you can deliver updates at regular intervals. Textual uses 60fps as a baseline. Any more than that probably isn't going to be noticeable.

Now that you _can_ have smooth animation in the terminal, the question becomes _should_ you? Not all animation is perceived in the same way. Some animation can be seen as gratuitous. For instance the sidebar in the screencast that slides in from the left of the screen. I think it's nifty, but it doesn't add anything to the user experience. Animation haters will probably cite that as a "do not want", which is why Textual will have a mechanism to disable such animations. Other types of animation are more than eye-candy. Smooth scrolling is an animation which I find particularly helpful in keeping my place within a wall of text. All animations lie somewhere between helpful and gratuitous, and I doubt there will be many people who want no animation at all.

### DictViews are amazing

You are probably familiar with the `keys()` and `items()` methods on Python dicts which return a `KeysView` and `ItemsView` respectively. You _may_ not know that these objects have much the same interfaces as sets. A fact recovered from my swiss cheese brain _after_ I needlessly wrote a dozen or so complex lines of code

In Textual the layout process creates a "render map". Basically a mapping of the Widget on to it's location on the screen. In an earlier version, Textual would do a wasteful refresh of the entire screen if even a single widget changed position. I wanted to avoid that by comparing the _before_ and _after_ render map.

I discovered that I could take the symmetric difference of two ItemsView objects, which gave me the items which were either a) new, or b) had changed. Precisely what I needed, but done at the C level. In Textual this is used to get the modified regions of the screen when a CSS property changes, so we can make optimized updates.

For those who prefer to see the code, the following gist demonstrates the technique.

<script src="https://gist.github.com/willmcgugan/61993ecf362a298bebfae10f49dea906.js"></script>

### lru_cache is fast

Perhaps not surprising given that `lru_cache` is literally designed to speed up your code, but `@lru_cache` is _fast_. I was surprised how fast it was.

If you aren't familiar with `lru_cache` it is a decorator which you will find in the `functools` module in the standard library. Add it to a method and it will cache the return value of a function. If you set the `maxsize` parameter it will ensure your cache doesn't grow indefinitely.

I was looking in to [the implementation](https://github.com/python/cpython/blob/main/Lib/functools.py#L566) of lru_cache in the CPython repos and I figured I could beat it. Spoiler: I couldn't. It turns out there was a [C version](https://github.com/python/cpython/blob/main/Modules/_functoolsmodule.c#L992) which makes it very fast for both cache hits and cache misses.

Knowing it is that fast convinced me to lower the barrier to use `@lru_cache`. There are a number of small functions in Textual, that are not exactly slow, but called a large number of times. Many of them were highly cacheable and judicious use of `@lru_cache` provided a significant win. Typically a `maxsize` of around 1000-4000 was enough to ensure that the majority calls were cache hits.

Here's an example of the kind of function that benefited from caching. This method combines two rectangular regions in to a single region that fits both. You can see it doesn't do a great deal of work, but it was called 1000s of times.

<script src="https://gist.github.com/willmcgugan/8d161a6b1104aa2b79b6656893d4055d.js"></script>

A word of advice when using `lru_cache`: always check your assumptions by inspecting the `cache_info()`. For effective caching you should expect to see `hits` growing faster than `misses`.

### Immutable is best

Following on from the previous tip, I'd like to sing the praises of immutable objects. Python doesn't have true immutable objects, but you can get much of the benefits from tuples, NamedTuples, or frozen dataclasses.

It _seems_ like an arbitrary limitation that you can't change an object, but it rarely is in practice. Computer scientists will point out that many languages are immutable by default, and for good reason.

In Textual, the code that uses immutable objects is the easiest to reason about, easiest to cache, and easiest to test. Mainly because you can write code that is free of side-effects. Something that is difficult to do when you pass class instances in to a function.

### Unicode art is good

Some technical things are hard to explain in words, and a diagram created from unicode box characters can be massively beneficial in documentation. This diagram is taken from a docstring in Textual for a method that splits a region in to four sub-regions:

```
           cut_x ↓
        ┌────────┐ ┌───┐
        │        │ │   │
        │    0   │ │ 1 │
        │        │ │   │
cut_y → └────────┘ └───┘
        ┌────────┐ ┌───┐
        │    2   │ │ 3 │
        └────────┘ └───┘
```

It's no substitute for a well written docstring, but in combination it is super helpful. I'd encourage you to add diagrams to docstrings wherever it makes sense.

I use [monodraw](https://monodraw.helftone.com/) for these diagrams. Monodraw is MacOS only unfortunately, but there are no doubt good alternatives for other platforms.

### Fractions are accurate

Python has a `fractions` module in the standard library which goes all the way back to Python26. Until recently I had never found a use for `fractions` in my code. I figured it was intended for mathematicians and not of much use for humble code monkeys like myself. I was wrong. It was a real life saver for Textual.

A Fraction is essentially an alternative way of representing a number, and once you have a Fraction object you can use it in place of floats. So what is the benefit of using Fractions over floats?

You probably know that floating point numbers have certain limitations. A problem not unique to Python. Here's a classic example that illustrates the problem:

```
>>> 0.1 + 0.1 + 0.1 == 0.3
False
```

In Textual, these floating point rounding errors were problematic. Some layouts required dividing the screen based on varying proportions. For instance, there might be a panel that is a third of the width of the screen, and the remaining two thirds are further divided. Rounding error would creep in and there would sometimes be a single character gap where there should be content.

A really easy solution to this was to replace floats with fractions. Fractions don't suffer from this kind of rounding error in the way that floats do. You can see that three tenths add up to three tenths in the Fraction world:

```
>>> from fractions import Fraction as F
>>> F(1, 10) + F(1, 10) + F(1, 10) == F(3, 10)
True
```

Here's an example which splits a fixed number of characters in to several parts. The two functions do pretty much the same thing, but one uses floats and the other uses Fractions

<script src="https://gist.github.com/willmcgugan/11fd2f0b6e88168d1c7247621a7344ee.js"></script>

Here's the output from the above code. Note how the float version (first row of numbers) is a character short:

```
------------------------
00011122223334444555666
000111222233344445556666
```

### Emojis are terrible

Emoji support in terminals has been an ongoing problem in [Rich](https://github.com/Textualize/rich) since almost it's conception, and we have inherited that problem working on Textual. It was top of my list of problems to solve when Textualize was founded in January. We had big plans, but the more we looked in to this issue, the worse it got.

So what's the deal with emojis? It boils down to the issue that when you write a character to the terminal it may be one of two sizes (technically 3 since some characters are zero width). Chinese, Japanese, and Korean characters take up twice the space as Western alphabet, which presents a problem if we do any formatting such as centering or drawing a box around text. Such basic formatting requires that Rich knows how much space a given piece of text will take up in the terminal. Supporting double width characters means you can no longer use `len(text)` to find its in-terminal width.

Fortunately the Unicode database contains a mapping of which characters are single width and which are double. Rich (and Textual) will look up this database for _every character_ it prints. Its not a cheap operation, but with a bit of engineering effort and caching (see lru_cache) it is fast enough.

Emoji also exist in the Unicode database, so problem solved? I wish. While Asian characters don't change much, emoji do. Every new release of the Unicode database sees a new batch of emojis. If you print these newer emoji in the terminal the results can be unpredictable. You may get a single or double width character, and it might not even render correctly.

We considered shipping Rich with information from every unicode release, which presents another problem: how do we detect what version of unicode a given terminal emulator is using? Well there doesn't seem to be a reliable way of doing that. There is no standard env var. There is a heuristic where you write various sequences and ask the terminal for the cursor position, which should make an educated guess as the Unicode version. Unfortunately from testing we've discovered that terminals still render emoji unpredictably even if you think you know the Unicode database used.

If thats not bad enough, let me introduce you to _multi-codepoint_ emojis. A codepoint is the reference number for a given unicode glyph (character image). In Python you can look this up with `ord`. For instance `ord("A")` returns the codepoint 65 representing a capital A. You can be forgiven for assuming that this is true for every character, but it is not. Many emojis combine several codepoints to produce a single glyph. For instance 👨🏻‍🦰 (man, light skin tone, red hair, i.e. me) consists of 4 code points. Try copying that in to the Python REPL.

Not all terminal emulators render these characters correctly. In some terminals they render as 4 individual characters, or 2 characters, or 1 character, single or double width, or sometimes 4 "?" characters. Even if you implement the code to understand these multi-codepoint characters, you're left with the fundamental problem that you can't tell what the output will really be in a given terminal.

It's a mess for sure, but in practice it's not that bad. Sticking to the emoji in version 9 of the Unicode database seems to be reliable across all the platforms. You might want to avoid using newer emoji and multi-codepoint characters even if they look okay on your terminal emulator.

### Textualize is hiring

Help us build a TUI framework that will eat some of the browser's lunch.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">I&#39;m hiring for Textualize again. We&#39;re looking for <a href="https://twitter.com/hashtag/Python?src=hash&amp;ref_src=twsrc%5Etfw">#Python</a> developer(s) to join us.<br><br>🐍 Very strong (technical) Python skills <br>🥇Web experience<br>🥈Experience with at least one other language<br>🥉Good API design skills<br><br>Retweets appreciated!</p>&mdash; Will McGugan (@willmcgugan) <a href="https://twitter.com/willmcgugan/status/1547521362260115456?ref_src=twsrc%5Etfw">July 14, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
