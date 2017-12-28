'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (sequelize, DataTypes) {
  var Channel = sequelize.define('channel', {
    name: DataTypes.STRING,
    public: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });

  Channel.associate = function (models) {
    // 1:M
    Channel.belongsTo(models.Team, {
      foreignKey: {
        name: 'teamId',
        field: 'team_id'
      }
    });
    // N:M
    Channel.belongsToMany(models.User, {
      through: 'channel_member',
      foreignKey: {
        name: 'channelId',
        field: 'channel_id'
      }
    });
  };

  return Channel;
};