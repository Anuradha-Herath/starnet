# Database Migrations

This folder contains SQL migration scripts for setting up and updating the database schema.

## Naming Convention
- Files are named with a prefix like `001_`, `002_`, etc., to indicate the order of execution.
- Follow the format: `{number}_{description}.sql`

## Current Migrations
- `001_initial_setup.sql`: Initial database setup including users and user_auth tables.

## Usage
Run these scripts in your Supabase SQL editor or database management tool in the order indicated by the numbering.