declare module 'node:http' {
  export class Agent {}
  export class ClientRequest {}
  export interface ClientRequestArgs {
    [key: string]: unknown;
  }
  export type OutgoingHttpHeaders = Record<string, string | number | string[]>;
  export class ServerResponse {
    statusCode: number;
    setHeader(name: string, value: string | number | readonly string[]): void;
    end(data?: string | Uint8Array): void;
  }
  export class IncomingMessage {
    headers: Record<string, string | string[]>;
    method?: string;
    url?: string;
  }
  export class Server {
    listen(...args: unknown[]): this;
    close(callback?: (err?: Error) => void): void;
  }
}

declare module 'node:http2' {
  export class Http2SecureServer {
    listen(...args: unknown[]): this;
    close(callback?: (err?: Error) => void): void;
  }
}

declare module 'node:fs' {
  export class FSWatcher {
    close(): void;
    on(event: string, listener: (...args: any[]) => void): this;
  }
  export class Stats {
    isFile(): boolean;
    isDirectory(): boolean;
  }
}

declare module 'node:events' {
  export class EventEmitter<T = any> {
    addListener(event: string | symbol, listener: (...args: any[]) => unknown): this;
    on(event: string | symbol, listener: (...args: any[]) => unknown): this;
    once(event: string | symbol, listener: (...args: any[]) => unknown): this;
    removeListener(event: string | symbol, listener: (...args: any[]) => unknown): this;
    emit(event: string | symbol, ...args: any[]): boolean;
  }
}

declare module 'node:https' {
  export class Server {
    listen(...args: unknown[]): this;
    close(callback?: (err?: Error) => void): void;
  }
  export interface ServerOptions {
    [key: string]: unknown;
  }
}

declare module 'node:net' {
  export interface AddressInfo {
    address: string;
    family: string;
    port: number;
  }
  export class Server {
    listen(...args: unknown[]): this;
    close(callback?: (err?: Error) => void): void;
    address(): string | AddressInfo | null;
  }
  export class Socket {
    write(data: unknown): void;
    end(data?: unknown): void;
  }
}

declare module 'node:stream' {
  export class Stream {
    pipe<T extends Stream>(destination: T, options?: { end?: boolean }): T;
  }
  export interface DuplexOptions {
    allowHalfOpen?: boolean;
  }
  export class Duplex extends Stream {
    read(size?: number): unknown;
    write(chunk: unknown, encoding?: string, callback?: (error?: Error | null) => void): boolean;
  }
}

declare module 'node:tls' {
  export interface SecureContextOptions {
    [key: string]: unknown;
  }
}

declare module 'node:url' {
  export class URL {
    constructor(input: string, base?: string | URL);
    toString(): string;
  }
}

declare module 'node:zlib' {
  export interface ZlibOptions {
    [key: string]: unknown;
  }
}

declare module 'http' {
  export { Agent, ClientRequest, ClientRequestArgs, OutgoingHttpHeaders, ServerResponse, IncomingMessage, Server } from 'node:http';
}

declare namespace fs {
  type Stats = import('node:fs').Stats;
  type FSWatcher = import('node:fs').FSWatcher;
}

declare namespace http {
  type IncomingMessage = import('node:http').IncomingMessage;
  type ServerResponse = import('node:http').ServerResponse;
  type Server = import('node:http').Server;
}

declare namespace NodeJS {
  interface EventEmitter<T = any> {
    addListener(event: string | symbol, listener: (...args: any[]) => unknown): this;
    on(event: string | symbol, listener: (...args: any[]) => unknown): this;
    once(event: string | symbol, listener: (...args: any[]) => unknown): this;
    removeListener(event: string | symbol, listener: (...args: any[]) => unknown): this;
  }
}

type Buffer = Uint8Array & { length: number };
declare const Buffer: Buffer;

declare module '@opentelemetry/api' {
  export interface Span {
    end(): void;
  }
}
