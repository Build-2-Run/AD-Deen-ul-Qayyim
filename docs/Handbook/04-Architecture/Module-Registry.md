# ADQ Architecture
# Module Registry v1.0

## Purpose
The Module Registry architecture decouples application routing and navigation logic from static component trees. It serves as the single source of truth for features.

## Core Features
1. **Routing Automation**: Translates registered `AppModule` objects into React Router paths.
2. **Dynamic UI Generation**: Sidebar navigation and Knowledge Gateway grids read directly from the registry.
3. **Feature Flags**: Supports boolean `enabled` fields allowing seamless module toggling in production without code deletion.
4. **Plugin Foundation**: In the future, third-party code (or community-submitted modules) can simply push to `ModuleRegistry.register()` to appear in the app.
