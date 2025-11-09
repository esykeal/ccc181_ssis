DROP TABLE IF EXISTS student_table CASCADE;

CREATE TABLE IF NOT EXISTS student_table (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(20) UNIQUE NOT NULL,  -- Format: YYYY-NNNN
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    program_code VARCHAR(10) NOT NULL REFERENCES program_table(program_code) ON UPDATE CASCADE ON DELETE RESTRICT,
    year INTEGER NOT NULL CHECK (year BETWEEN 1 AND 4),
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    pfp_url TEXT DEFAULT NULL
);