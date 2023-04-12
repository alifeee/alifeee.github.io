# `alifeee.github.io`

You can visit the website by visiting <https://alifeee.co.uk/> or <https://alifeee.github.io/>

## Jest testing

### Running tests - simple

```bash
npm test
```

### Running tests - with debug/watch

(in VSCode): `F1` ⇾ `Debug: JavaScript Debug Terminal`

```bash
npm test -- --watch
```

## Refactoring with find and replace

### Wrap body in main

#### Find

```regex
<body>((?:(?!<main>).|[\r\n])*?)<\/body>
```

#### Replace

```html
<body>
  <main>
    $1
  </main>
</body>
```
