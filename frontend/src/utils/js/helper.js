export const cleanMessages = (msgs, mode) => {
  /* Takes in an array of message objects and converts them to the format required for a chat message */

  return msgs.map((msg) => ({
    createdAt: msg.createdAt,
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
    channel: mode === 'dm' ? msg.roomId : msg.channel,
    messageBody: msg.messageContent,
    sender: {
      firstName: msg.Sender.firstName,
      lastName: msg.Sender.lastName,
      avatarUrl: msg.Sender.avatarUrl,
    },
    messageId: msg.id,
    isThread: msg.replyCount > 0,
    parentMessageId: msg.parentMessageId,
    attachments: msg.attachments,
  }));
};

export const processAttachments = async (files) => {
  const filePromises = Array.from(files).map((file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () =>
        resolve({
          name: file.name,
          mimeType: file.type,
          base64: reader.result.split(',')[1], // Strip off the data:*/*;base64, part
        });
      reader.readAsDataURL(file);
    });
  });

  return await Promise.all(filePromises);
};

export const insertAndSortMessages = (messagesArray) => {
  return [...messagesArray].sort(
    (a, b) =>
      new Date(a.createdAt || a.sentAt) - new Date(b.createdAt || b.sentAt)
  );
};
