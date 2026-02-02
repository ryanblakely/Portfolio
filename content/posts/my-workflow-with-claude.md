---
title: "My Workflow With Claude"
date: "2025-01-31"
excerpt: “How I work with Claude to develop applications.”
---


### 1. Planning

For feature work, I start by having Claude interview me in-depth about what to build.

I have an /interview-me skill located in my personal skills directory (~/.claude). Skills located at `~/.claude` override project level skills if they share the same name.

![Claude Code welcome screen](/blog/claude-code-welcome.png)



Note - if skills located at `~/.claude` override project level skills if they share the same name. 

This launches an interview where Claude asks me a series of questions.

### 2. Reviewing

After Claude builds, I test the application. If I’m just working on a personal project this involves clicking around and making sure functionality matches expectations. If this is a production application with real users, I’ll have Claude write tests to validate proper edge case handling.

### 3. Debugging

Similar to the interview script, I have a debug script I run that adds logging, using sub agents to research the current implementation and scour the web for info.

Sometimes the issue is still not resolved. Last resort I tell Claude to run the build itself and review the logs and don’t stop until the fix is applied.

The key is to define a clear loop for Claude to iterate and verify the test is fixed. Once a fix has been applied, I tell Claude knowing what it knows now implement an elegant solution.

If I’m using Claude in the cli and am still unable to resolve the issue, sometimes I’ll swith to Claude Code in the desktop app. Sometimes this app is better able to handle complex issues at once.





1. I start by
switch between claude code cli / claude desktop / conductor
native terminal, vscode with terminal on right
start with planning
create claude md file
add skills for things i do frequently
claude desktop seems to better handle multi step longer running tasks, auto deploy sub agents

future:
space repitition learning skill
append subagents to any request to use more compute on the problem (cli, desktop does this natively)


