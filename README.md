# textlint-rule-ja-era-ad-mismatch

This textlint rule detects mismatches between Japanese era names (Gengo) and western calendar years (Anno Domini).

## Install

Install with [npm](https://www.npmjs.com/):

    npm install textlint-rule-ja-era-ad-mismatch

## Usage

Via `.textlintrc.json`(Recommended)

```json
{
    "rules": {
        "ja-era-ad-mismatch": true
    }
}
```

Via CLI

```
textlint --rule ja-era-ad-mismatch README.md
```

### Build

Builds source codes for publish to the `lib` folder.
You can write ES2015+ source codes in `src/` folder.

    npm run build

### Tests

Run test code in `test` folder.
Test textlint rule by [textlint-tester](https://github.com/textlint/textlint-tester).

    npm test

## License

ISC © 
