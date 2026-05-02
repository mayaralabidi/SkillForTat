CREATE DATABASE IF NOT EXISTS skillfortat;
USE skillfortat;

CREATE TABLE IF NOT EXISTS users (
  id            CHAR(36)      NOT NULL PRIMARY KEY,
  username      VARCHAR(50)   NOT NULL UNIQUE,
  email         VARCHAR(255)  NOT NULL UNIQUE,
  password_hash TEXT          NOT NULL,
  bio           TEXT          DEFAULT NULL,
  created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS offers (
  id         CHAR(36)                                        NOT NULL PRIMARY KEY,
  user_id    CHAR(36)                                        NOT NULL,
  teaches    VARCHAR(100)                                    NOT NULL,
  wants      VARCHAR(100)                                    NOT NULL,
  level      ENUM('beginner','intermediate','advanced')      NOT NULL DEFAULT 'beginner',
  is_active  BOOLEAN                                         NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP                                       DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_teaches (teaches),
  INDEX idx_wants   (wants),
  INDEX idx_user    (user_id)
);

CREATE TABLE IF NOT EXISTS matches (
  id          CHAR(36)                                NOT NULL PRIMARY KEY,
  offer_a_id  CHAR(36)                                NOT NULL,
  offer_b_id  CHAR(36)                                NOT NULL,
  match_type  ENUM('exact','partial')                 NOT NULL,
  status      ENUM('pending','accepted','declined')   NOT NULL DEFAULT 'pending',
  created_at  TIMESTAMP                               DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (offer_a_id) REFERENCES offers(id) ON DELETE CASCADE,
  FOREIGN KEY (offer_b_id) REFERENCES offers(id) ON DELETE CASCADE,
  UNIQUE KEY unique_pair (offer_a_id, offer_b_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id         CHAR(36)   NOT NULL PRIMARY KEY,
  match_id   CHAR(36)   NOT NULL,
  sender_id  CHAR(36)   NOT NULL,
  body       TEXT       NOT NULL,
  sent_at    TIMESTAMP  DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (match_id)  REFERENCES matches(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id)   ON DELETE CASCADE,
  INDEX idx_match (match_id)
);