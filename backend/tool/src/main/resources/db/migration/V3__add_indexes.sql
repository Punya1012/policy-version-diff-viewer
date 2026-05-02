CREATE INDEX IF NOT EXISTS idx_policy_is_deleted
    ON policy_version(is_deleted);

CREATE INDEX IF NOT EXISTS idx_policy_title
    ON policy_version(title);

CREATE INDEX IF NOT EXISTS idx_policy_status_deleted
    ON policy_version(status, is_deleted);

CREATE INDEX IF NOT EXISTS idx_audit_entity_name
    ON audit_log(entity_name);

CREATE INDEX IF NOT EXISTS idx_audit_performed_by
    ON audit_log(performed_by);