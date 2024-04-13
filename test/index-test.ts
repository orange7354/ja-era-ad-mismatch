import TextLintTester from "textlint-tester";
import rule from "../src/index";

const tester = new TextLintTester();

tester.run("rule", rule, {
    valid: [
        "平成12年(2000年)は良い年だった。",
        "2000年(平成12年)は良い年だった。",
    ],
    invalid: [
        {
            text: "2019年(令和0年)は良い年だった。",
            errors: [
                {
                    message: "令和0年は正しくない表記です。元号の初年度は「元年」と表記します。",
                    line: 1,
                    column: 1,
                },
            ],
        },
        {
            text: "2016年(平成12年)は良い年だった。",
            errors: [
                {
                    message: "西暦と和暦が一致しません。平成12年は2000年です。",
                    line: 1,
                    column: 1,
                },
            ],
        },
        {
            text: "私の誕生日は20100年(平成12年)です。",
            errors: [
                {
                    message: "西暦と和暦が一致しません。平成12年は2000年です。",
                    line: 1,
                    column: 7,
                },
            ],
        },
        {
            text: "2016年(平成52年)は良い年だった。",
            errors: [
                {
                    message: "平成52年は存在しない和暦です。2016年は平成28年です。",
                    line: 1,
                    column: 1,
                },
            ],
        },
        {
            text: "平成11年(2000年)は良い年だった。",
            errors: [
                {
                    message: "西暦と和暦が一致しません。平成11年は1999年です。",
                    line: 1,
                    column: 1,
                },
            ],
        },
        {
            text: "平成32年(2020年)は良い年だった。",
            errors: [
                {
                    message: "平成32年は存在しない和暦です。2020年は令和2年です。",
                    line: 1,
                    column: 1,
                },
            ],
        },
    ],
});