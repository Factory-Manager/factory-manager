import { InboxMessage } from '@/infrastructure/persistence/sqlite/models/inbox-message'

/**
 * Interface for processing messages based on their topic.
 */
export interface MessageProcessor {
  /**
   * Checks if the processor can handle a message for the given topic.
   * @param topic The topic of the message.
   * @returns True if the processor can handle the message, false otherwise.
   */
  canHandle(topic: string): boolean

  /**
   * Processes the incoming message.
   * @param inboxMessage  The inbox message to be processed.
   */
  process(inboxMessage: InboxMessage): void
}
