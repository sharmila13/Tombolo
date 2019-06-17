'use strict';
module.exports = (sequelize, DataTypes) => {
  const index_payload = sequelize.define('index_payload', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false
    },
    index_id: DataTypes.STRING,
    application_id: DataTypes.STRING,
    ColumnLabel: DataTypes.STRING,
    ColumnType: DataTypes.STRING,
    ColumnEclType: DataTypes.STRING
  }, {freezeTableName: true});
  index_payload.associate = function(models) {
    // associations can be defined here
  };
  return index_payload;
};