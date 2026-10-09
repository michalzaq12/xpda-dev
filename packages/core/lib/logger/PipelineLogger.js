"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineLogger = void 0;
const ora_1 = require("ora");
const chalk_1 = require("chalk");
const SUCCEED = chalk_1.default.green('[SUCCEED] ');
const START = chalk_1.default.blue('[START] ');
const INFO = chalk_1.default.blue('[INFO] ');
const FAIL = chalk_1.default.red('[FAIL] ');
class PipelineLogger {
    constructor(options) {
        this.options = options;
        options.disableSpinner = options.disableSpinner || false;
        this.stream = options.stream || process.stdout;
        if (!this.options.disableSpinner)
            this.initSpinners();
    }
    initSpinners() {
        this.spinner = (0, ora_1.default)({
            text: this.options.title,
            stream: this.stream,
            color: 'white',
        });
        this.staticSpinner = (0, ora_1.default)({
            isEnabled: false,
            stream: this.stream,
            color: 'white',
        });
    }
    formatSpinnerTitle() {
        this.stream.write('\n');
        return chalk_1.default.underline.bold(this.options.title) + ': ';
    }
    printTitle(title, color) {
        if (this.lastActiveTitle === title)
            return;
        const time = new Date().toLocaleTimeString();
        let text = chalk_1.default.keyword('white').bgKeyword(color)(`\n  ${title}  `);
        text += chalk_1.default.gray(' [' + time + ']');
        this.stream.write(text);
        this.stream.write('\n');
    }
    spinnerFail(error) {
        const message = typeof error === 'string' ? error : error.message || 'Error';
        const formattedText = this.formatSpinnerTitle() + chalk_1.default.redBright(message);
        if (this.options.disableSpinner)
            this.writeToStream(FAIL + formattedText);
        else
            this.spinner.fail(formattedText);
        if (typeof error !== 'string')
            console.log(error);
    }
    spinnerInfo(text) {
        this.lastActiveTitle = '';
        const formattedText = this.formatSpinnerTitle() + text;
        if (this.options.disableSpinner)
            return this.writeToStream(INFO + formattedText);
        this.staticSpinner.info(formattedText);
    }
    spinnerStart(text) {
        const formattedText = this.formatSpinnerTitle() + text;
        if (this.options.disableSpinner)
            return this.writeToStream(START + formattedText);
        this.spinner.start(formattedText);
    }
    spinnerSucceed(text) {
        const formattedText = this.formatSpinnerTitle() + text;
        if (this.options.disableSpinner)
            return this.writeToStream(SUCCEED + formattedText);
        this.spinner.succeed(formattedText);
    }
    writeToStream(text) {
        this.stream.write(text);
        this.stream.write('\n');
    }
    static colorText(text, color) {
        if (color)
            return chalk_1.default.keyword(color)(text);
        return text;
    }
    log(title, titleColor, text, textColor) {
        if (text.trim() === '' || text.trim() === ' ')
            return;
        if (this.spinner && this.spinner.isSpinning)
            this.spinner.clear();
        this.printTitle(title, titleColor);
        text = text
            .split(/\r?\n/)
            .map(el => PipelineLogger.colorText('│  ', titleColor) + PipelineLogger.colorText(el, textColor))
            .join('\n');
        this.writeToStream(text);
        this.lastActiveTitle = title;
        if (this.spinner && this.spinner.isSpinning)
            this.spinner.render();
    }
}
exports.PipelineLogger = PipelineLogger;
