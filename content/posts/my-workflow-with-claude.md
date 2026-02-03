---
title: 'My Workflow With Claude'
date: '2026-01-31'
excerpt: 'How I work with Claude to develop applications.'
---

[Claude Code](https://docs.anthropic.com/en/docs/claude-code) is Anthropic's agentic coding tool. It runs in the terminal and can read files, write code, run commands, search the web, run multiple agents in parallel and more.

You describe what you want, and Claude figures out how to build it. This works fine for small tasks, but for anything substantial, I've found that using [Skills](https://code.claude.com/docs/en/skills) pays off. My workflow breaks development into three phases: planning, reviewing, and debugging.

### 1. Planning

I start by asking Claude to interview me about what I want to build. I have an `/interview-me` skill, located in my personal skills directory (~/.claude), that contains a comprehensive set of instructions for this process.

![Claude Code welcome screen](/writing/claude-code-welcome.png)

> **Note:** Skills located at `~/.claude` override project-level skills if they share the same name.

At the end of the interview, Claude generates a `spec.md` file and uses it to implement the feature.

### 2. Reviewing

Once the code changes are complete, I test the application. For personal projects, this involves manually testing the interface and making sure functionality matches my expectations.

For production apps with real users, I have Claude write tests to ensure the app handles edge cases gracefully. When I find issues I describe them to Claude in the same session. This creates a tight feedback loop: Claude sees the original spec, the implementation, and my observations, then proposes fixes with full context.

### 3. Debugging

Similar to the interview skill, I have a `/debug` skill I run when there are issues with the app. The skill identifies the issue, reproduces it, calls parallel research agents to investigate, fixes it, and then verifies the fix. It also updates a `debug.md` file with notes in case I encounter the same issue again.
