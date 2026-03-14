/**
 * my-plugin — main entry point
 *
 * HOW TO USE THIS TEMPLATE
 * ------------------------
 * 1. Copy this whole folder (plugin-template/) and rename it to your plugin's name.
 *    Use lowercase letters and dashes, e.g. "word-counter" or "spell-checker".
 * 2. Open plugin.json and fill in your name, a description, and change the "name" field.
 * 3. Write your code in the execute() function below.
 * 4. When it works, move the folder to marketplace-submissions/ if you want to share it.
 *
 * WHAT IS A PLUGIN?
 * -----------------
 * A plugin adds a new command or feature to Claude Code. For example,
 * a plugin could count words, convert file formats, or connect to an API.
 */

module.exports = {
  name: 'my-plugin',
  version: '1.0.0',

  // This function runs when someone uses your plugin.
  // Replace the example inside with your own code.
  execute: function(input) {
    // Example: count the words in whatever text is passed in
    const wordCount = input && input.text ? input.text.split(/\s+/).length : 0;
    console.log(`Word count: ${wordCount}`);
    return { result: `Word count: ${wordCount}` };
  }
};
