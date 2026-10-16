---
name: browser-use
description: >-
  Direct browser control via CDP (Chrome DevTools Protocol) for web interaction:
  automation, scraping, testing, and real-time visual inspection. Use when the
  user needs precise, low-level browser control, wants to intercept network
  requests, debug JavaScript, profile performance, audit accessibility, or
  run Lighthouse reports. Prefer this over agent-browser for advanced DevTools
  workflows.
---

# Browser-Use Skill

This skill provides direct access to Chrome DevTools Protocol (CDP) features for
advanced browser control. It covers everything from basic navigation to deep
performance profiling, accessibility auditing, and network interception.

---

## Core CDP Capabilities

| Category | Tools |
|----------|-------|
| Navigation | `navigate_page`, `new_page`, `close_page`, `list_pages`, `select_page` |
| Interaction | `click`, `type_text`, `fill`, `fill_form`, `hover`, `drag`, `press_key` |
| Capture | `take_screenshot`, `take_snapshot`, `take_heapsnapshot` |
| Network | `list_network_requests`, `get_network_request` |
| Console | `list_console_messages`, `get_console_message` |
| Scripting | `evaluate_script` |
| Waiting | `wait_for` |
| Dialogs | `handle_dialog` |
| Uploads | `upload_file` |
| Emulation | `emulate` (mobile, dark mode, geolocation) |
| Performance | `performance_start_trace`, `performance_stop_trace`, `performance_analyze_insight` |
| Audits | `lighthouse_audit` |
| Recording | `screencast_start`, `screencast_stop` |
| Resize | `resize_page` |
| CSS | `get_css_styles` |

---

## Workflow

### Session Setup
1. Check open pages with `list_pages`
2. Open a new tab with `new_page` if needed, or `select_page` to switch context
3. Navigate with `navigate_page(url=...)`

### Interaction Patterns

**Typing text character by character (for reactive inputs):**
```
type_text(text="Hello World")
```

**Pressing keyboard shortcuts:**
```
press_key(key="Enter")
press_key(key="Control+A")
```

**Hovering to reveal tooltips or menus:**
```
hover(selector=".dropdown-trigger")
```

**Dragging elements:**
```
drag(source_selector=".item", target_selector=".dropzone")
```

**Handling file uploads:**
```
upload_file(selector="input[type=file]", file_path="/path/to/file.pdf")
```

### Emulation

**Mobile device emulation:**
```
emulate(device="iPhone 14")
```

**Dark mode:**
```
emulate(color_scheme="dark")
```

**Geolocation:**
```
emulate(latitude=37.7749, longitude=-122.4194)
```

### Performance Profiling

```
performance_start_trace()
# ... perform user actions ...
performance_stop_trace()
performance_analyze_insight()  # Get actionable insights
```

### Lighthouse Audit

```
lighthouse_audit(url="https://example.com", categories=["performance", "accessibility", "seo"])
```

### Heap Snapshot (Memory Debugging)

```
take_heapsnapshot()  # Capture JS heap for memory leak analysis
```

### Screen Recording

```
screencast_start()
# ... perform actions ...
screencast_stop()
```

---

## Advanced Patterns

### Intercepting API Responses
1. `list_network_requests()` after performing an action
2. `get_network_request(url_pattern="api/endpoint")` to inspect payload
3. Use `evaluate_script` to mock responses if needed

### CSS Debugging
```
get_css_styles(selector=".my-element")  # Get computed styles
```

### Multi-Tab Workflows
```
new_page()               # Open tab 2
navigate_page(url=...)   # Navigate in tab 2
select_page(index=0)     # Switch back to tab 1
```

### Form Automation (bulk)
```
fill_form(fields={
  "#name": "John Doe",
  "#email": "john@example.com",
  "#message": "Hello!"
})
```

---

## Best Practices

- **Always screenshot first** to understand current page state
- **Use `wait_for`** before interacting with dynamically loaded elements
- **Check console messages** for JS errors that may affect automation
- **Use `take_snapshot`** (DOM) over `take_screenshot` when you need to read text content
- **Emulate mobile** when testing responsive layouts
- **Run Lighthouse** before reporting on performance or accessibility
- **Close unused tabs** to avoid context confusion

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Element not clickable | Use `hover` first, or `wait_for` visibility |
| Stale page state | `navigate_page` to refresh |
| Dialog blocking | Use `handle_dialog(accept=True)` |
| Wrong tab context | `list_pages`, then `select_page` |
| Dynamic content missing | `wait_for(selector=..., state="visible")` |
| Auth popups | `handle_dialog` or set credentials via `evaluate_script` |
