# How to Create a Hook

A hook is code that runs automatically when something happens. You don't need to call it - it just works!

## What is a Hook?

Hooks are automatic triggers. When a specific event happens, the hook's code runs. Examples:
- Check code for errors every time you save a file
- Auto-format code when you paste it
- Notify you when a task is completed

## Quick Start: Copy-Paste Method

1. Go to `templates/hook-template/`
2. Copy the folder
3. Paste into `hooks/`
4. Rename to your hook name
5. Edit the files
6. Done!

## File Structure

Each hook has three files:

| File | Purpose |
|------|---------|
| `hook.json` | Configuration and event setup |
| `index.js` | Code that runs when triggered |
| `README.md` | Instructions |

## Example: Auto-Checker Hook

**What it does:** Checks your code every time you save a file.

**hook.json:**
```json
{
  "name": "auto-checker",
  "version": "1.0.0",
  "description": "Automatically checks code when you save",
  "triggers": ["file-save"]
}
```

**index.js:**
```javascript
module.exports = {
  name: 'auto-checker',
  version: '1.0.0',
  
  // This runs when the file-save event happens
  onTrigger: function(event) {
    console.log('Checking code...');
    // Your checking code here
  }
};
```

**README.md:**
Explain what happens automatically and when.

## How Hooks Work

1. **Define the trigger** - What event should activate the hook?
   - `file-save` - When you save a file
   - `command-run` - When you run a command
   - `project-open` - When you open a project

2. **Write the code** - What should happen?
   - What does the hook do?
   - Does it change files?
   - Does it notify you?

3. **Test it** - Make sure it runs correctly

## Before Submitting

- ✓ hook.json has correct triggers
- ✓ Code is tested and works
- ✓ README explains what happens automatically
- ✓ User understands what the hook does

## Next Steps

1. Create and test your hook
2. When ready, move to `marketplace-submissions/`
3. Follow submission process: `marketplace/docs/PLUGIN_SUBMISSION.md`

## Questions?

Check: `marketplace/docs/PLUGIN_GUIDELINES.md`
