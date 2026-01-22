-- =========================================================
-- SEED / DATOS INICIALES (ORDENADO POR DEPENDENCIAS FK)
-- =========================================================

-- =========================================================
-- 1) ROLES
-- =========================================================
INSERT INTO roles (id, name)
VALUES
('11111111-1111-1111-1111-111111111111', 'Administrator'),
('22222222-2222-2222-2222-222222222222', 'Scholar')
ON CONFLICT DO NOTHING;

-- =========================================================
-- 2) SCHOLARSHIP TYPES
-- =========================================================
INSERT INTO scholarship_types (id, name)
VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Excellence'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Vulnerability')
ON CONFLICT DO NOTHING;

-- =========================================================
-- 3) FACULTIES (TODAS)
-- =========================================================
INSERT INTO faculties (id, name)
VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb001','Arquitectura y urbanismo'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb002','Artes'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb003','Ciencias administrativas'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb004','Ciencias Agrícolas'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb005','Ciencias Biológicas'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb006','Ciencias de la discapacidad, atención Pre hospitalaria y Desastres'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb007','Ciencias Económicas'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb008','Ciencias Médicas'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb009','Ciencias Psicológicas'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb010','Ciencias Químicas'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb011','Comunicación Sociales y Humanas'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb012','Comunicación Social'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb013','Cultura Física'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb014','Filosofía, Letras y Ciencias de la Educación'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb015','Ingeniería y Ciencias Aplicadas'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb020','Psicología')
ON CONFLICT DO NOTHING;

-- =========================================================
-- 4) CAREERS
-- =========================================================
INSERT INTO careers (id, faculty_id, name)
VALUES
('cccccccc-cccc-cccc-cccc-ccccccccc001','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb003','ADMINISTRACIÓN DE EMPRESAS - REDISEÑO'),
('cccccccc-cccc-cccc-cccc-ccccccccc002','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb015','SISTEMAS DE INFORMACIÓN'),
('cccccccc-cccc-cccc-cccc-ccccccccc020','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb020','PSICOLOGÍA CLÍNICA')
ON CONFLICT DO NOTHING;

-- =========================================================
-- 5) USERS
-- =========================================================
INSERT INTO users (id, identification, first_name, last_name, email, password, role_id, is_active)
VALUES
(
 '00000000-0000-0000-0000-000000000001',
 'admin-123','Admin','User','admin@example.com',
 '$2b$10$mzho3WgGpbPWI2Eey6MfSuog92YbR6HxwrPmccmr2JZZQHbMTwbHa',
 '11111111-1111-1111-1111-111111111111', TRUE
),
(
 '00000000-0000-0000-0000-000000000002',
 'scholar-123','Scholar','User','scholar@example.com',
 '$2b$10$mzho3WgGpbPWI2Eey6MfSuog92YbR6HxwrPmccmr2JZZQHbMTwbHa',
 '22222222-2222-2222-2222-222222222222', TRUE
),
(
 '00000000-0000-0000-0000-000000000003',
 '1725399743','NICOLAS ALEJANDRO','CAIZA GUACHI','nacaizag@uce.edu.ec',
 '$2b$10$mzho3WgGpbPWI2Eey6MfSuog92YbR6HxwrPmccmr2JZZQHbMTwbHa',
 '22222222-2222-2222-2222-222222222222', TRUE
),
(
 '00000000-0000-0000-0000-000000000020',
 '1725399834','JADIRA ESTEFANIA','CAIZA GUACHI','jadira.caiza@uce.edu.ec',
 '$2b$10$mzho3WgGpbPWI2Eey6MfSuog92YbR6HxwrPmccmr2JZZQHbMTwbHa',
 '22222222-2222-2222-2222-222222222222', TRUE
)
ON CONFLICT (id) DO NOTHING;

