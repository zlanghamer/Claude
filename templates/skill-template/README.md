# Skill Template

Use this as your starting point when building a new skill.

## How to get started

1. **Copy this folder** — duplicate `skill-template/` and rename it to your skill's name (e.g. `summarize-text`).
2. **Edit `skill.json`** — change the `name`, `description`, and your author details.
3. **Write your code in `index.js`** — the `activate()` function is where your skill does its work.
4. **Test it** — run it locally and make sure it does what you expect.
5. **Share it (optional)** — when it is ready, move the folder to `marketplace-submissions/`.

## Files in this template

| File | What it does |
|---|---|
| `skill.json` | Describes your skill (name, version, author, etc.) |
| `index.js` | The actual code that runs when the skill is called |
| `README.md` | This guide — replace it with your own description when you are ready |

## What is the difference between a skill and a plugin?

- **Skills** teach Claude Code one specific thing to do (like "summarise this file")
- **Plugins** add a whole new command or feature to Claude Code

Skills are simpler — start here if you are new.

## Need help?

See `docs/HOW_TO_CREATE_SKILLS.md` in the root of this repository for a full step-by-step guide.
