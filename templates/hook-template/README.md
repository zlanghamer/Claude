# Hook Template

Use this as your starting point when building a new hook.

## How to get started

1. **Copy this folder** — duplicate `hook-template/` and rename it to your hook's name (e.g. `lint-on-save`).
2. **Edit `hook.json`** — change the `name`, `description`, and set `triggers` to the event you want.
3. **Write your code in `index.js`** — the `onTrigger()` function runs automatically when the event fires.
4. **Test it** — run it locally and make sure it behaves as expected.
5. **Share it (optional)** — when it is ready, move the folder to `marketplace-submissions/`.

## Files in this template

| File | What it does |
|---|---|
| `hook.json` | Describes your hook and what event triggers it |
| `index.js` | The code that runs automatically when the trigger fires |
| `README.md` | This guide — replace it with your own description when you are ready |

## Available triggers

Put one of these in the `triggers` field of `hook.json`:

| Trigger | When it fires |
|---|---|
| `on_file_save` | Every time you save a file |
| `on_session_start` | When Claude Code opens |
| `on_session_end` | When Claude Code closes |
| `on_command_run` | After any Claude Code command finishes |

## Need help?

See `docs/HOW_TO_CREATE_HOOKS.md` in the root of this repository for a full step-by-step guide.
