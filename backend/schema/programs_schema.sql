DROP TABLE IF EXISTS program_table CASCADE;

CREATE TABLE IF NOT EXISTS program_table (
    id SERIAL PRIMARY KEY,
    program_code VARCHAR(10) UNIQUE NOT NULL,
    program_name VARCHAR(100) UNIQUE NOT NULL,
    college_code VARCHAR(20) NOT NULL REFERENCES college_table(college_code) ON DELETE RESTRICT
);