-- =========================================================
-- 6) SCHOLARS
-- =========================================================
INSERT INTO scholars (id, faculty_id, career_id, gpa, scholarship_type_id, phone, status)
VALUES
(
 '00000000-0000-0000-0000-000000000002',
 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb003',
 'cccccccc-cccc-cccc-cccc-ccccccccc001',
 9.50,'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1','0999999999','Active'
),
(
 '00000000-0000-0000-0000-000000000003',
 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb015',
 'cccccccc-cccc-cccc-cccc-ccccccccc002',
 9.50,'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1','0999999999','Active'
),
(
 '00000000-0000-0000-0000-000000000020',
 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb020',
 'cccccccc-cccc-cccc-cccc-ccccccccc020',
 9.50,'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1','0999999999','Active'
)
ON CONFLICT (id) DO NOTHING;

-- =========================================================
-- 7) BANKS
-- =========================================================
INSERT INTO banks (id, name)
VALUES
('dddddddd-dddd-dddd-dddd-ddddddddd001','BANCO PICHINCHA'),
('dddddddd-dddd-dddd-dddd-ddddddddd002','BANCO GUAYAQUIL'),
('dddddddd-dddd-dddd-dddd-ddddddddd003','BANCO PACIFICO')
ON CONFLICT DO NOTHING;

-- =========================================================
-- 8) BANK ACCOUNTS
-- =========================================================
INSERT INTO bank_accounts (id, user_id, bank_id, account_type, account_number, holder_name)
VALUES
(
 'eeeeeeee-eeee-eeee-eeee-eeeeeeeee001',
 '00000000-0000-0000-0000-000000000002',
 'dddddddd-dddd-dddd-dddd-ddddddddd001',
 'AHORROS','2204676223','Scholar User'
),
(
 'eeeeeeee-eeee-eeee-eeee-eeeeeeeee002',
 '00000000-0000-0000-0000-000000000003',
 'dddddddd-dddd-dddd-dddd-ddddddddd003',
 'AHORROS','5896471258','NICOLAS ALEJANDRO CAIZA GUACHI'
)
ON CONFLICT DO NOTHING;

-- =========================================================
-- 9) CONTRACT TEMPLATE
-- =========================================================
INSERT INTO contract_templates (id, scholarship_type_id, structure)
VALUES (
 'ffffffff-ffff-ffff-ffff-fffffffff001',
 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
 '{"version":1,"name":"Template Excellence"}'::jsonb
)
ON CONFLICT DO NOTHING;

-- =========================================================
-- 10) CONTRACTS
-- =========================================================
INSERT INTO contracts (
 id, user_id, template_id,
 academic_period_start, academic_period_end,
 official_number, scholarship_amount,
 budget_item, status, blockchain_hash, file
)
VALUES
(
 '99999999-9999-9999-9999-999999999001',
 '00000000-0000-0000-0000-000000000002',
 'ffffffff-ffff-ffff-ffff-fffffffff001',
 '2023-05-01','2023-09-30',
 'DBU-2023-BEA-0187',400.00,
 'PARTIDA PRESUPUESTARIA X','pending','HASH_PLACEHOLDER',NULL
),
(
 '99999999-9999-9999-9999-999999999002',
 '00000000-0000-0000-0000-000000000003',
 'ffffffff-ffff-ffff-ffff-fffffffff001',
 '2024-05-01','2024-09-30',
 'DBU 2024-2024-BEA-0175',400.00,
 'PARTIDA PRESUPUESTARIA PENDIENTE','pending','HASH_PLACEHOLDER',NULL
),
(
 '99999999-9999-9999-9999-999999999020',
 '00000000-0000-0000-0000-000000000020',
 'ffffffff-ffff-ffff-ffff-fffffffff001',
 '2024-05-01','2024-09-30',
 'DBU 2024-2024-BEA-0220',400.00,
 'PARTIDA PRESUPUESTARIA PENDIENTE','pending','HASH_PLACEHOLDER',NULL
)
ON CONFLICT DO NOTHING;
