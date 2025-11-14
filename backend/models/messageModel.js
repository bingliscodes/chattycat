import { DataTypes } from 'sequelize';

import sequelize from '../utils/database.js';

const Message = sequelize.define('message', {
  messageContent: {
    type: DataTypes.STRING,
  },
});

export default Message;
