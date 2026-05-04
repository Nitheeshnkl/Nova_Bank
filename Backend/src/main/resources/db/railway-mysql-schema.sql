-- NovaBank Railway MySQL schema.
-- Run this against the Railway MySQL database before deploying the Render backend.

SET FOREIGN_KEY_CHECKS = 0;
DROP VIEW IF EXISTS v_payments;
DROP VIEW IF EXISTS v_transaction_history;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    token VARCHAR(255),
    code VARCHAR(255),
    verified INT NOT NULL DEFAULT 0,
    verified_at DATE NULL,
    create_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS accounts (
    account_id INT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    account_number VARCHAR(255) NOT NULL,
    account_name VARCHAR(255),
    account_type VARCHAR(255),
    balance DECIMAL(19,2) NOT NULL DEFAULT 0.00,
    create_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (account_id),
    UNIQUE KEY uk_accounts_account_number (account_number),
    KEY idx_accounts_user_id (user_id),
    CONSTRAINT fk_accounts_user_id
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS transaction_history (
    transaction_id INT NOT NULL AUTO_INCREMENT,
    account_id INT NOT NULL,
    transaction_type VARCHAR(255),
    amount DOUBLE NOT NULL DEFAULT 0,
    source VARCHAR(255),
    status VARCHAR(255),
    reason_code VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (transaction_id),
    KEY idx_transaction_history_account_id (account_id),
    CONSTRAINT fk_transaction_history_account_id
        FOREIGN KEY (account_id) REFERENCES accounts (account_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS payments (
    payment_id INT NOT NULL AUTO_INCREMENT,
    account_id INT NOT NULL,
    beneficiary VARCHAR(255),
    beneficiary_acc_no VARCHAR(255),
    amount DOUBLE NOT NULL DEFAULT 0,
    reference_no VARCHAR(255),
    status VARCHAR(255),
    reason_code VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (payment_id),
    KEY idx_payments_account_id (account_id),
    CONSTRAINT fk_payments_account_id
        FOREIGN KEY (account_id) REFERENCES accounts (account_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE OR REPLACE VIEW v_transaction_history AS
SELECT
    th.transaction_id,
    th.account_id,
    a.user_id,
    th.transaction_type,
    th.amount,
    th.source,
    th.status,
    th.reason_code,
    th.created_at
FROM transaction_history th
JOIN accounts a ON a.account_id = th.account_id;

CREATE OR REPLACE VIEW v_payments AS
SELECT
    p.payment_id,
    p.account_id,
    a.user_id,
    p.beneficiary,
    p.beneficiary_acc_no,
    p.amount,
    p.reference_no,
    p.status,
    p.reason_code,
    p.created_at
FROM payments p
JOIN accounts a ON a.account_id = p.account_id;

-- Non-destructive repair statements for existing Railway tables.
-- Uncomment only the missing columns/keys you confirm with SHOW COLUMNS/SHOW INDEX.
-- If your MySQL version rejects IF NOT EXISTS, remove that phrase after confirming
-- the column/key is missing.

-- ALTER TABLE users ADD COLUMN IF NOT EXISTS id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(255);
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(255);
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255);
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255);
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS token VARCHAR(255);
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS code VARCHAR(255);
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS verified INT NOT NULL DEFAULT 0;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS verified_at DATE NULL;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS create_at DATETIME DEFAULT CURRENT_TIMESTAMP;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- ALTER TABLE accounts ADD COLUMN IF NOT EXISTS account_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST;
-- ALTER TABLE accounts ADD COLUMN IF NOT EXISTS user_id BIGINT NOT NULL;
-- ALTER TABLE accounts ADD COLUMN IF NOT EXISTS account_number VARCHAR(255) NOT NULL;
-- ALTER TABLE accounts ADD COLUMN IF NOT EXISTS account_name VARCHAR(255);
-- ALTER TABLE accounts ADD COLUMN IF NOT EXISTS account_type VARCHAR(255);
-- ALTER TABLE accounts ADD COLUMN IF NOT EXISTS balance DECIMAL(19,2) NOT NULL DEFAULT 0.00;
-- ALTER TABLE accounts ADD COLUMN IF NOT EXISTS create_at DATETIME DEFAULT CURRENT_TIMESTAMP;
-- ALTER TABLE accounts ADD COLUMN IF NOT EXISTS updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- ALTER TABLE transaction_history ADD COLUMN IF NOT EXISTS transaction_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST;
-- ALTER TABLE transaction_history ADD COLUMN IF NOT EXISTS account_id INT NOT NULL;
-- ALTER TABLE transaction_history ADD COLUMN IF NOT EXISTS transaction_type VARCHAR(255);
-- ALTER TABLE transaction_history ADD COLUMN IF NOT EXISTS amount DOUBLE NOT NULL DEFAULT 0;
-- ALTER TABLE transaction_history ADD COLUMN IF NOT EXISTS source VARCHAR(255);
-- ALTER TABLE transaction_history ADD COLUMN IF NOT EXISTS status VARCHAR(255);
-- ALTER TABLE transaction_history ADD COLUMN IF NOT EXISTS reason_code VARCHAR(255);
-- ALTER TABLE transaction_history ADD COLUMN IF NOT EXISTS created_at DATETIME DEFAULT CURRENT_TIMESTAMP;

-- ALTER TABLE payments ADD COLUMN IF NOT EXISTS payment_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST;
-- ALTER TABLE payments ADD COLUMN IF NOT EXISTS account_id INT NOT NULL;
-- ALTER TABLE payments ADD COLUMN IF NOT EXISTS beneficiary VARCHAR(255);
-- ALTER TABLE payments ADD COLUMN IF NOT EXISTS beneficiary_acc_no VARCHAR(255);
-- ALTER TABLE payments ADD COLUMN IF NOT EXISTS amount DOUBLE NOT NULL DEFAULT 0;
-- ALTER TABLE payments ADD COLUMN IF NOT EXISTS reference_no VARCHAR(255);
-- ALTER TABLE payments ADD COLUMN IF NOT EXISTS status VARCHAR(255);
-- ALTER TABLE payments ADD COLUMN IF NOT EXISTS reason_code VARCHAR(255);
-- ALTER TABLE payments ADD COLUMN IF NOT EXISTS created_at DATETIME DEFAULT CURRENT_TIMESTAMP;

-- Run these only if the constraints/indexes do not already exist:
-- ALTER TABLE users ADD UNIQUE KEY uk_users_email (email);
-- ALTER TABLE accounts ADD UNIQUE KEY uk_accounts_account_number (account_number);
-- ALTER TABLE accounts ADD KEY idx_accounts_user_id (user_id);
-- ALTER TABLE transaction_history ADD KEY idx_transaction_history_account_id (account_id);
-- ALTER TABLE payments ADD KEY idx_payments_account_id (account_id);
-- ALTER TABLE accounts
--     ADD CONSTRAINT fk_accounts_user_id
--     FOREIGN KEY (user_id) REFERENCES users (id)
--     ON DELETE CASCADE ON UPDATE CASCADE;
-- ALTER TABLE transaction_history
--     ADD CONSTRAINT fk_transaction_history_account_id
--     FOREIGN KEY (account_id) REFERENCES accounts (account_id)
--     ON DELETE CASCADE ON UPDATE CASCADE;
-- ALTER TABLE payments
--     ADD CONSTRAINT fk_payments_account_id
--     FOREIGN KEY (account_id) REFERENCES accounts (account_id)
--     ON DELETE CASCADE ON UPDATE CASCADE;
