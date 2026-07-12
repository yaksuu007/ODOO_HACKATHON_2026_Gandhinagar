-- AssetFlow Database Schema
-- Permissions and Grants
-- PostgreSQL 15+

SET search_path TO assetflow, public;

-- Create application user
DO
$$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'assetflow_app') THEN
        CREATE ROLE assetflow_app WITH LOGIN PASSWORD 'change_me_in_production' NOSUPERUSER NOCREATEDB NOCREATEROLE;
    END IF;
END
$$;

-- Create read-only user for reporting
DO
$$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'assetflow_readonly') THEN
        CREATE ROLE assetflow_readonly WITH LOGIN PASSWORD 'change_me_in_production' NOSUPERUSER NOCREATEDB NOCREATEROLE;
    END IF;
END
$$;

-- Grant permissions to application user
GRANT USAGE ON SCHEMA assetflow TO assetflow_app;
GRANT USAGE ON SCHEMA public TO assetflow_app;

-- Grant SELECT, INSERT, UPDATE, DELETE on all tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA assetflow TO assetflow_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO assetflow_app;

-- Grant USAGE on all sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA assetflow TO assetflow_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO assetflow_app;

-- Grant EXECUTE on all functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA assetflow TO assetflow_app;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO assetflow_app;

-- Grant permissions to read-only user
GRANT USAGE ON SCHEMA assetflow TO assetflow_readonly;
GRANT USAGE ON SCHEMA public TO assetflow_readonly;

-- Grant SELECT only on all tables
GRANT SELECT ON ALL TABLES IN SCHEMA assetflow TO assetflow_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO assetflow_readonly;

-- Grant USAGE on all sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA assetflow TO assetflow_readonly;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO assetflow_readonly;

-- Grant EXECUTE on all functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA assetflow TO assetflow_readonly;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO assetflow_readonly;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA assetflow GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO assetflow_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA assetflow GRANT USAGE, SELECT ON SEQUENCES TO assetflow_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA assetflow GRANT EXECUTE ON FUNCTIONS TO assetflow_app;

ALTER DEFAULT PRIVILEGES IN SCHEMA assetflow GRANT SELECT ON TABLES TO assetflow_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA assetflow GRANT USAGE, SELECT ON SEQUENCES TO assetflow_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA assetflow GRANT EXECUTE ON FUNCTIONS TO assetflow_readonly;

-- Grant permissions on specific enum types (if needed)
GRANT USAGE ON ALL TYPES IN SCHEMA assetflow TO assetflow_app;
GRANT USAGE ON ALL TYPES IN SCHEMA assetflow TO assetflow_readonly;

-- Note: In production, change the passwords using:
-- ALTER ROLE assetflow_app WITH PASSWORD 'your_secure_password';
-- ALTER ROLE assetflow_readonly WITH PASSWORD 'your_secure_password';
