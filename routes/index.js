// contains prior code
const Activation = require('../models/activation');
const User = require('../models/user');
const assert = require('assert');
const uuid = require('uuid/v4');
const { knex } = require('../database/index');
const gmail = require('gmail-send');

const gmailSend = gmail({
  user: process.env.MAILER_EMAIL,
  pass: process.env.MAILER_PASSWORD,
  from: process.env.MAILER_EMAIL,
});

const register = async(req, res) => {
  const {
    email,
    username
  } = req.body;


  const existingUser = await User.query()
    .where(knex.raw('LOWER(users.username)'), '=', username.toLowerCase())
    .orWhere(knex.raw('LOWER(users.email)'), '=', email.toLowerCase())
    .first();

  if (existingUser) {
    return res.send('User already exists');
  }

  const user = await User.query().insert({
    email,
    username
  });

  await sendActivationEmail(user);
  
  return res.send('Success. We created your account. Check your email.');
};

const sendActivationEmail = (user) => {
  return new Promise(async(resolve, reject) => {
    assert(user.id && user.email, 'Invalid user');
    const activation = await Activation.query().insertAndFetch({
      token: uuid(),
      userId: user.id,
    });

    const msg = {
      to: user.email,
      subject: 'User Activation',
      text: `Please activate your account by clicking the following link:
           ${process.env.SITE_URL || 'http://localhost'}/activate/${activation.token}`,
    };

    gmailSend(msg, function(err, res) {
      if (err) {
        reject();
      }
      else { 
        resolve();
      }
    });
  });
};

const activate = async(req, res) => {
  const { token } = req.params;

  const activation = await Activation.query()
    .eager('user')
    .whereRaw('user_activations.created_at >= (now() - interval \'1 hour\')')
    .andWhere({ token })
    .first();

  if (!activation || !activation.user || activation.user.active) {
    throw new Error('User already active');
  }

  await User.query()
    .patch({ active: true, activatedAt: new Date() })
    .where('id', activation.user.id);

  res.send('User was activated');
};

const login = async(req, res) => {
  const email = req.body.email && req.body.email.toLowerCase();
  const username = req.body.username && req.body.username.toLowerCase();

  const user = await User.query()
    .where(knex.raw('LOWER(email)'), '=', email)
    .orWhere(knex.raw('LOWER(username)'), '=', username)
    .first();

  if (user && user.active) {
    return res.send('User was found and active');
  }
  else if (user && !user.active) {
    return res.send('User was found but not active');
  }
  else {
    return res.send('User was not found');
  }
};

module.exports = {
  register,
  activate,
  login
};
