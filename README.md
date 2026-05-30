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

Tune how much work counts as "a chunk":

| Env var | Default | Meaning |
| --- | --- | --- |
| `WELLBEING_MIN_TURNS` | `8` | Assistant turns of work before a nudge is worth it |
| `WELLBEING_MIN_WORK_MIN` | `25` | ...or this many minutes of work, whichever comes first |

## License

[MIT](./LICENSE)
