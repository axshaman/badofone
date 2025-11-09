# Badofone Support Simulator – C4 Model

This document captures the architecture of the satirical customer support simulator using the C4 modelling approach. Each level highlights how the deliberately unhelpful experience is assembled.

## Level 1 – System Context

```mermaid
C4Context
    title System Context
    Person(customer, "Frustrated customer", "Tries to get help from Badofone.")
    System(badofoneApp, "Badofone Support Simulator", "Web app delivering entertainingly bad support experiences.")
    System_Ext(apiConsumer, "External integrations", "Optional scripts/tests calling the public API to harvest sarcasm.")

    customer -> badofoneApp : Complains via browser
    apiConsumer -> badofoneApp : Calls OpenAPI endpoint
    badofoneApp -> customer : Snarky UI responses
    badofoneApp -> apiConsumer : JSON payloads of misery
```

## Level 2 – Container Diagram

```mermaid
C4Container
    title Container View
    Person(customer, "Frustrated customer")

    System_Boundary(app, "Badofone Support Simulator") {
      Container(web, "Next.js front-end", "TypeScript, React", "Chat UI, autopilot script, escalation theatrics")
      Container(api, "Support API", "Next.js Edge Route", "Generates chaotic responses based on scenarios")
      Container(lib, "Scenario + response library", "TypeScript modules", "Stores canned replies and knowledge base links")
    }

    customer -> web : Browser interactions
    web -> api : POST /api/support/respond
    api -> lib : Fetch tone-specific responses
    web -> lib : Imports scenario metadata for UI controls
```

## Level 3 – Component Diagram (Next.js front-end)

```mermaid
C4Component
    title Component View – Front-end
    Container_Boundary(web, "Next.js front-end") {
      Component(chatPage, "app/chat/page.tsx", "Client component", "Coordinates chat flow, autopilot, escalation handling")
      Component(toolbar, "ChatToolbar", "Client component", "Scenario selection, autopilot toggle, escalation actions")
      Component(bubbles, "ChatBubble", "Client component", "Styles messages based on sender + mood")
      Component(resources, "SupportResources", "Client component", "Suggests useless knowledge base articles")
      Component(uiKit, "UI primitives", "Client components", "Reusable Card, Button, Input")
    }

    chatPage -> toolbar : Renders controls
    chatPage -> bubbles : Presents chat transcript
    chatPage -> resources : Shows knowledge base items
    chatPage -> uiKit : Layout + inputs
    chatPage -> apiRoute : Fetch support responses

    Container(apiRoute, "app/api/support/respond", "Server route", "Validates payloads and uses response generator")
    Component(responseLib, "lib/responses.ts", "Module", "Synthesises responses by scenario + tone")
    Component(scenarioLib, "lib/scenarios.ts", "Module", "Scenario metadata + autopilot scripts")

    apiRoute -> responseLib : generateResponse()
    responseLib -> scenarioLib : Fetch scenario configuration
    chatPage -> scenarioLib : Access autopilot script + disclaimers
```

## Level 4 – Code & Deployment Notes

* **Deployment:** Runs as a standard Next.js 16 app. The API route can execute on the Node.js runtime or an edge-compatible environment.
* **Data:** All conversation content is in-memory TypeScript arrays; no databases are harmed.
* **Extensibility:** Add new scenarios by extending `lib/scenarios.ts` (metadata) and `lib/responses.ts` (reply catalogues). The UI automatically lists new options, while the OpenAPI schema may require manual updates.
* **Integrations:** External testers can hit `POST /api/support/respond` as documented in `docs/openapi.yaml`.
