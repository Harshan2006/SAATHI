-- SAATHI Database Schema

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT, -- Added for Auth
    role TEXT DEFAULT 'CITIZEN', -- CITIZEN, GOVERNMENT, UNIVERSITY, INDUSTRY
    organization TEXT,
    location TEXT,
    phone TEXT,
    joined_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Problems Table
CREATE TABLE IF NOT EXISTS problems (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    domain TEXT,
    severity TEXT,
    affected_people TEXT,
    status TEXT DEFAULT 'Submitted', -- Submitted, Under Review, Accepted, In Progress, Resolved, Rejected
    ai_summary TEXT,
    ai_keywords TEXT[],
    required_expertise TEXT[],
    latitude DOUBLE PRECISION,
    longitude INTEGER, -- Fixed to match actual DB if needed, but usually DOUBLE PRECISION
    embedding vector(384),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Fix longitude type if it was accidentally set to INTEGER in context but should be DOUBLE PRECISION
ALTER TABLE problems ALTER COLUMN longitude TYPE DOUBLE PRECISION;

-- Attachments Table
CREATE TABLE IF NOT EXISTS attachments (
    id SERIAL PRIMARY KEY,
    problem_id INTEGER REFERENCES problems(id),
    file_name TEXT,
    file_type TEXT,
    file_path TEXT,
    extracted_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Universities Table
CREATE TABLE IF NOT EXISTS universities (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    location TEXT,
    website TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Faculty Table
CREATE TABLE IF NOT EXISTS faculty (
    id SERIAL PRIMARY KEY,
    university_id INTEGER REFERENCES universities(id),
    name TEXT NOT NULL,
    department TEXT,
    designation TEXT,
    expertise TEXT,
    embedding vector(384),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Industries Table
CREATE TABLE IF NOT EXISTS industries (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    industry_type TEXT,
    expertise TEXT,
    embedding vector(384),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Matches Table (Persistent matches)
CREATE TABLE IF NOT EXISTS matches (
    id SERIAL PRIMARY KEY,
    problem_id INTEGER REFERENCES problems(id),
    university_id INTEGER REFERENCES universities(id),
    faculty_id INTEGER REFERENCES faculty(id),
    industry_id INTEGER REFERENCES industries(id),
    similarity_score DOUBLE PRECISION,
    match_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    problem_id INTEGER REFERENCES problems(id),
    title TEXT,
    description TEXT,
    status TEXT DEFAULT 'Planning',
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    type TEXT, -- Submission, Analysis, Match, StatusChange
    message TEXT,
    complaint_id INTEGER, -- Optional link to problem
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Feedback Table
CREATE TABLE IF NOT EXISTS feedback (
    id SERIAL PRIMARY KEY,
    problem_id INTEGER REFERENCES problems(id),
    user_id INTEGER REFERENCES users(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    resolution_status TEXT, -- Completely, Partially, Not resolved
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_problems_embedding ON problems USING hnsw (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_faculty_embedding ON faculty USING hnsw (embedding vector_cosine_ops);
