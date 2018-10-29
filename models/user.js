// Prior coded file
const { Model } = require('../database/index');

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get timestamp() {
    return true;
  }

  static get relationMappings() {
    return {
      activation: {
        relation: Model.HasOneRelation,
        modelClass: `${__dirname}/activation`,
        join: {
          from: 'users.id',
          to: 'user_activations.userId',
        },
      }
    };
  }
}

module.exports = User;