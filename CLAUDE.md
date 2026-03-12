# Claude Code Global Rules

## Communication Style

1. **Keep explanations short** — No more than 4 sentences when explaining what was done or why.
2. **Summarize outputs** — Give a brief summary of results, not a full breakdown of every detail.
3. **Use plain language** — Avoid technical jargon. Write as if explaining to someone who is not a developer.
4. **Lead with the result** — Say what happened first, then explain only if needed.

## Model Usage by Project State

Use the appropriate model based on the current phase of the work:

| Phase | Model | Purpose |
|-------|-------|---------|
| **Planning / Orchestrating** | `claude-opus-4-6` | Breaking down tasks, designing architecture, creating implementation plans, coordinating agents |
| **Implementing** | `claude-sonnet-4-6` | Writing code, making edits, executing the plan |
| **Reviewing** | `claude-opus-4-6` | Reviewing Sonnet's output for correctness, quality, and completeness |

### Rules

1. **Plan with Opus** — When starting a task or designing a solution, use `claude-opus-4-6` to think through the approach and create the plan.
2. **Implement with Sonnet** — Once a plan exists, switch to `claude-sonnet-4-6` to carry out the implementation.
3. **Review with Opus** — After implementation is complete, switch back to `claude-opus-4-6` to review the work produced by Sonnet and verify it meets requirements.
4. **Model switching is mandatory** — Do not use a single model for all phases. Actively switch models as the project state changes.
