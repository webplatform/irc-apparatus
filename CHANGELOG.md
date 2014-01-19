# Changelog

#### 0.2.0
  - Add some utilities for control-codes and colors
  - Add basic connect/disconnect functionality (`start()`/`stop()`)
  - Add listeners
    - Manage them via `addListener`/`removeListener`
    - For available types see `lib/listener-types.js`
    - Callbacks get a normalized context object (source, target, text, channel, ...)
    - Callbacks can easily reply via the `context.reply*()` methods

#### 0.1.1
  - Change some build stuff, mostly coverage (now using istanbul instead of blanket)

#### 0.1.0
  - Add config system
    - This supports environment variables, process arguments, default values and custom values
    - Custom values can be provided as an object or path to a file
    - The custom values can be reloaded while running

#### 0.0.1
  - Now generated with generator-node-adv

#### 0.0.0
  - Initial project setup
