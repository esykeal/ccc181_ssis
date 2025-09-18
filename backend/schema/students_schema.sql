CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(20) UNIQUE NOT NULL,  -- Format: YYYY-NNNN
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    program_id INTEGER NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    year INTEGER NOT NULL CHECK (year BETWEEN 1 AND 4),
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other'))
);