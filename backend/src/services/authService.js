const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("../config/env");
const AppError = require("../utils/AppError");
const userRepository = require("../repositories/userRepository");

const BCRYPT_ROUNDS = 10;

const issueToken = (user) =>
  jwt.sign(
    { sub: user.id, username: user.username },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn }
  );

const publicUser = (u) => ({
  id:          u.id,
  username:    u.username,
  email:       u.email,
  displayName: u.display_name,
  avatarUrl:   u.avatar_url,
  bio:         u.bio,
});

const register = async ({ username, password, email, displayName }) => {
  const existing = await userRepository.findByUsername(username);
  if (existing) throw AppError.conflict("Ese nombre de usuario ya está en uso.");

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const created = await userRepository.create({ username, passwordHash, email, displayName });
  const token = issueToken(created);
  return { user: publicUser(created), token };
};

const login = async ({ username, password }) => {
  const user = await userRepository.findByUsername(username);
  if (!user) throw AppError.unauthorized("Credenciales incorrectas.");

  // Legacy migrated users carry the literal old password prefixed; force reset.
  if (user.password_hash.startsWith("legacy$")) {
    throw AppError.unauthorized(
      "Tu cuenta fue migrada al nuevo sistema. Regístrate de nuevo o solicita restablecer la contraseña."
    );
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) throw AppError.unauthorized("Credenciales incorrectas.");

  const token = issueToken(user);
  return { user: publicUser(user), token };
};

const me = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) throw AppError.notFound("Usuario no encontrado.");
  return publicUser({
    ...user,
    display_name: user.display_name,
    avatar_url:   user.avatar_url,
  });
};

module.exports = { register, login, me, issueToken };
