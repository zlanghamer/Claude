# Quick Start Guide

Get up and running in 5 minutes!

## The Simplest Way to Create Something

### Step 1: Choose What to Create

- **Plugin** = A mini-tool you build
- **Skill** = Something you teach Claude
- **Hook** = Code that runs automatically

### Step 2: Copy a Template

Find the right template:
- Plugin? → Copy `templates/plugin-template/`
- Skill? → Copy `templates/skill-template/`
- Hook? → Copy `templates/hook-template/`

Paste it into:
- Plugin? → Into `plugins/` folder
- Skill? → Into `skills/` folder
- Hook? → Into `hooks/` folder

Rename the folder to your project name.

### Step 3: Edit Three Files

Every project has three files. Edit them:

**File 1: The Config File**
- Open `plugin.json` (or `skill.json` or `hook.json`)
- Change the "name" to match your folder name
- Update description
- Update author info

**File 2: The Code File**
- Open `index.js`
- Write your code here
- Replace the example code

**File 3: The Instructions**
- Open `README.md`
- Explain what you created
- Explain how to use it

### Step 4: Test It

Make sure it works!

### Step 5: When You're Ready

Move it to `marketplace-submissions/` for submission.

---

## Example: Creating "My Formatter" Plugin

```
1. Copy: templates/plugin-template/
2. Paste to: plugins/
3. Rename folder: plugins/my-formatter/

4. Edit plugins/my-formatter/plugin.json
   Change "my-plugin" to "my-formatter"

5. Edit plugins/my-formatter/index.js
   Add your formatting code

6. Edit plugins/my-formatter/README.md
   Explain what it does

7. Test it works

8. When ready:
   Move to marketplace-submissions/
```

---

## Need More Details?

- **Creating Plugins?** → Read `docs/HOW_TO_CREATE_PLUGINS.md`
- **Creating Skills?** → Read `docs/HOW_TO_CREATE_SKILLS.md`
- **Creating Hooks?** → Read `docs/HOW_TO_CREATE_HOOKS.md`
- **Submitting?** → Read `marketplace/docs/PLUGIN_SUBMISSION.md`
- **Questions?** → Read `marketplace/docs/PLUGIN_GUIDELINES.md`

---

## Templates Are Your Friend

The templates have everything you need:
- Correct file format
- Example structure
- Helpful comments

Just copy, rename, and edit!

**You've got this! 🎉**
