DROP TABLE recipes;
DROP TABLE users;

CREATE TABLE users(
	id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL
);
CREATE TABLE recipes(
	id INT AUTO_INCREMENT PRIMARY KEY,
	user_id INT,
	name VARCHAR(50) NOT NULL,
    image VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);



/*
	DMl(Data Maniqulation Language)
    - 테이블에 저장된 데이터를 다루는 언어
    - INSERT(추가), select() update(업데이트) delete(삭제)
    
*/

-- insert : 테이블에 새로운 행을 추가
-- INSERT INTO 테이블 명 VALUES(값, 값,...);





INSERT INTO users VALUES(1,'김붕어','my1234email.com', '1234');


INSERT INTO users VALUES('이붕어','my1234email.com', '1234'); -- 에러? 컬럼수 가 맞지 않음!

-- 테이블 명 (컬럼명, 컬럼명,...) 기재
INSERT INTO users(name, email, password) 
VALUES('이붕어','my1234email.com', '1234'); 

-- 컬럼 명 순서는 상관 없음  단,(컬럼 명 순서 == 값 순서는 동일 해야 입력 가능)

INSERT INTO users(email, password, name) 
VALUES('이붕어','my1234email.com', '1234'); 

INSERT INTO users(email, password, name) 
VALUES('삼붕어','my3email.com', '1111'); 


-- 레시피 한 개 추가
	-- user_id 1, name : 모히또 
    -- image : 모히또.jpg , description : 상큼하고 청량한 쿠바식 칵테일
    
    -- 레시피 name이 모히또인 레코드 1개 조회
    
INSERT INTO recipes(user_id, name, image, description)
VALUES(1,'모히또','모히또.jpg', '상큼하고 청량한 쿠바식 칵테일'); 
select * from recipes;

select  *
from recipes
where name ='모히또';

-- select : 테이블에 저장된 데이터 조회
/*
	select 컬럼명, 컬럼명...
    from 테이블 명 
    where 조건; 
    */
-- 전체 컬럼 조회
select * from users;

-- 필요한 컬럼명만 조회 
select email, password
from users;

-- 이름이 '유저 01'인 사람들의 emil을 조회 
select email from users;
select email, name from users where name = '김붕어';

-- id 가 1인 사람의 email 과 password 조회
select email, password 
from users
where id =1;

-- update : 테이블에 저장된 데이터를 수정 
/*
	update 테이블명
    set 컬럼명 = 컬럼명
    where 조건 ;
*/

-- users 테이블에서 id 가 4인 사람의 password를 pass01로 변경
update  users
set password = 'pass01'
where id= 4;

-- recipes 테이블에서 name이 모히또인 레시피를 
	-- name : 네그로니, description : 진의 드라이함, 스위트 베르무트.. 로 수정
    
update recipes
set name = '네그로니' , description = '진의 드라이함, 스위트 베르무트..'
where name = '모히또';

select * from recipes;
