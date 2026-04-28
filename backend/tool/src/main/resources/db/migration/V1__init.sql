CREATE TABLE policy_version (
                                id BIGSERIAL PRIMARY KEY,
                                title VARCHAR(255) NOT NULL,
                                version_number VARCHAR(50) NOT NULL,
                                status VARCHAR(50) NOT NULL,
                                content TEXT,
                                created_by VARCHAR(100),
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_policy_status ON policy_version(status);
CREATE INDEX idx_policy_created_at ON policy_version(created_at);