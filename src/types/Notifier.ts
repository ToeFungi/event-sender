import { ScheduledMessage } from './ScheduledMessage'

/**
 * Representation of a notifiers public interface
 */
interface Notifier {
  notify(message: ScheduledMessage): Promise<void>
}

export { Notifier }
