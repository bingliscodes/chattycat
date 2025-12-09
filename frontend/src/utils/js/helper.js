export const cleanMessages = (msgs) => {
  /* Takes in an array of message objects and converts them to the format required for a chat message */

  return msgs.map((msg) => ({
    datestamp: new Date(msg.createdAt).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    timestamp: new Date(msg.createdAt).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }),
    messageBody: msg.messageContent,
    sender: { firstName: msg.Sender.firstName, lastName: msg.Sender.lastName },
    messageId: msg.id,
  }));
};
