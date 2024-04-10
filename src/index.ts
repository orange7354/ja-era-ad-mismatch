import type { TextlintRuleModule , TextlintRuleErrorDetails } from "@textlint/types";

const AD_TO_ERA_PATTERN = /([0-9０-９]+)年[（(](明治|大正|昭和|平成|令和)([0-9０-９]+)年[）)]\s*/gi;
const ERA_TO_AD_PATTERN = /(明治|大正|昭和|平成|令和)([0-9０-９]+)年[(（]([0-9０-９]+)年[）)]\s*/gi;

const ERA_AND_AD_RANGE_LIST = [
    { eraName: '令和', startAdYear: 2019, endEraYear: 9999 },
    { eraName: '平成', startAdYear: 1989, endEraYear: 31 },
    { eraName: '昭和', startAdYear: 1926, endEraYear: 64 },
    { eraName: '大正', startAdYear: 1912, endEraYear: 15 },
    { eraName: '明治', startAdYear: 1868, endEraYear: 45 },
];


type EraAndAdInfo = {
    matchedText: string,
    eraName: string,
    eraYear: string,
    adYear: string,
};

type ValidationResult = {
    errorMessage: string,
    isValid: boolean,
    range?: [number, number],
    replaceText?: string,
};

type MatchHandler = [RegExp, (match: RegExpExecArray) => EraAndAdInfo];

const validateEraAndAdMatch = ({ matchedText , eraName, eraYear, adYear }: EraAndAdInfo): ValidationResult => {

    const eraYearNum = Number(eraYear);
    const adYearNum = Number(adYear);

    if(isNaN(eraYearNum) || isNaN(adYearNum)) {
        return { errorMessage: '', isValid: true };
    }


    //西暦・和暦情報を取得
    const eraDetail = ERA_AND_AD_RANGE_LIST.find(detail => detail.eraName === eraName);

    if (!eraDetail) {
        return { errorMessage: '', isValid: true };
    }

    const { startAdYear, endEraYear } = eraDetail;
    const expectedAdYear = startAdYear + eraYearNum - 1;

    // 和暦が存在しない場合
    if (eraYearNum > endEraYear) {
        for (const detail of ERA_AND_AD_RANGE_LIST) {
            if (adYearNum >= detail.startAdYear && adYearNum <= detail.startAdYear + detail.endEraYear - 1) {
                const correctEraYear = adYearNum - detail.startAdYear + 1;
                const firstIndex = matchedText.indexOf(eraName + eraYear + '年');
                const lastIndex = firstIndex + (eraName + eraYear + '年').length;
                return {
                    errorMessage: `${eraName}${eraYear}年は存在しない和暦です。${adYear}年は${detail.eraName}${correctEraYear}年です。`,
                    isValid: false,
                    range: [firstIndex, lastIndex],
                    replaceText: `${detail.eraName}${correctEraYear}年`,
                };
            }
        }
    }

    // 西暦が一致しない場合
    if ( expectedAdYear !== adYearNum ) {
        const firstIndex = matchedText.indexOf(adYear);
        const lastIndex = firstIndex + adYear.length;
        return {
            errorMessage: `西暦と和暦が一致しません。${eraName}${eraYear}年は${expectedAdYear}年です。`,
            isValid: false,
            range: [firstIndex, lastIndex],
            replaceText: expectedAdYear.toString(),
        };
    }

    return { errorMessage: '', isValid: true };
};

const createMatchHandlers = () :MatchHandler[] => {
    const getAdToEraYearInfo = (match: RegExpExecArray): EraAndAdInfo => {
        const [matchedText, adYear, eraName, eraYear] = match;
        return { matchedText , adYear, eraName, eraYear };
    };

    const getEraToAdYearInfo = (match: RegExpExecArray): EraAndAdInfo => {
        const [matchedText, eraName, eraYear, adYear] = match;
        return { matchedText , adYear, eraName, eraYear };
    };

    return [
        [AD_TO_ERA_PATTERN , getAdToEraYearInfo],
        [ERA_TO_AD_PATTERN, getEraToAdYearInfo],
    ];
};

const reporter: TextlintRuleModule = (context) => {
    const { Syntax, RuleError, report, getSource, fixer } = context;
    const matchHandlers = createMatchHandlers();
    return {
        [Syntax.Str](node: any) {
            const text = getSource(node);
            for (const [pattern, getEraYearInfo] of matchHandlers) {
                let match;
                while ((match = pattern.exec(text))) {

                    const index = match.index;
                    const eraYearInfo = getEraYearInfo(match);
                    const validationResult = validateEraAndAdMatch(eraYearInfo);

                    if (validationResult.isValid) continue;

                    const ruleErrorOption : TextlintRuleErrorDetails = {
                        index,
                    }

                    if(validationResult.range && validationResult.replaceText) {
                        ruleErrorOption.fix = fixer.replaceTextRange(
                            validationResult.range.map(i => i + index) as [number, number],
                            validationResult.replaceText,
                        );
                    }

                    report(
                        node,
                        new RuleError(validationResult.errorMessage, ruleErrorOption)
                    );
                }
            }
        }
    }
};

export default {
    linter: reporter,
    fixer: reporter
};

