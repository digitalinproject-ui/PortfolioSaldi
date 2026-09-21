---
name: codegraph
description: >-
  Semantic code intelligence and knowledge graph for code exploration, symbol search,
  caller/callee tracing, blast radius/impact analysis, and building surgical code context.
  Use this skill when exploring codebase structure, finding symbols, tracing references,
  or evaluating changes without reading entire files.
---

# CodeGraph Skill

CodeGraph provides instant semantic code intelligence and architecture graphs for the codebase.
The project is indexed locally in `.codegraph/` and automatically synchronized when files change.

## When to Use

- **Exploring Architecture & Flows**: When understanding how components connect or how data/events flow.
- **Finding Symbol References**: Tracing callers, callees, or dependencies across files.
- **Impact Analysis**: Checking what will break or need updates before modifying a function, component, or interface.
- **Surgical Context**: Getting exact source snippets and call paths in a single query rather than grep/reading multiple files.

## Core Commands & Workflows

Run these commands using `run_command` in the project root:

### 1. Explore an Area or Feature
Get relevant symbols, exact source code blocks, and call paths in one call:
```bash
codegraph explore "<query or component name>"
```
*Example:* `codegraph explore CharacterCanvas` or `codegraph explore "audio playback"`

### 2. Inspect a Symbol or File
Get the symbol's exact source with caller/callee trails, or read a file with line numbers and dependents:
```bash
codegraph node <symbol_or_path>
```
*Example:* `codegraph node TelemetryData` or `codegraph node src/components/AudioEngine.ts`

### 3. Build Task Context
Generate a focused context bundle containing related symbols, edges, and code blocks for a specific task:
```bash
codegraph context "<description of task>"
```
*Example:* `codegraph context "add sound toggle to navigation"`

### 4. Caller & Callee Tracing
Find all functions/methods calling or called by a symbol:
```bash
codegraph callers <symbol>
codegraph callees <symbol>
```
*Example:* `codegraph callers playEyeContact`

### 5. Impact / Blast Radius Analysis
Identify everything that depends on a symbol before making changes or refactoring:
```bash
codegraph impact <symbol>
```
*Example:* `codegraph impact audioEngine`

### 6. Status & Sync
Check index status or manually trigger a sync if needed:
```bash
codegraph status
codegraph sync
```

## Tips for Best Results
- Prefer `codegraph explore <symbol>` over brute-force file crawling when investigating unfamiliar code.
- Always check `codegraph impact <symbol>` before refactoring widely-used interfaces or core utilities.
- When MCP is active in Antigravity (after restart), you can also directly call the `codegraph_explore` and `codegraph_node` MCP tools.
