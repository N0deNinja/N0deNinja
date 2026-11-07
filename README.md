<!-- The SVG cards in /assets come from scripts/build-assets.mjs. The activity card is rebuilt daily by .github/workflows/activity.yml. -->

<p align="center">
  <img src="assets/hero.svg" width="100%" alt="George Dvořák, Senior Full-Stack Developer. Cross-platform mobile, web and backend engineering with React Native, TypeScript, Expo, React and Node.js. Prague, Czech Republic.">
</p>

<p align="center">
  <a href="https://dvorakstudio.dev"><img src="assets/link-portfolio.svg" height="44" alt="Portfolio: dvorakstudio.dev"></a>
  &nbsp;
  <a href="https://www.linkedin.com/in/georgedvorakdev/"><img src="assets/link-linkedin.svg" height="44" alt="LinkedIn"></a>
</p>

I build and maintain production React Native apps for iOS and Android in TypeScript, from the screen a user taps through to the API behind it. I started on the mobile side, and the work has grown into full-stack engineering: backend integrations, account and transaction flows, and the production issues that only show up on one platform.

Outside work I like taking unfamiliar systems apart to see how they behave: game runtimes, replay and simulation tooling, and development workflows built around AI coding agents.

## Experience

**Senior Full-Stack Developer** · 2025 – present

I work on production, cross-platform mobile apps that handle real commercial workflows: accounts and verification, purchases and discounts, reservations, and digital entitlements. I work with engineering, product and QA, and I'm part of production support and incident resolution.

<table>
<tr>
<td width="50%" valign="top">

**Mobile**
- Cross-platform features in React Native, Expo and TypeScript
- Complex navigation and multi-step user flows
- Native integrations, plus iOS- and Android-specific debugging
- Performance-conscious UI, state management, server-state sync

</td>
<td width="50%" valign="top">

**Frontend architecture**
- Reusable components and shared app infrastructure
- Extending and maintaining an existing app architecture
- API-driven, asynchronous interfaces
- TypeScript application design

</td>
</tr>
<tr>
<td width="50%" valign="top">

**Backend and integrations**
- REST API integrations and asynchronous workflows
- Authentication, verification and user accounts
- Reservations, purchases, discounts and digital entitlements
- Node.js services, databases and third-party integrations

</td>
<td width="50%" valign="top">

**Delivery**
- Turning product requirements into working features
- Tracing production issues across app and backend
- Working with shared systems and production dependencies
- Maintenance and incident resolution alongside QA

</td>
</tr>
</table>

## Stack

<p align="center">
  <img src="assets/stack.svg" width="100%" alt="Specialization: TypeScript, React Native, Expo, React and Node.js. Mobile: Expo Router, Reanimated, Skia, react-native-svg, Expo Image, Expo Video, Hermes, iOS, Android. Web: Next.js, JavaScript, HTML and CSS, Zustand, React Context, SWR. Backend and data: Fastify, REST APIs, SQL, Prisma, Drizzle ORM, SQLite. Tooling: Git, GitHub, Linux, Docker. Explored in personal projects: C#, CounterStrikeSharp, Electron, Discord.js, Playwright, Unreal Engine, Blender.">
</p>

## Selected work

### [ReTake](https://github.com/N0deNinja/ReTake)

[![Release](https://img.shields.io/github/v/release/N0deNinja/ReTake?style=flat-square&label=release&labelColor=0b1322&color=0e7490)](https://github.com/N0deNinja/ReTake/releases/latest)
[![License](https://img.shields.io/github/license/N0deNinja/ReTake?style=flat-square&labelColor=0b1322&color=26364f)](https://github.com/N0deNinja/ReTake/blob/main/LICENSE)
![C++ and Luau](https://img.shields.io/badge/C%2B%2B%20%C2%B7%20Luau-26364f?style=flat-square)

Rewind and retry for **skate.** on PC, built as a mod on the open-source [ReSkate](https://github.com/Dingo-Shenanigans/ReSkate) framework. Mess up anywhere in a line, pick an earlier moment on a timeline, and carry on from there. ReTake doesn't teleport you back. It replays your recorded inputs at accelerated speed until it reaches that moment, then slows down, counts you in and hands the controls back.

<a href="https://github.com/N0deNinja/ReTake"><img src="assets/retake.svg" width="100%" alt="Animated walkthrough of ReTake: a skate line is recorded, the skater bails on a rail, an earlier moment is picked on the timeline, the inputs replay to that moment at 4x, a 3-2-1 countdown hands control back, and the best attempts play back as one run."></a>

- **Input recording and locked replay.** A `reskate.tas` plugin API added to the native runtime (C++) records a line's inputs on every physics step and replays them locked to the recording.
- **Game-time control.** Accelerated catch-up from 1× to 8×, a countdown hand-off back to the player, and slow motion that rescales the board's flight so it works mid-air.
- **Timeline UI in Luau.** Scrub the line with a ghost skater, replace the rest of a line with a new attempt, and play every best attempt back as one run.
- **Packaging.** A one-click installer with backup and uninstall, offline-only by design, and a native build that never uploads crash reports.

Building it meant working inside a game runtime I didn't write: learning how its physics steps, grinds and bails behave, then a lot of iterative debugging to make replays line up.

<sub>Early release (v0.0.1). Replays can still drift on rails and ledges; this is listed in the repo's known issues.</sub>

### Counter-Strike 2 server plugins

Server-side gameplay features in C# on .NET 8 with CounterStrikeSharp: game event handling, player state, chat commands and persistent data.

<table>
<tr>
<td width="50%" valign="top">

**[ServerCoreBySeen](https://github.com/N0deNinja/ServerCoreBySeen)**<br>
A modular plugin pack: XP and ranking stored in SQLite through Dapper, configurable rewards for kills, headshots, bomb plays and round results, VIP perks by SteamID, scoreboard tags, and per-module config.

</td>
<td width="50%" valign="top">

**[RankingSystem](https://github.com/N0deNinja/CS2---Ranking-System-Plugin)**<br>
An earlier, single-purpose plugin: points for kills, deaths and round results, a leaderboard that persists between restarts, and `!rank` / `!top15` chat commands with a colour-coded table.

</td>
</tr>
</table>

## Working with AI coding agents

<p align="center">
  <img src="assets/workflow.svg" width="100%" alt="Workflow: specify, map the system, decompose, delegate to agents, review and debug in a loop, then validate and integrate.">
</p>

I use coding agents such as Claude Code and OpenAI's coding tools in my everyday engineering, including workflows where agents write a large share of the code. What makes that work is everything around the agent: a clear spec, understanding the target system before changing it, splitting the problem into pieces an agent can own, then reviewing, debugging and testing what comes back before it goes in. Used that way, agents have let me build complex prototypes and working tools much faster. They don't replace knowing how the software works.

## Activity

<p align="center">
  <img src="https://raw.githubusercontent.com/N0deNinja/N0deNinja/output/activity.svg" width="100%" alt="GitHub contribution activity for the last 12 months.">
</p>

## Currently exploring

`developer tooling & automation` `agentic software engineering` `game engine integrations` `simulation & replay systems` `cross-platform architecture`

<br>

<p align="center">
  <sub>Prague, Czech Republic · <a href="https://dvorakstudio.dev">dvorakstudio.dev</a> · <a href="https://www.linkedin.com/in/georgedvorakdev/">LinkedIn</a></sub>
</p>
