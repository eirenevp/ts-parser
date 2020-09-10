"use strict";
// The MIT License (MIT)
//
// Copyright (c) 2017 Firebase
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.makeCloudFunction = exports.Response = exports.Request = void 0;
var _ = require("lodash");
var express_1 = require("express");
exports.Request = express_1.Request;
exports.Response = express_1.Response;
var WILDCARD_REGEX = new RegExp('{[^/{}]*}', 'g');
function _makeParams(event, triggerResource) {
    if (!event.resource) { // In unit testing, "resource" may not be populated for a test event.
        return event.params || {};
    }
    var wildcards = triggerResource.match(WILDCARD_REGEX);
    var params = {};
    if (wildcards) {
        var triggerResourceParts_1 = _.split(triggerResource, '/');
        var eventResourceParts_1 = _.split(event.resource, '/');
        _.forEach(wildcards, function (wildcard) {
            var wildcardNoBraces = wildcard.slice(1, -1);
            var position = _.indexOf(triggerResourceParts_1, wildcard);
            params[wildcardNoBraces] = eventResourceParts_1[position];
        });
    }
    return params;
}
/** @internal */
function makeCloudFunction(_a) {
    var _this = this;
    var provider = _a.provider, eventType = _a.eventType, resource = _a.resource, _b = _a.dataConstructor, dataConstructor = _b === void 0 ? function (raw) { return raw.data; } : _b, handler = _a.handler, _c = _a.before, before = _c === void 0 ? function () { return; } : _c, _d = _a.after, after = _d === void 0 ? function () { return; } : _d;
    var cloudFunction = function (event) { return __awaiter(_this, void 0, void 0, function () {
        var typedEvent, promise;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, , 2, 3]);
                    before(event);
                    typedEvent = _.cloneDeep(event);
                    typedEvent.data = dataConstructor(event);
                    typedEvent.params = _makeParams(event, resource) || {};
                    promise = handler(typedEvent);
                    if (typeof promise === 'undefined') {
                        console.warn('Function returned undefined, expected Promise or value');
                    }
                    return [4 /*yield*/, promise];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    after(event);
                    return [7 /*endfinally*/];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    cloudFunction.__trigger = {
        eventTrigger: {
            resource: resource,
            eventType: "providers/" + provider + "/eventTypes/" + eventType
        }
    };
    return cloudFunction;
}
exports.makeCloudFunction = makeCloudFunction;
