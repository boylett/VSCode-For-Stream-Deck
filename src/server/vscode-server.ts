import streamDeck from '@elgato/streamdeck';
import { WebSocket, WebSocketServer } from 'ws';
import type { IncomingMessage } from 'node:http';
import { type Envelope, type PluginToExtensionMessage, SESSION_HEADER } from '../protocol/messages.js';

/** Default port the extension connects to */
export const DEFAULT_PORT = 48_969;

/** Default host the bridge binds to (loopback only) */
export const DEFAULT_HOST = '127.0.0.1';

const logger = streamDeck.logger.createScope('VSCodeServer');

interface Client {
  socket: WebSocket;
  sessionId: string;
}

/**
 * WebSocket server that bridges Stream Deck actions to one or more VS Code
 * windows
 *
 * Each connecting VS Code window passes its session identifier in the
 * `X-VSSessionID` header. The server keeps track of all open windows and
 * forwards messages to whichever one is currently flagged as active. The
 * extension itself owns the active-session decision; this server only
 * relays the broadcast that announces the change.
 */
export class VSCodeServer {
  private wss: WebSocketServer | null = null;
  private clients = new Map<WebSocket, Client>();
  private activeSessionId: string | null = null;

  /**
   * Starts the WebSocket server on the given host and port
   *
   * @param host - Interface to bind to
   * @param port - Port to bind to
   */
  start(host: string = DEFAULT_HOST, port: number = DEFAULT_PORT): void {
    if (this.wss) {
      return;
    }

    this.wss = new WebSocketServer({ host, port });
    logger.info(`Listening on ws://${ host }:${ port }`);

    this.wss.on('connection', (socket, request) => this.handleConnection(socket, request));

    this.wss.on('error', (err) => {
      logger.error(`Server error: ${ err }`);
    });
  }

  /**
   * Stops the WebSocket server and disconnects every client
   */
  stop(): void {
    for (const { socket } of this.clients.values()) {
      socket.terminate();
    }

    this.clients.clear();
    this.activeSessionId = null;

    this.wss?.close();
    this.wss = null;
  }

  /**
   * Sends a message to the currently active VS Code window
   *
   * If no window is active, the message is dropped and a warning is logged
   *
   * @param message - The message to send
   */
  send(message: PluginToExtensionMessage): boolean {
    const target = this.findActiveClient();

    if (!target) {
      logger.warn(`No active VS Code window — dropping ${ message.id }`);

      return false;
    }

    const envelope: Envelope = {
      id: message.id,
      data: JSON.stringify(message.payload),
    };

    target.socket.send(JSON.stringify(envelope));

    return true;
  }

  get isConnected(): boolean {
    return this.clients.size > 0;
  }

  get hasActiveSession(): boolean {
    return this.findActiveClient() !== null;
  }

  private handleConnection(socket: WebSocket, request: IncomingMessage): void {
    const sessionId = request.headers[SESSION_HEADER.toLowerCase()] as string | undefined;

    if (!sessionId) {
      logger.warn('Rejecting connection without session header');
      socket.close(1008, 'Missing X-VSSessionID header');

      return;
    }

    logger.info(`VS Code window connected (${ sessionId })`);
    this.clients.set(socket, { socket, sessionId });

    if (this.clients.size === 1) {
      this.setActiveSession(sessionId);
    }

    else {
      this.broadcastActiveSession();
    }

    socket.on('message', (data) => this.handleMessage(socket, data.toString()));
    socket.on('close', () => this.handleDisconnect(socket));

    socket.on('error', (err) => {
      logger.error(`Socket error: ${ err }`);
    });
  }

  private handleMessage(socket: WebSocket, raw: string): void {
    let envelope: Envelope;

    try {
      envelope = JSON.parse(raw) as Envelope;
    }

    catch (err) {
      logger.warn(`Unparseable message: ${ err }`);

      return;
    }

    if (envelope.id === 'ChangeActiveSessionMessage') {
      const payload = JSON.parse(envelope.data) as { sessionId: string };
      this.setActiveSession(payload.sessionId);
    }
  }

  private handleDisconnect(socket: WebSocket): void {
    const client = this.clients.get(socket);

    if (!client) {
      return;
    }

    logger.info(`VS Code window disconnected (${ client.sessionId })`);
    this.clients.delete(socket);

    if (this.activeSessionId === client.sessionId) {
      const next = this.clients.values().next().value;
      this.activeSessionId = next?.sessionId ?? null;
    }

    this.broadcastActiveSession();
  }

  private setActiveSession(sessionId: string): void {
    this.activeSessionId = sessionId;
    this.broadcastActiveSession();
  }

  private broadcastActiveSession(): void {
    if (!this.activeSessionId) {
      return;
    }

    const envelope: Envelope = {
      id: 'ActiveSessionChangedMessage',
      data: JSON.stringify({ sessionId: this.activeSessionId }),
    };

    const payload = JSON.stringify(envelope);

    for (const { socket } of this.clients.values()) {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(payload);
      }
    }
  }

  private findActiveClient(): Client | null {
    if (!this.activeSessionId) {
      return null;
    }

    for (const client of this.clients.values()) {
      if (client.sessionId === this.activeSessionId) {
        return client;
      }
    }

    return null;
  }
}

/** Singleton shared across every action instance */
export const vscodeServer = new VSCodeServer();
