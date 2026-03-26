-- Migration 003: form_fields table + extra_data on contact_submissions
-- Run this in your Supabase SQL editor

-- 1. Add extra_data JSONB column to contact_submissions (for custom/dynamic fields)
ALTER TABLE contact_submissions
    ADD COLUMN IF NOT EXISTS extra_data JSONB DEFAULT '{}';

-- 2. Create form_fields table
CREATE TABLE IF NOT EXISTS form_fields (
    id            SERIAL PRIMARY KEY,
    form_id       VARCHAR(50)  NOT NULL,         -- 'contact' or 'summit'
    field_type    VARCHAR(30)  NOT NULL DEFAULT 'text', -- text, email, tel, select, textarea
    field_name    VARCHAR(100) NOT NULL,          -- HTML name attribute, e.g. firstName
    label_en      VARCHAR(200) NOT NULL,          -- Label shown on the form
    placeholder_en VARCHAR(200) DEFAULT '',
    is_required   BOOLEAN      NOT NULL DEFAULT false,
    is_visible    BOOLEAN      NOT NULL DEFAULT true,
    is_core       BOOLEAN      NOT NULL DEFAULT false, -- core fields cannot be deleted
    sort_order    INTEGER      NOT NULL DEFAULT 0,
    options_json  JSONB        DEFAULT NULL,      -- for select fields: [{value, label}]
    created_at    TIMESTAMPTZ  DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  DEFAULT NOW()
);

-- 3. Index for fast lookup by form
CREATE INDEX IF NOT EXISTS idx_form_fields_form_id ON form_fields (form_id, sort_order);

-- 4. Seed: Contact form core fields
INSERT INTO form_fields (form_id, field_type, field_name, label_en, placeholder_en, is_required, is_visible, is_core, sort_order)
SELECT 'contact', 'text',     'firstName', 'First Name',  'Enter your first name',     true,  true, true, 10
WHERE NOT EXISTS (SELECT 1 FROM form_fields WHERE form_id = 'contact' AND field_name = 'firstName');

INSERT INTO form_fields (form_id, field_type, field_name, label_en, placeholder_en, is_required, is_visible, is_core, sort_order)
SELECT 'contact', 'text',     'lastName',  'Last Name',   'Enter your last name',      true,  true, true, 20
WHERE NOT EXISTS (SELECT 1 FROM form_fields WHERE form_id = 'contact' AND field_name = 'lastName');

INSERT INTO form_fields (form_id, field_type, field_name, label_en, placeholder_en, is_required, is_visible, is_core, sort_order)
SELECT 'contact', 'text',     'company',   'Company',     'Your company name',         true,  true, true, 30
WHERE NOT EXISTS (SELECT 1 FROM form_fields WHERE form_id = 'contact' AND field_name = 'company');

INSERT INTO form_fields (form_id, field_type, field_name, label_en, placeholder_en, is_required, is_visible, is_core, sort_order)
SELECT 'contact', 'email',    'email',     'Email Address','your.email@company.com',   true,  true, true, 40
WHERE NOT EXISTS (SELECT 1 FROM form_fields WHERE form_id = 'contact' AND field_name = 'email');

INSERT INTO form_fields (form_id, field_type, field_name, label_en, placeholder_en, is_required, is_visible, is_core, sort_order)
SELECT 'contact', 'textarea', 'message',   'Message',     'Please describe your inquiry in detail...', true, true, true, 50
WHERE NOT EXISTS (SELECT 1 FROM form_fields WHERE form_id = 'contact' AND field_name = 'message');

-- 5. Seed: Summit registration core fields
INSERT INTO form_fields (form_id, field_type, field_name, label_en, placeholder_en, is_required, is_visible, is_core, sort_order)
SELECT 'summit', 'text',  'firstName', 'First Name',  'Enter your first name',  true, true, true, 10
WHERE NOT EXISTS (SELECT 1 FROM form_fields WHERE form_id = 'summit' AND field_name = 'firstName');

INSERT INTO form_fields (form_id, field_type, field_name, label_en, placeholder_en, is_required, is_visible, is_core, sort_order)
SELECT 'summit', 'text',  'lastName',  'Last Name',   'Enter your last name',   true, true, true, 20
WHERE NOT EXISTS (SELECT 1 FROM form_fields WHERE form_id = 'summit' AND field_name = 'lastName');

INSERT INTO form_fields (form_id, field_type, field_name, label_en, placeholder_en, is_required, is_visible, is_core, sort_order)
SELECT 'summit', 'email', 'email',     'Email Address','your.email@company.com', true, true, true, 30
WHERE NOT EXISTS (SELECT 1 FROM form_fields WHERE form_id = 'summit' AND field_name = 'email');

INSERT INTO form_fields (form_id, field_type, field_name, label_en, placeholder_en, is_required, is_visible, is_core, sort_order)
SELECT 'summit', 'tel',   'phone',     'Phone Number', '+81 123 456 7890',       false, true, true, 40
WHERE NOT EXISTS (SELECT 1 FROM form_fields WHERE form_id = 'summit' AND field_name = 'phone');

INSERT INTO form_fields (form_id, field_type, field_name, label_en, placeholder_en, is_required, is_visible, is_core, sort_order)
SELECT 'summit', 'text',  'company',   'Company / Organization','Your company name', true, true, true, 50
WHERE NOT EXISTS (SELECT 1 FROM form_fields WHERE form_id = 'summit' AND field_name = 'company');

INSERT INTO form_fields (form_id, field_type, field_name, label_en, placeholder_en, is_required, is_visible, is_core, sort_order)
SELECT 'summit', 'text',  'position',  'Position / Title','Your position',        true, true, true, 60
WHERE NOT EXISTS (SELECT 1 FROM form_fields WHERE form_id = 'summit' AND field_name = 'position');

INSERT INTO form_fields (form_id, field_type, field_name, label_en, placeholder_en, is_required, is_visible, is_core, sort_order, options_json)
SELECT 'summit', 'select','country',   'Country',     'Select your country',     true, true, true, 70,
    '[{"value":"japan","label":"Japan"},{"value":"south-korea","label":"South Korea"},{"value":"china","label":"China"},{"value":"singapore","label":"Singapore"},{"value":"uk","label":"United Kingdom"},{"value":"germany","label":"Germany"},{"value":"spain","label":"Spain"},{"value":"italy","label":"Italy"},{"value":"france","label":"France"},{"value":"other","label":"Other"}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM form_fields WHERE form_id = 'summit' AND field_name = 'country');

INSERT INTO form_fields (form_id, field_type, field_name, label_en, placeholder_en, is_required, is_visible, is_core, sort_order, options_json)
SELECT 'summit', 'select','ticketType','Ticket Type', 'Select ticket type',      true, true, true, 80,
    '[{"value":"standard","label":"Standard Pass (3 Days) - ¥150,000"},{"value":"vip","label":"VIP Pass (3 Days + Networking Events) - ¥250,000"},{"value":"group","label":"Group Pass (5 People) - ¥600,000"}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM form_fields WHERE form_id = 'summit' AND field_name = 'ticketType');

INSERT INTO form_fields (form_id, field_type, field_name, label_en, placeholder_en, is_required, is_visible, is_core, sort_order)
SELECT 'summit', 'textarea','specialRequirements','Special Requirements / Questions',
    'Any special dietary requirements, accessibility needs, or questions you have...',
    false, true, true, 90
WHERE NOT EXISTS (SELECT 1 FROM form_fields WHERE form_id = 'summit' AND field_name = 'specialRequirements');
