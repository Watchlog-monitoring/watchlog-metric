"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _SocketCli_instances, _SocketCli_sendMetric;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketCli = void 0;
const axios_1 = __importDefault(require("axios"));
const fs = require('fs');
const dns = require('dns');
const { promisify } = require('util');
const lookup = promisify(dns.lookup);
async function isRunningInK8s() {
    const tokenPath = '/var/run/secrets/kubernetes.io/serviceaccount/token';
    if (fs.existsSync(tokenPath)) {
        return true;
    }
    try {
        const content = fs.readFileSync('/proc/1/cgroup', 'utf8');
        if (content.includes('kubepods')) {
            return true;
        }
    }
    catch {
        // ignore
    }
    try {
        await lookup('kubernetes.default.svc.cluster.local');
        return true;
    }
    catch {
        return false;
    }
}
let cachedServerURL = null;
async function getServerURL() {
    if (cachedServerURL)
        return cachedServerURL;
    if (await isRunningInK8s()) {
        cachedServerURL = 'http://watchlog-node-agent.monitoring.svc.cluster.local:3774';
    }
    else {
        cachedServerURL = 'http://127.0.0.1:3774';
    }
    return cachedServerURL;
}
class SocketCli {
    constructor() {
        _SocketCli_instances.add(this);
    }
    increment(metric, value = 1) {
        if (value > 0)
            __classPrivateFieldGet(this, _SocketCli_instances, "m", _SocketCli_sendMetric).call(this, 'increment', metric, value);
    }
    decrement(metric, value = 1) {
        if (value > 0)
            __classPrivateFieldGet(this, _SocketCli_instances, "m", _SocketCli_sendMetric).call(this, 'decrement', metric, value);
    }
    distribution(metric, value) {
        __classPrivateFieldGet(this, _SocketCli_instances, "m", _SocketCli_sendMetric).call(this, 'distribution', metric, value);
    }
    gauge(metric, value) {
        __classPrivateFieldGet(this, _SocketCli_instances, "m", _SocketCli_sendMetric).call(this, 'gauge', metric, value);
    }
    percentage(metric, value) {
        if (value >= 0 && value <= 100) {
            __classPrivateFieldGet(this, _SocketCli_instances, "m", _SocketCli_sendMetric).call(this, 'percentage', metric, value);
        }
        else {
            console.error(`Percentage out of range [0–100]: ${value}`);
        }
    }
    systembyte(metric, value) {
        if (value > 0)
            __classPrivateFieldGet(this, _SocketCli_instances, "m", _SocketCli_sendMetric).call(this, 'systembyte', metric, value);
    }
}
exports.SocketCli = SocketCli;
_SocketCli_instances = new WeakSet(), _SocketCli_sendMetric = async function _SocketCli_sendMetric(method, metric, value = 1) {
    if (typeof metric !== 'string' || typeof value !== 'number') {
        return;
    }
    const baseURL = await getServerURL();
    const url = `${baseURL}?method=${method}&metric=${encodeURIComponent(metric)}&value=${value}`;
    axios_1.default.get(url).catch(() => {
        // Fail silently
    });
};
exports.default = new SocketCli();
