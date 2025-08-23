declare class SocketCli {
    #private;
    increment(metric: string, value?: number): void;
    decrement(metric: string, value?: number): void;
    distribution(metric: string, value: number): void;
    gauge(metric: string, value: number): void;
    percentage(metric: string, value: number): void;
    systembyte(metric: string, value: number): void;
}
declare const _default: SocketCli;
export default _default;
export { SocketCli };
