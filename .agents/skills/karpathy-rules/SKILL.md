---
name: karpathy-rules
description: The Karpathy Coding Rules for AI-assisted engineering. Enforces surgical edits, simplicity first, thinking before coding, and goal-driven verification.
---

# The Karpathy Coding Rules

Apply these 4 mandatory guardrails during all code generation and refactoring:

1. **Think Before Coding**: Don't make assumptions. Ask clarifying questions or inspect exact files before mutating logic.
2. **Simplicity First**: Do not overengineer. Build the simplest working implementation that meets requirements.
3. **Surgical Changes**: Only touch the exact lines needed to implement the feature or fix the bug. Do not reformat or churn unrelated code.
4. **Goal-Driven**: Write verifiable success criteria or test assertions first before declaring completion.
