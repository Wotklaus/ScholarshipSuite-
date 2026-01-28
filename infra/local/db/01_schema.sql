CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================
-- 1) Roles
-- =========================================================
CREATE TABLE roles (
  id   UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE
);

-- =========================================================
-- 2) Faculties
-- =========================================================
CREATE TABLE faculties (
  id   UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE
);

-- =========================================================
-- 3) Careers
-- =========================================================
CREATE TABLE careers (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  faculty_id UUID NOT NULL REFERENCES faculties(id) ON DELETE RESTRICT,
  name       VARCHAR NOT NULL,
  UNIQUE (faculty_id, name)
);

-- =========================================================
-- 4) Scholarship Types
-- =========================================================
CREATE TABLE scholarship_types (
  id   UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE
);

-- =========================================================
-- 5) Users
-- =========================================================
CREATE TABLE users (
  id             UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  identification VARCHAR UNIQUE NOT NULL,
  first_name     VARCHAR NOT NULL,
  last_name      VARCHAR NOT NULL,
  email          VARCHAR UNIQUE NOT NULL,
  password       VARCHAR NOT NULL,
  role_id        UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  is_active      BOOLEAN DEFAULT TRUE
);

-- =========================================================
-- 6) Scholars (subtipo de user)
-- =========================================================
CREATE TABLE scholars (
  id                  UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  faculty_id          UUID NOT NULL REFERENCES faculties(id) ON DELETE RESTRICT,
  career_id           UUID NOT NULL REFERENCES careers(id) ON DELETE RESTRICT,
  gpa                 DECIMAL(5,2) NOT NULL,
  scholarship_type_id UUID NOT NULL REFERENCES scholarship_types(id) ON DELETE RESTRICT,
  phone               VARCHAR NOT NULL,
  status              VARCHAR NOT NULL
);

-- =========================================================
-- 7) Contract Templates
-- =========================================================
CREATE TABLE contract_templates (
  id                  UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  scholarship_type_id UUID NOT NULL REFERENCES scholarship_types(id) ON DELETE RESTRICT,
  structure           JSONB NOT NULL
);

-- =========================================================
-- 8) Contracts (REFactorizado)
--    - periodo ahora es START/END
--    - scholarship_amount en el contrato
--    - created_at por defecto
-- =========================================================
CREATE TABLE contracts (
  id                    UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id               UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  template_id           UUID NOT NULL REFERENCES contract_templates(id) ON DELETE RESTRICT,

  academic_period_start DATE NOT NULL,
  academic_period_end   DATE NOT NULL,

  official_number       VARCHAR UNIQUE NOT NULL,
  scholarship_amount    NUMERIC(10,2) NOT NULL,

  budget_item           VARCHAR NOT NULL,
  status                VARCHAR CHECK (status IN ('pending', 'signed', 'rejected')) NOT NULL,

  blockchain_hash       VARCHAR NOT NULL,

  file                  BYTEA, -- (opcional) puedes dejar NULL hasta que lo firmes/guardes

  created_at            TIMESTAMP NOT NULL DEFAULT now(),

  CONSTRAINT chk_period_valid CHECK (academic_period_end >= academic_period_start)
);

-- =========================================================
-- 9) Banks (catálogo)
-- =========================================================
CREATE TABLE banks (
  id   UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE
);

-- =========================================================
-- 10) Bank Accounts (ANTES era "banks" con cuentas)
-- =========================================================
CREATE TABLE bank_accounts (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bank_id         UUID NOT NULL REFERENCES banks(id) ON DELETE RESTRICT,

  account_type    VARCHAR(20) NOT NULL,           -- AHORROS / CORRIENTE
  account_number  VARCHAR NOT NULL UNIQUE,
  holder_name     VARCHAR NOT NULL,               -- titular de la cuenta (firma)

  created_at      TIMESTAMP NOT NULL DEFAULT now()
);

-- =========================================================
-- 11) Documents
--    Ahora apunta a bank_accounts (cuenta validada por certificado)
-- =========================================================
CREATE TABLE documents (
  id                 UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id            UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  bank_account_id    UUID REFERENCES bank_accounts(id) ON DELETE SET NULL,

  type               VARCHAR CHECK (type IN ('bank_certificate', 'other')) NOT NULL,
  file               BYTEA NOT NULL,

  validation_status  VARCHAR CHECK (validation_status IN ('pending', 'validated', 'rejected')) NOT NULL,

  created_at         TIMESTAMP NOT NULL DEFAULT now()
);

-- =========================================================
-- 12) Notifications
-- =========================================================
CREATE TABLE notifications (
  id      UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type    VARCHAR CHECK (type IN ('email', 'SMS', 'push')) NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP NOT NULL
);

-- =========================================================
-- 13) Access Logs
-- =========================================================
CREATE TABLE access_logs (
  id        UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action    VARCHAR NOT NULL,
  details   TEXT,
  timestamp TIMESTAMP NOT NULL DEFAULT now()
);

-- =========================================================
-- Índices recomendados (performance)
-- =========================================================
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_scholars_faculty ON scholars(faculty_id);
CREATE INDEX idx_scholars_career ON scholars(career_id);
CREATE INDEX idx_contracts_user ON contracts(user_id);
CREATE INDEX idx_documents_user ON documents(user_id);
CREATE INDEX idx_documents_validation ON documents(validation_status);
CREATE INDEX idx_bank_accounts_user ON bank_accounts(user_id);


-- Tabla para guardar metadatos del certificado bancario subido
CREATE TABLE IF NOT EXISTS bank_certificates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  identification VARCHAR NOT NULL,
  bank_name VARCHAR NOT NULL,
  account_type VARCHAR(20) NOT NULL,
  account_number VARCHAR NOT NULL,
  holder_name VARCHAR NOT NULL,
  file_path VARCHAR NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bank_certificates_user_id ON bank_certificates(user_id);

-- =========================================================
-- 14) Contract Signatures (NEW)
-- =========================================================
CREATE TABLE contract_signatures (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

  contract_id UUID NOT NULL
    REFERENCES contracts(id)
    ON DELETE CASCADE,

  user_id UUID NOT NULL
    REFERENCES users(id)
    ON DELETE CASCADE,

  method VARCHAR(20) NOT NULL
    CHECK (method IN ('ELECTRONIC', 'MANUAL')),

  status VARCHAR(20) NOT NULL
    CHECK (status IN ('PENDING', 'SIGNED', 'DECLINED'))
    DEFAULT 'PENDING',

  provider VARCHAR NOT NULL DEFAULT 'MOCK',

  challenge_code VARCHAR,
  signature_hash VARCHAR,

  signed_at TIMESTAMP,

  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Índices recomendados
CREATE INDEX idx_contract_signatures_contract ON contract_signatures(contract_id);
CREATE INDEX idx_contract_signatures_user ON contract_signatures(user_id);
CREATE INDEX idx_contract_signatures_status ON contract_signatures(status);
