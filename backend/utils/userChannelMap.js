import User from '../models/userModel.js';
import Channel from '../models/channelModel.js';

class UserChannelMap {
  constructor() {
    this.data = new Map();

    this.init();
  }

  async init() {
    const users = await User.findAll({
      include: [
        {
          model: Channel,
          as: 'Channels', // REQUIRED
        },
      ],
    });

    users.forEach((usr) => {
      const channels = usr.Channels.map((ch) => ch.id);
      this.data.set(usr.id, channels);
    });
  }

  addUser(userId) {
    this.data.set(userId, []);
  }

  ensureUser(userId) {
    if (!this.data.has(userId)) {
      this.data.set(userId, []);
    }
  }

  addChannel(userId, channelId) {
    this.ensureUser(userId);

    const channels = this.data.get(userId);
    if (!channels.includes(channelId)) {
      channels.push(channelId); // Directly modify, since arrays are by reference
    }
  }

  removeChannel(userId, channelId) {
    this.ensureUser(userId);
    this.data.set(
      userId,
      this.data.get(userId).filter((ch) => ch !== channelId),
    );
  }
}

export default new UserChannelMap();
