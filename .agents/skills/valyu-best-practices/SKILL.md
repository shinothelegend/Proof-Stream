---
name: valyu-best-practices
description: >-
  Complete Valyu API toolkit for AI agents. Use this skill when asked to perform
  real-time search and retrieval using the Valyu API, access academic papers,
  research data, web content, or structured knowledge through Valyu's context
  retrieval endpoints. Activate when the user mentions "Valyu", wants to "search
  with Valyu", "retrieve context from Valyu", or needs to integrate Valyu into
  their AI application pipeline.
---

# Valyu Best Practices Skill

This skill provides a complete guide to using the Valyu API for real-time
context retrieval, semantic search, and knowledge augmentation in AI agent
pipelines.

---

## What is Valyu?

Valyu is a context and search API designed for AI agents. It provides:
- **Real-time web search** with AI-optimized result formatting
- **Academic paper retrieval** from major research databases
- **Semantic search** over curated knowledge sources
- **Structured context** ready for RAG (Retrieval-Augmented Generation) pipelines

---

## Authentication Setup

```python
import os
from valyu import Valyu

# Initialize with API key (from environment variable)
client = Valyu(api_key=os.environ.get("VALYU_API_KEY"))
```

```javascript
// JavaScript/TypeScript
import { Valyu } from 'valyu';

const client = new Valyu({
  apiKey: process.env.VALYU_API_KEY,
});
```

> Always store API keys in environment variables, never hardcode them.

---

## Core API: Context Retrieval

The primary Valyu endpoint is `context` — it retrieves relevant information
from multiple sources based on a query.

### Basic Usage

```python
response = client.context(
    query="What are the latest developments in transformer architectures?",
    search_type="all",        # "all", "web", "proprietary"
    max_num_results=5,        # Number of results to return
    max_price=10,             # Budget in Valyu credits
)

for result in response.results:
    print(result.title)
    print(result.content)
    print(result.url)
    print(result.relevance_score)
```

### Parameters Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | string | required | The search query |
| `search_type` | string | `"all"` | `"all"`, `"web"`, `"proprietary"` |
| `max_num_results` | int | 5 | Max results to return (1–20) |
| `max_price` | float | 10.0 | Max spend in Valyu credits |
| `query_type` | string | `"search"` | `"search"` or `"conversation"` |
| `sources` | list | `[]` | Specific source IDs to restrict to |
| `include_domains` | list | `[]` | Only include these domains |
| `exclude_domains` | list | `[]` | Exclude these domains |
| `start_published_date` | string | `None` | ISO date filter (YYYY-MM-DD) |
| `end_published_date` | string | `None` | ISO date filter (YYYY-MM-DD) |

---

## Search Types

### Web Search
Best for current events, recent information, and general knowledge:

```python
response = client.context(
    query="Latest AI research papers 2024",
    search_type="web",
    max_num_results=10,
)
```

### Proprietary Sources
Best for academic papers, research databases, premium content:

```python
response = client.context(
    query="attention mechanism in neural networks",
    search_type="proprietary",
    max_num_results=5,
    max_price=20,  # Higher budget for premium sources
)
```

### All Sources (Recommended for RAG)
Combines web and proprietary for maximum coverage:

```python
response = client.context(
    query="quantum computing breakthroughs",
    search_type="all",
    max_num_results=8,
    max_price=15,
)
```

---

## RAG Integration Pattern

Use Valyu as the retrieval step in a Retrieval-Augmented Generation pipeline:

```python
def rag_with_valyu(user_question: str, llm_client) -> str:
    """Complete RAG pipeline using Valyu for retrieval."""
    
    # Step 1: Retrieve relevant context
    context_response = valyu_client.context(
        query=user_question,
        search_type="all",
        max_num_results=5,
        max_price=10,
    )
    
    # Step 2: Format context for the LLM
    context_text = "\n\n".join([
        f"Source: {r.title}\nURL: {r.url}\n{r.content}"
        for r in context_response.results
    ])
    
    # Step 3: Generate answer with context
    prompt = f"""Answer the question using the provided context.

Context:
{context_text}

Question: {user_question}

Answer:"""
    
    response = llm_client.generate(prompt)
    return response.text
```

---

## Agent Tool Integration

Register Valyu as a tool for an AI agent:

```python
def valyu_search_tool(query: str, search_type: str = "all") -> dict:
    """
    Search the web and academic sources using Valyu.
    
    Args:
        query: The search query
        search_type: 'all', 'web', or 'proprietary'
    
    Returns:
        Dictionary with results list
    """
    response = client.context(
        query=query,
        search_type=search_type,
        max_num_results=5,
        max_price=10,
    )
    
    return {
        "results": [
            {
                "title": r.title,
                "content": r.content[:500],  # Truncate for token efficiency
                "url": r.url,
                "score": r.relevance_score,
            }
            for r in response.results
        ],
        "total_cost": response.cost,
    }

# Register with your agent framework
tools = [
    {
        "name": "valyu_search",
        "description": "Search for real-time web and academic information",
        "function": valyu_search_tool,
        "parameters": {
            "query": {"type": "string", "required": True},
            "search_type": {"type": "string", "default": "all"},
        }
    }
]
```

---

## Response Object Reference

```python
response = client.context(query="...")

response.results          # List of Result objects
response.cost             # Total cost in Valyu credits
response.num_results      # Actual number of results returned
response.search_type      # Search type used

# Per result:
result.title              # Document title
result.content            # Main content text
result.url                # Source URL
result.relevance_score    # 0.0–1.0 relevance to query
result.published_date     # Publication date (if available)
result.source             # Source identifier
result.author             # Author (for academic papers)
```

---

## Cost Optimization

```python
# ✅ Set budget limits to avoid unexpected costs
response = client.context(query=query, max_price=5.0)

# ✅ Use web-only for general queries (cheaper than proprietary)
response = client.context(query=query, search_type="web")

# ✅ Reduce max_num_results when you only need a summary
response = client.context(query=query, max_num_results=3)

# ✅ Check cost before using in production loops
print(f"Query cost: {response.cost} credits")
```

---

## Error Handling

```python
from valyu.exceptions import ValyuAPIError, ValyuRateLimitError, ValyuAuthError

try:
    response = client.context(query=query)
except ValyuAuthError:
    print("Invalid API key. Check VALYU_API_KEY environment variable.")
except ValyuRateLimitError as e:
    print(f"Rate limit hit. Retry after {e.retry_after} seconds.")
    time.sleep(e.retry_after)
except ValyuAPIError as e:
    print(f"API error: {e.status_code} - {e.message}")
```

---

## TypeScript/JavaScript Usage

```typescript
import { Valyu } from 'valyu';

const client = new Valyu({ apiKey: process.env.VALYU_API_KEY! });

async function search(query: string) {
  const response = await client.context({
    query,
    searchType: 'all',
    maxNumResults: 5,
    maxPrice: 10,
  });

  return response.results.map(r => ({
    title: r.title,
    content: r.content,
    url: r.url,
    score: r.relevanceScore,
  }));
}
```

---

## Best Practices Summary

- ✅ Always set `max_price` to control costs
- ✅ Store API key in environment variables only
- ✅ Use `search_type="web"` for faster, cheaper general queries
- ✅ Use `search_type="proprietary"` for academic/research queries
- ✅ Truncate `result.content` before passing to LLMs to save tokens
- ✅ Handle rate limits with exponential backoff
- ✅ Log `response.cost` in production to monitor spending
- ❌ Never hardcode API keys in source code
- ❌ Don't set `max_num_results` higher than needed
- ❌ Don't use Valyu for queries that can be answered from static knowledge
