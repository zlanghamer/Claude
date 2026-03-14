/**
 * my-hook — main entry point
 *
 * HOW TO USE THIS TEMPLATE
 * ------------------------
 * 1. Copy this whole folder (hook-template/) and rename it to your hook's name.
 *    Use lowercase letters and dashes, e.g. "lint-on-save" or "log-sessions".
 * 2. Open hook.json and fill in your name, description, and set the "triggers" field
 *    to the event you want to react to (see the list below).
 * 3. Write your code in the onTrigger() function below.
 * 4. When it works, move the folder to marketplace-submissions/ if you want to share it.
 *
 * WHAT IS A HOOK?
 * ---------------
 * A hook runs automatically when something happens — you don't call it yourself.
 * For example, a hook can run every time you save a file, or every time Claude Code starts.
 *
 * COMMON TRIGGERS (put one of these in hook.json "triggers" field)
 * ----------------------------------------------------------------
 *   on_file_save       — fires every time you save a file
 *   on_session_start   — fires when Claude Code opens
 *   on_session_end     — fires when Claude Code closes
 *   on_command_run     — fires after any Claude Code command finishes
 */

module.exports = {
  name: 'my-hook',
  version: '1.0.0',

  // This function runs automatically when the trigger event fires.
  // "event" contains details about what happened (e.g. which file was saved).
  onTrigger: function(event) {
    // Example: print the name of every file that gets saved
    const savedFile = event && event.filePath ? event.filePath : 'unknown';
    console.log(`[my-hook] File saved: ${savedFile}`);
  }
};
