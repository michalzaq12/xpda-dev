"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onProcessExit = void 0;
function onProcessExit(handler) {
    handler = handler || (() => Promise.resolve());
    function onExit(code) {
        return __awaiter(this, void 0, void 0, function* () {
            yield handler();
            process.exit(code);
        });
    }
    process.once('exit', code => onExit(code));
    process.once('SIGINT', () => onExit(0));
    process.once('SIGUSR1', () => onExit(0));
    process.once('SIGUSR2', () => onExit(0));
    process.once('uncaughtException', (e) => __awaiter(this, void 0, void 0, function* () {
        console.log('Uncaught Exception');
        console.log(e.stack);
        yield onExit(99);
    }));
}
exports.onProcessExit = onProcessExit;
