/**
 * my-skill — main entry point
 *
 * HOW TO USE THIS TEMPLATE
 * ------------------------
 * 1. Copy this whole folder (skill-template/) and rename it to your skill's name.
 *    Use lowercase letters and dashes, e.g. "summarize-text" or "explain-code".
 * 2. Open skill.json and fill in your name and a description.
 * 3. Write your code in the activate() function below.
 * 4. When it works, move the folder to marketplace-submissions/ if you want to share it.
 *
 * WHAT IS A SKILL?
 * ----------------
 * A skill is simpler than a plugin. It teaches Claude Code one specific thing to do,
 * like "summarise this file" or "explain what this function does".
 * Skills are a great place to start if you are new to this.
 */

module.exports = {
  name: 'my-skill',
  version: '1.0.0',

  // This function runs when the skill is called.
  // "context" tells you about the current file and what the user selected.
  // Return a string — Claude Code will show it to the user.
  activate: function(context) {
    const fileName = context && context.currentFile ? context.currentFile : 'unknown file';
    console.log(`Skill activated for: ${fileName}`);
    return `Hello! You are working on: ${fileName}`;
  }
};
