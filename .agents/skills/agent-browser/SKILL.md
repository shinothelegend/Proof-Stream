---
name: agent-browser
description: >-
  Browser automation CLI for AI agents. Use when the user needs to interact with
  websites, scrape web content, automate browser tasks, fill forms, click
  buttons, take screenshots, run end-to-end tests, or perform any web-based
  automation. Activate when the user asks to "open a browser", "visit a URL",
  "scrape a page", "automate a website", or perform web interactions.
---

# Agent Browser Skill

This skill gives you the tools and procedures to automate browser interactions
on behalf of the user using a headless or headed browser environment (Playwright,
Puppeteer, or CDP-based tools). You can navigate pages, extract data, interact
with UI elements, and capture visual state.

---

## Core Capabilities

- **Navigate**: Open URLs, follow links, handle redirects and authentication
- **Interact**: Click buttons, fill forms, select options, drag-and-drop
- **Extract**: Scrape text, attributes, tables, and structured data from pages
- **Observe**: Take screenshots, capture network traffic, read console logs
- **Automate**: Run multi-step flows, handle popups/dialogs, manage cookies/sessions
- **Test**: Validate UI behavior end-to-end, assert on page state

---

## Workflow

### 1. Understand the Goal
- Identify what the user wants to accomplish (scrape, test, automate, inspect)
- Determine the target URL(s) and what data/actions are needed
- Note any authentication requirements or complex interactions

### 2. Choose the Right Tool
- Use **MCP chrome-devtools** tools (`navigate_page`, `click`, `fill`, `take_screenshot`, etc.) when already available in context
- For scripted automation, use Playwright (`npx playwright`) for reliability
- For simple HTTP data fetching without JS rendering, prefer `read_url_content`

### 3. Execute Browser Actions

**Opening a page:**
```
navigate_page(url="https://example.com")
```

**Taking a screenshot to verify state:**
```
take_screenshot()
```

**Filling a form field:**
```
fill(selector="#email", value="user@example.com")
```

**Clicking an element:**
```
click(selector="button[type=submit]")
```

**Extracting page content:**
```
take_snapshot()  # Gets DOM snapshot
evaluate_script(script="document.title")  # Run JS
```

**Handling network requests:**
```
list_network_requests()
get_network_request(url_pattern="api/data")
```

### 4. Validate Results
- Always take a screenshot after key interactions to confirm state
- Check console messages for errors
- Verify extracted data is complete and correct

### 5. Report Back
- Summarize what was accomplished
- Return scraped data in a structured format (JSON, table, markdown)
- Note any issues encountered (CAPTCHAs, auth walls, dynamic content)

---

## Best Practices

- **Wait for elements**: Use `wait_for` before interacting with dynamic content
- **Handle errors gracefully**: Check if selectors exist before clicking
- **Respect robots.txt**: Always check site policies before scraping
- **Rate limit**: Add delays between requests to avoid overwhelming servers
- **Session management**: Save cookies/auth state when running multi-step flows
- **Screenshot-first**: Capture screenshots to understand page layout before writing selectors

---

## Common Patterns

### Scraping a table
```javascript
evaluate_script(`
  Array.from(document.querySelectorAll('table tr')).map(row =>
    Array.from(row.querySelectorAll('td,th')).map(cell => cell.innerText)
  )
`)
```

### Login flow
1. `navigate_page` to login URL
2. `fill` username and password fields
3. `click` submit button
4. `wait_for` navigation/dashboard element
5. Proceed with authenticated actions

### Infinite scroll scraping
1. `navigate_page` to target
2. `evaluate_script` to extract visible items
3. `evaluate_script` to scroll down (`window.scrollBy(0, window.innerHeight)`)
4. `wait_for` new content
5. Repeat until all data collected

---

## Error Handling

- **Element not found**: Try alternate selectors, wait longer, or check if page fully loaded
- **Auth required**: Ask user for credentials or session cookies
- **CAPTCHA**: Notify user — manual intervention may be needed
- **Timeout**: Increase wait times; page may be slow to respond
- **JS errors**: Check console messages with `list_console_messages`
