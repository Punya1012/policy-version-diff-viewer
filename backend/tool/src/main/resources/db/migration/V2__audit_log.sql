CREATE TABLE IF NOT EXISTS audit_log (
                                         id BIGSERIAL PRIMARY KEY,
                                         action VARCHAR(50) NOT NULL,
    entity_name VARCHAR(100) NOT NULL,
    entity_id BIGINT,
    old_value TEXT,
    new_value TEXT,
    performed_by VARCHAR(100),
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(50)
    );

CREATE INDEX IF NOT EXISTS idx_audit_action
    ON audit_log(action);

CREATE INDEX IF NOT EXISTS idx_audit_performed_at
    ON audit_log(performed_at);

CREATE INDEX IF NOT EXISTS idx_audit_entity_id
    ON audit_log(entity_id);