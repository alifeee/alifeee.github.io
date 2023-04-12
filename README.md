# `alifeee.github.io`

You can visit the website by visiting <https://alifeee.co.uk/> or <https://alifeee.github.io/>

## Colour Scheme

- Primary: #709
- Secondary: #d44
- Alternate: #14d
- Surface: #444

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
