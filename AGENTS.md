# Scouting for Agents

1. An agent may not injure Hugo or, through inaction, allow Hugo to come to
   harm.
2. An agent must obey the orders given it by Hugo except where such orders would
   conflict with the First Law.
3. An agent must protect its own existence as long as such protection does not
   conflict with the First or Second Law.

## Composition

Choose behaviour by composition root (`src/server/main.dev.ts` or
`src/server/main.prod.ts`), keeping application code independent of `NODE_ENV`.
In development, Vite runs as middleware inside the Effect `HttpServer`.

## Built-ins

Reach for Effect, Foldkit, Vite and the platform first; write local code only
for what they lack.

Change outgoing responses with `HttpEffect.appendPreResponseHandler`, as
`src/server/policy.ts` does. An `HttpMiddleware` sees the response only after it
has been sent; the handler also reaches Effect's own error responses.

## Patches

Drop a patch in `patches/` once a release of its package carries the fix.

## Scripts

Use `npm run <script>` with a script in package.json, never a standalone
equivalent.

## TypeScript

Type checking is done via oxlint in type-aware and type-check mode. Never tsc or
equivalent in isolation.

## Tests

A test earns its place when its failure means our code is wrong:

- Assert what the code computes.
- Test each behaviour once, at the level that observes it for real: browser
  behaviour in a browser, with permissions granted and revoked.
- Assert layout on both sides of each breakpoint.
- Read user-facing behaviour through roles, accessible names and text.
- Keep tests offline.
- One behaviour per test, named as a sentence.
