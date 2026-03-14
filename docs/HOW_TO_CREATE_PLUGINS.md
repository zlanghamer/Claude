# How to Create a Plugin

A plugin is a small tool you build that does a specific job in Claude Code. Think of it like a helper program.

## What is a Plugin?

A plugin adds new features or commands to Claude Code. Examples:
- A code formatter (cleans up your code)
- A file organizer (automatically sorts files)
- A documentation helper (generates docs automatically)

## Quick Start: Copy-Paste Method

The easiest way to create a plugin:

1. Go to the `templates/plugin-template/` folder
2. Copy the entire folder
3. Paste it into the `plugins/` folder
4. Rename it to your plugin name
5. Edit the files inside
6. Done!

### Step-by-Step Example

**Step 1: Copy the template**
```
Copy: templates/plugin-template/
Paste to: plugins/
Rename to: plugins/my-formatter/
```

**Step 2: Edit plugin.json**
```json
{
  "name": "my-formatter",
  "version": "1.0.0",
  "description": "Formats code in my special way",
  "author": {
    "name": "Your Name",
    "email": "your.email@example.com"
  }
}
```

**Step 3: Edit index.js**
Add your plugin's code here.

**Step 4: Edit README.md**
Explain what your plugin does.

## File Structure

Each plugin has three files:

| File | Purpose |
|------|---------|
| `plugin.json` | Configuration - tells Claude about your plugin |
| `index.js` | The actual code that does the work |
| `README.md` | Instructions for using your plugin |

## Testing Your Plugin

Before submitting, make sure:
- ✓ Files are in the right format
- ✓ Your code works correctly
- ✓ README explains how to use it
- ✓ plugin.json has all required information

## Next Steps

1. Create your plugin using the template
2. Test it to make sure it works
3. When ready, move it to `marketplace-submissions/`
4. Follow the submission process in `marketplace/docs/PLUGIN_SUBMISSION.md`

## Need Help?

- Check the example in `templates/plugin-template/`
- Read the marketplace guidelines: `marketplace/docs/PLUGIN_GUIDELINES.md`
- Contact: support@example.com
