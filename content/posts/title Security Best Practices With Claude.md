---
title: Learning tmux
date: 2026-02-09
excerpt: Notes to self as I learning tmux.
draft: false
---

## Start a tmux session

run `tmux` in a terminal

## How to set up shortcuts to quickly launch split panes

### Tmux split aliases

Add these to your `~/.zshrc`
```
  alias th='tmux split-window -h'
  alias tv='tmux split-window -v'
  alias tx='tmux kill-pane'
```

Then reload your shell: `source ~/.zshrc`

### What they do

th - Split the current pane horizontally (new pane appears to the right)
tv - Split the current pane vertically (new pane appears below)
tx - Close the current pane


### Misc
- Sessions are independent tmux instances (like separate workspaces)
- Windows are tabs within a session (like browser tabs)
- Panes are splits within a window


❯ the list seems to be constantly growing

⏺ That likely means you're creating new windows without closing old ones. A few ways to clean up:

  - From the list itself: highlight an unwanted window in prefix + w and press x to kill it
  - From within a window: type exit or press ctrl+d to close the shell
  - Kill by number: prefix + & kills the current window

  To avoid buildup, get in the habit of closing windows you're done with rather than just detaching or switching away.

### Hand’s On Practice

⏺ Here are exercises to build muscle memory. Do these in order — each builds on the last.

  Exercise 1: Sessions & Windows

  # In your terminal, create a session
  tmux new -s practice

  Now try:
  1. Rename the window: prefix + , → type main → Enter
  2. Create 3 more windows: prefix + c three times
  3. Rename each one: prefix + , → name them editor, tests, logs
  4. Jump around: prefix + 1, prefix + 3, prefix + 2
  5. Use the picker: prefix + w — navigate with j/k, Enter to select
  6. Kill a window: go to logs (prefix + 4), type exit
  7. Notice the status bar at the bottom updates in real time

  Exercise 2: Panes

  From your editor window:
  1. Split vertically: prefix + | (side-by-side)
  2. Split the right pane horizontally: prefix + - (top/bottom)
  3. Move between panes: prefix + arrow keys (try all four)
  4. Zoom one pane: prefix + z — notice it goes fullscreen. Press prefix + z again to unzoom
  5. Close a pane: prefix + x → confirm with y
  6. Try the shell aliases: type th for a horizontal split, tv for vertical

  Exercise 3: Copy Mode

  1. Run something with lots of output: ls -la /usr
  2. Enter copy mode: prefix + [
  3. Scroll up: k or up-arrow (also try mousewheel — it works)
  4. Search: type / then a word you see, press Enter. Use n for next match
  5. Select text: navigate to a word, press Space, move to highlight, press Enter
  6. Paste it: prefix + ]
  7. Exit copy mode without copying: press q

  Exercise 4: Session Management

  1. Detach: prefix + d (you're back in your regular terminal)
  2. List sessions: tmux ls
  3. Create a second session: tmux new -s project2
  4. Switch sessions: prefix + s — pick practice from the list
  5. Save your layout: prefix + Ctrl-s (resurrect saves it)
  6. Reattach from outside: detach first (prefix + d), then tmux attach -t practice

  The Drill

  Once you've done all four, repeat this sequence 3 times until it feels natural:

  prefix + c          → new window
  prefix + ,          → rename it
  prefix + |          → split it
  prefix + arrow      → switch pane
  prefix + z          → zoom
  prefix + z          → unzoom
  prefix + x → y      → close pane
  prefix + w          → overview

  That covers about 90% of daily tmux usage. Want to go deeper on any of these?
