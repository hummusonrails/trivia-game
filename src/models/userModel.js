class User {
    constructor(phoneNumber, score = 0, joinedAt = new Date().toISOString()) {
      this.phoneNumber = phoneNumber;
      this.score = score;
      this.joinedAt = joinedAt;
      this.type = 'user';
    }
  }
  
  module.exports = User;
  