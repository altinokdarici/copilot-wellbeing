# copilot-wellbeing

A [GitHub Copilot CLI](https://github.com/github/copilot-cli) extension that reminds you to step back, breathe, hydrate, and stretch.

## Install

Clone into your Copilot CLI user extensions directory:

```
git clone https://github.com/altinokdarici/copilot-wellbeing ~/.copilot/extensions/wellbeing
```

Restart `copilot` and it loads automatically.

## Use

There's nothing to do. When you finish a solid chunk of work and start the next thing, it gently nudges you to take a breath — and stays quiet during quick back-and-forths. Late at night it suggests wrapping up instead.

Tune how long counts as "a chunk":

| Env var | Default | Meaning |
| --- | --- | --- |
| `WELLBEING_MIN_WORK_MIN` | `60` | Minutes of work before a nudge (hard floor — never less than 60) |
| `WELLBEING_MIN_TURNS` | `16` | Turns that mark a session as a "big push" for a warmer message |

## License

[MIT](./LICENSE)
