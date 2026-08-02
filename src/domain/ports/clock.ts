export interface Clock {
  /** Instant courant au format ISO 8601. */
  now(): string;
}
