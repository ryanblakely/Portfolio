---
title: Learning tmux
date: 2026-02-09
excerpt: Notes to self as I learn tmux.
draft: false
---

## Start a tmux session

run `tmux` in a terminal

### Basics
- Sessions are independent tmux instances (like separate workspaces)
- Windows are tabs within a session (like browser tabs)
- Panes are splits within a window



---



## Practice


### Exercise 1: Sessions & Windows

```
tmux new -s practice
```

1. Rename the window: `prefix + ,` → type `main` → Enter
2. Create 3 more windows: `prefix + c` three times
3. Rename each one: `prefix + ,` → name them `editor`, `tests`, `logs`
4. Jump around: `prefix + 1`, `prefix + 3`, `prefix + 2`
5. Use the picker: `prefix + w` — navigate with j/k, Enter to select
6. Kill a window: go to `logs` (`prefix + 4`), type `exit`
7. Notice the status bar at the bottom updates in real time

### Exercise 2: Panes

From your `editor` window:
1. Split vertically: `prefix + |` (side-by-side)
2. Split the right pane horizontally: `prefix + -` (top/bottom)
3. Move between panes: `prefix + arrow keys` (try all four)
4. Zoom one pane: `prefix + z` — goes fullscreen. Press again to unzoom
5. Close a pane: `prefix + x` → confirm with `y`
6. Try the shell aliases: `th` for a horizontal split, `tv` for vertical

### Exercise 3: Copy Mode

1. Run something with lots of output: `ls -la /usr`
2. Enter copy mode: `prefix + [`
3. Scroll up: `k` or up-arrow (mousewheel also works)
4. Search: type `/` then a word, press Enter. Use `n` for next match
5. Select text: navigate to a word, press Space, move to highlight, press Enter
6. Paste it: `prefix + ]`
7. Exit copy mode without copying: press `q`

### Exercise 4: Session Management

1. Detach: `prefix + d` (back to regular terminal)
2. List sessions: `tmux ls`
3. Create a second session: `tmux new -s project2`
4. Switch sessions: `prefix + s` — pick `practice` from the list
5. Save your layout: `prefix + Ctrl-s` (resurrect saves it)
6. Reattach from outside: detach first (`prefix + d`), then `tmux attach -t practice`

### The Drill

Repeat this sequence until it feels natural:

```
prefix + c          → new window
prefix + ,          → rename it
prefix + |          → split it
prefix + arrow      → switch pane
prefix + z          → zoom
prefix + z          → unzoom
prefix + x → y      → close pane
prefix + w          → overview
```
