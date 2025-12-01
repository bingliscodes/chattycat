// Helper functions to create the DirectMessageRoom from two user ids.
import { DirectMessageRoom } from '../models/messageModel.js';

function normalizeUserPair(id1, id2) {
  return id1.localeCompare(id2) < 0 ? [id1, id2] : [id2, id1];
}

export async function findOrCreateDMRoom(userAId, userBId) {
  const [user1Id, user2Id] = normalizeUserPair(userAId, userBId);

  const [room] = await DirectMessageRoom.findOrCreate({
    where: { user1Id, user2Id },
  });

  return room;
}
