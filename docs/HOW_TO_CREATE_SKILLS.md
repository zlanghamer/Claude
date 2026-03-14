# How to Create a Skill

A skill teaches Claude new abilities. Instead of building a tool, you're teaching Claude to do something special.

## What is a Skill?

Skills add knowledge or new capabilities to Claude. Examples:
- Teach Claude your company's coding standards
- Give Claude knowledge about your specific industry
- Teach Claude a special way to solve a problem

## Quick Start: Copy-Paste Method

1. Go to `templates/skill-template/`
2. Copy the entire folder
3. Paste it into `skills/` folder
4. Rename it to your skill name
5. Edit the files
6. Done!

## File Structure

Each skill has three files:

| File | Purpose |
|------|---------|
| `skill.json` | Configuration file |
| `index.js` | The skill's code/content |
| `README.md` | How to use your skill |

## Creating Your Skill: Example

**What we're creating:** A skill that teaches Claude about your company's coding style.

**skill.json:**
```json
{
  "name": "company-coding-style",
  "version": "1.0.0",
  "description": "Teaches Claude our company's coding standards",
  "author": {
    "name": "Your Name",
    "email": "your.email@example.com"
  }
}
```

**index.js:**
```javascript
module.exports = {
  name: 'company-coding-style',
  version: '1.0.0',
  
  // The knowledge this skill provides
  styleGuide: {
    language: 'JavaScript',
    indent: '2 spaces',
    naming: 'camelCase',
    comments: 'Required for functions'
  }
};
```

**README.md:**
Explain what this skill teaches Claude.

## Before Submitting

- ✓ skill.json is complete
- ✓ Code is clear and well-organized
- ✓ README explains what the skill teaches
- ✓ You've tested that Claude uses it correctly

## Next Steps

1. Create and test your skill
2. When ready, move to `marketplace-submissions/`
3. Follow submission process: `marketplace/docs/PLUGIN_SUBMISSION.md`

## Questions?

Check: `marketplace/docs/PLUGIN_GUIDELINES.md`
