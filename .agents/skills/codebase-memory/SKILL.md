---
name: codebase-memory
description: Tree-sitter AST knowledge graph and fast codebase navigation rules.
---

# Codebase Memory & Navigation

## Principles
1. **Never Guess Logic**: Inspect exact file paths and symbol definitions before modifying code.
2. **AST Memory Graph**: Trace call graphs and dependencies across modules.
3. **Targeted Refactoring**: Understand upstream/downstream callers before mutating shared utility methods.
