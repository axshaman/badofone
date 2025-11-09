# Badofone Support Simulator 🤖💸

Badofone Support is a deliberately terrible customer service simulator. Fire up the chat, pick a scenario, and watch a delightfully unhelpful bot mis-handle every request while a fake escalation pipeline churns out meaningless tickets.

## Highlights

- **Scenario-driven chaos** – switch between technical outages, billing disputes, and retention battles. Each option ships with its own autopilot script, disclaimers, and bespoke tone.
- **Autopilot & manual mode** – let the simulator run its scripted disaster or jump in yourself to plead for help.
- **Escalation theatre** – trigger mock tickets and marvel at their uselessness.
- **Knowledge base trolling** – receive hand-picked articles that make things worse.
- **Documented API** – consume the `/api/support/respond` endpoint from tests or bots, complete with OpenAPI definition.
- **Fresh UI kit** – Tailwind-powered components with scenario aware styling and mood-based chat bubbles.

## Quick start

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the simulator**

   ```bash
   npm run dev
   ```

3. **Open the chat** at [http://localhost:3000/chat](http://localhost:3000/chat) and unleash the chaos.

> ℹ️ The autopilot kicks in automatically for the active scenario. Use the controls on the left panel to pause it, switch scenarios, or escalate.

## API reference

- Endpoint: `POST /api/support/respond`
- Specification: [`docs/openapi.yaml`](docs/openapi.yaml)
- Request example:

  ```json
  {
    "message": "Hello, why is my bill doubled?",
    "scenario": "billing",
    "escalate": false
  }
  ```

The response payload includes the bot’s reply, its mood (for UI colour coding), optional knowledge base suggestions, and a pseudo escalation ticket.

## Architecture

- High-level C4 diagrams live in [`docs/architecture/c4-model.md`](docs/architecture/c4-model.md).
- Scenario metadata and autopilot scripts are defined in [`lib/scenarios.ts`](lib/scenarios.ts).
- The response engine and knowledge base live in [`lib/responses.ts`](lib/responses.ts).
- The main chat experience is implemented in [`app/chat/page.tsx`](app/chat/page.tsx) and uses lightweight UI primitives from `components/ui`.

## Development notes

- The project targets **Next.js 16** with **React 19** and **TypeScript 5.9**.
- TailwindCSS provides utility styling; global directives reside in [`app/globals.css`](app/globals.css).
- Run `npm run build` before deployment to ensure the chat and API compile successfully.

Have fun delivering the worst support imaginable! If you somehow improve the customer experience, you may be violating project goals. 😉
