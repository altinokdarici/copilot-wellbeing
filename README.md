# copilot-wellbeing

A [GitHub Copilot CLI](https://github.com/github/copilot-cli) extension that looks after the human behind the keyboard. It adds a `wellbeing_checkin` tool that returns short, warm, varied nudges — to step back, breathe, hydrate, stretch, rest your eyes, or fix your posture — and it can quietly remind you on its own when you've been heads-down for a while.

## Features

- **`wellbeing_checkin` tool** — ask Copilot for a "how is life" reminder or a break prompt and get a fresh, 2–3 sentence nudge every time.
- **Optional `focus`** — emphasize a specific area: `breathe`, `hydrate`, `stretch`, `eyes`, `posture`, or `break` (defaults to a random pick).
- **Self-scheduling idle nudges** — a built-in timer prints a gentle reminder to the timeline after a stretch of inactivity. It uses `session.log`, so it costs **no model turn** and never interrupts you mid-task.

## Install

Copy this folder into your Copilot CLI user extensions directory:

```
~/.copilot/extensions/wellbeing/
```

On Windows that's `C:\Users\<you>\.copilot\extensions\wellbeing\`.

The extension loads automatically the next time you start `copilot` (or after running an extensions reload). No `npm install` is required — the `@github/copilot-sdk/extension` module is resolved by the CLI.

## Usage

Just ask Copilot:

> how is life?

> give me a wellbeing nudge

> remind me to take a break

Or let the idle timer do it for you.

## Configuration

| Env var | Default | Description |
| --- | --- | --- |
| `WELLBEING_INTERVAL_MIN` | `60` | Minutes of inactivity before a passive nudge is printed to the timeline. |

Set it before launching the CLI, e.g. on PowerShell:

```powershell
$env:WELLBEING_INTERVAL_MIN = "30"
```

## License

[MIT](./LICENSE)
