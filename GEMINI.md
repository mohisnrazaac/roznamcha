# Roznamcha AI Guidelines & Codebase Memory Rules

## Mandatory Codebase Memory Usage

This repository has a persistent Knowledge Graph indexed in the `codebase-memory` MCP server under project name `roznamcha`.

Whenever searching, exploring, refactoring, or modifying code in this project, you MUST prioritize the `codebase-memory` MCP tools over generic text search (`grep_search` / `find_by_name`):

1. **Locating Symbols, Functions, Classes, and Routes**:
   - Use `search_graph(project="roznamcha", query="...")` for BM25 natural language search of functions, controllers, and models.
   - Use `search_graph(project="roznamcha", name_pattern=".*Name.*")` for exact symbol discovery.
   - Use `search_code(project="roznamcha", query="...")` for indexed code search.

2. **Tracing Call Chains & Dependencies**:
   - Use `trace_path(project="roznamcha", function_name="...", direction="both")` to trace call hierarchies across controllers, services, models, and jobs before making changes.

3. **Impact & Regression Analysis**:
   - Use `detect_changes(project="roznamcha")` to inspect the blast radius and determine which functions/modules are affected by local edits.

4. **Architecture & Schema**:
   - Use `get_architecture(project="roznamcha")` to understand system layers, clusters, and hotspots.
   - Use `query_graph(project="roznamcha", cypher="...")` for advanced relationship queries.

Only fall back to raw file reading (`view_file`) after locating the exact target symbols and line ranges via `codebase-memory`.
