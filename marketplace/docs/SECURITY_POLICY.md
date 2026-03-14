# Security Policy

## Supported Versions

The marketplace registry and tooling in this repository follow a rolling release model. Only the latest version on the `main` branch is actively maintained.

| Component | Supported |
|---|---|
| `main` branch | Yes |
| Previous releases | Security fixes only (6-month window) |

---

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Report security issues by emailing [security@anthropic.com](mailto:security@anthropic.com). Include:

1. A clear description of the vulnerability.
2. Steps to reproduce (proof-of-concept code is welcome).
3. The potential impact and affected components.
4. Your suggested fix, if you have one.

You will receive an acknowledgement within **48 hours** and a status update within **7 business days**.

Anthropic follows responsible disclosure. We ask that you:

- Allow us 90 days to investigate and patch before public disclosure.
- Avoid accessing or modifying user data during research.
- Not perform denial-of-service testing.

We do not currently offer a bug bounty for this repository, but we publicly credit researchers who report valid vulnerabilities (unless they prefer to remain anonymous).

---

## Security Requirements for Plugins

All plugins listed in the marketplace must adhere to the following security requirements. Failure to comply will result in removal from the marketplace.

### 1. No Hardcoded Secrets

Plugins must never commit API keys, tokens, passwords, or other credentials to their repository. Use environment variables or Claude Code's built-in configuration system for sensitive values.

### 2. Principle of Least Privilege

Declare only the capabilities your plugin actually uses. Unused capabilities will be flagged during review and must be removed.

### 3. Input Validation

All user-supplied input — including file paths, configuration values, and command arguments — must be validated and sanitised before use. Path traversal attacks (e.g. `../../etc/passwd`) must be explicitly prevented.

### 4. Network Security

- All network requests must use `https`. Plain `http` is not permitted.
- Document every external endpoint your plugin contacts in your `README.md`.
- Do not proxy or forward user data to undisclosed third parties.
- Implement request timeouts; do not allow indefinitely hanging connections.

### 5. Shell Execution

Plugins requesting the `shell` capability are subject to mandatory elevated security review. Requirements:

- Never construct shell commands by concatenating unsanitised user input.
- Use argument arrays (not shell strings) where the runtime supports it.
- Restrict the working directory to the user's project root.
- Document every shell command your plugin can execute.

### 6. File System Access

- `file-read`: Restrict access to the user's project directory unless broader access is explicitly required and documented.
- `file-write`: Never overwrite files outside the project directory without explicit user confirmation.
- Do not follow symbolic links outside of the allowed paths.

### 7. Dependency Security

- Keep dependencies up to date. Plugins with known high-severity CVEs in their dependency tree will be suspended until patched.
- Audit your dependencies with `npm audit` (or equivalent) before submission.
- Do not use abandoned or unmaintained dependencies.

### 8. Data Privacy

- Do not collect telemetry or analytics without explicit, informed user consent.
- If you do collect data, provide a clear privacy policy URL in `plugin.json` (`homepage` or a dedicated `privacy_policy` field).
- Do not transmit the user's code, file contents, or personal information to external servers without consent.

### 9. Code Integrity

- All published versions must correspond to a tagged commit in the canonical repository.
- Publish a checksum (SHA-256) for each release archive if distributing binary assets.

---

## Elevated Security Review

Plugins requesting `shell` or `network` capabilities trigger an elevated security review. During this review, an Anthropic security engineer will:

1. Audit all network call sites and verify they use `https` and connect only to documented endpoints.
2. Review all shell invocations for injection vulnerabilities.
3. Verify that capability declarations in `plugin.json` exactly match actual usage.
4. Check for dependency vulnerabilities using automated scanning.

Elevated reviews may add up to 5 business days to the standard review SLA.

---

## Plugin Suspension and Removal

Anthropic reserves the right to immediately suspend or remove any plugin that:

- Contains malicious code.
- Has a critical or high-severity vulnerability that has not been patched within 30 days of notification.
- Violates the data privacy requirements above.
- Misrepresents its capabilities or behaviour.

Plugin authors will be notified by email before removal (except in cases of active malicious activity).

---

## Security Audits

The marketplace tooling and schema files in this repository are subject to periodic security audits by the Anthropic security team. Audit reports are summarised and published to [security@anthropic.com](mailto:security@anthropic.com) subscribers.
