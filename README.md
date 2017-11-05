# Show Pages #

Show web pages in a rotating display.

Version 0.1.0

## Usage ##

Create a new ShowPages object with an array of urls and a map of any options and run it:

    new ShowPages(urls, options).run();

### Options ***
* `interval` - The interval between displaying pages in milliseconds (default `3000`).
* `transition` - The type of transition between pages (default `crossfade`).
* `duration` - The duration of any transition effects in milliseconds (default `1000`).
