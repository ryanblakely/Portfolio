---
title: "My Workflow With Claude"
date: "2025-01-31"
excerpt: “How I work with Claude to develop applications.”
---


### 1. Planning

I start by asking Claude to interview me about what I want to build. I have an `/interview-me` skill, located in my personal skills directory (`~/.claude`) that contains a comprehensive set of instructions for this process.


![Claude Code welcome screen](/blog/claude-code-welcome.png)



> Note - skills located at `~/.claude` override project level skills if they share the same name. 

At the end of the interview, a spec.md file is generated and Claude will use this to actually implement the feature.

### 2. Reviewing

Once the code changes are complete, I test the application. If I’m just working on a personal project, this involves clicking around and making sure functionality matches my expectations. 

If it’s a production app with real users, I’ll have Claude write tests to make sure we handle all edge cases gracefully. 

### 3. Debugging

Much like the interview script, I have a /debug script I run when there are issues with the app. When this runs, it’ll identify the issue, reproduce it, call parallel research agents to investigate it, fix it, and then verify the fix. It’ll then update the `debug.md` skill file with notes in case we run into the same issue again.

```
# Debug Skill

A comprehensive, platform-agnostic debugging methodology for identifying and resolving software issues.

## When to Use

Invoke this skill when:
- Application crashes unexpectedly
- Features don't work as expected
- Runtime errors occur
- Performance issues arise
- Behavior differs from design

## Debugging Methodology

### Phase 1: Issue Identification

1. **Gather Symptoms**
   - What is the expected behavior?
   - What is the actual behavior?
   - When does it occur? (always, sometimes, specific conditions)
   - Any error messages or crash logs?
   
...
```


