# textlint-rule-ja-era-ad-mismatch

この[textlint](https://github.com/textlint/textlint "textlint")ルールは、文書中の和暦と西暦が正しく対応しているかを検証します。

OK:
```
平成12年(2000年)
2000年(平成12年)
```
NG:
```
2016年(平成12年)
平成11年(2000年)
```


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
