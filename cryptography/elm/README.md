# Elm

This is a rewrite of the Caesar cipher in [Elm](https://elm-lang.org/).

## Requirements

- [Elm](https://guide.elm-lang.org/install.html)

## Develop

To preview the page:

```bash
# go to directory with elm.json
cd ./cryptography/elm
elm reactor
```

Then open [http://localhost:8000/src/CaesarCipher.elm](http://localhost:8000/src/CaesarCipher.elm) in your browser.

## Build

Currently, this page is not used in the project, so build instructions are provided for context. For more information, see [Elm's documentation](https://guide.elm-lang.org/).

```bash
# go to directory with elm.json
cd ./cryptography/elm
elm make src/CaesarCipher.elm --output=elm.js
```

## Try Online

You can try the page online at <https://elm-lang.org/try>, by:

1. Copying the contents of [src/try-online.txt](src/try-online.txt) into the editor
2. In the "Packages" section, add the `elm/html`, `elm/http`, `elm/json`, and `elm-community/list-extra` packages

  ![Screenshot of installed packages](images/packages.png)

The page should look like this:

![Screenshot of the app](images/elm-app.png)
