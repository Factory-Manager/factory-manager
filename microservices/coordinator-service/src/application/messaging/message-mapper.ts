/**
 * Interface for mapping messages from a specific topic to a desired type.
 * @template T The type to which the message will be mapped.
 */
export interface MessageMapper<T> {
  /**
   * Transforms a message from a specific topic into the desired type.
   * @param topic The topic from which the message was received.
   * @param message The message to be transformed, represented as a Buffer.
   */
  map(topic: string, message: Buffer): T
}
