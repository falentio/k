BEGIN;

CREATE TABLE IF NOT EXISTS app_user (
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
	last_login TIMESTAMP NOT NULL DEFAULT NOW(),

	id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	username VARCHAR(32) UNIQUE NOT NULL,
	password VARCHAR NOT NULL,
	level VARCHAR(16) DEFAULT 'user'
);

CREATE INDEX IF NOT EXISTS user_username ON app_user(username);

CREATE TABLE IF NOT EXISTS shortener (
	user_id INTEGER,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

	slug VARCHAR(256) PRIMARY KEY,
	target VARCHAR(2024) NOT NULL,

	CONSTRAINT user_fk FOREIGN KEY(user_id) REFERENCES app_user(id)
);

CREATE INDEX IF NOT EXISTS shortener_id ON shortener(slug);
CREATE INDEX IF NOT EXISTS shortener_id_user_id ON shortener(slug, user_id);

CREATE TABLE IF NOT EXISTS shortener_click (
	shortener_id VARCHAR(32) NOT NULL,
	created_at DATE NOT NULL DEFAULT NOW(),

	CONSTRAINT shortener_fk FOREIGN KEY(shortener_id) REFERENCES shortener(slug)
);

CREATE INDEX IF NOT EXISTS shortener_click_id ON shortener_click(shortener_id);

INSERT INTO app_user(username, password, level) VALUES('admin', '$2a$10$vxrZ9KA1PZLLvjBhqSnpn.rj5p0khbEHG/SDfxR89fMnj.eIYPhD.', 'admin');

COMMIT;