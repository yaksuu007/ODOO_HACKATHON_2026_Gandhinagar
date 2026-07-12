-- AssetFlow Database Schema
-- PostgreSQL 15+
-- Version 1.0

-- Drop database if exists (for development only)
-- DROP DATABASE IF EXISTS assetflow;

-- Create database
CREATE DATABASE assetflow
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TEMPLATE = template0
    CONNECTION LIMIT = -1;

-- Connect to the database
\c assetflow

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist"; -- For exclusion constraints
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search
CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- For encryption

-- Create schema
CREATE SCHEMA IF NOT EXISTS assetflow;

-- Set search path
SET search_path TO assetflow, public;

-- Create comment on database
COMMENT ON DATABASE assetflow IS 'AssetFlow - Enterprise Asset & Resource Management System';
