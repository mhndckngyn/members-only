const sql = `
DO $$BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'membership_status') THEN
        CREATE type membership_status AS enum
        (
            'admin', 'secret', 'normal'
        );
    END IF;
END$$;

create table if not exists message (
	id integer primary key generated always as identity,
	title varchar(50),
	content varchar(255),
	time timestamp not null default now(), 
	member_id integer
);

create table if not exists member (
	id integer primary key generated always as identity,
	firstname varchar(255),
	lastname varchar(255),
	email varchar(50) unique,
	password varchar(255),
	status membership_status,
	created_at timestamp not null default now()
)
`;
