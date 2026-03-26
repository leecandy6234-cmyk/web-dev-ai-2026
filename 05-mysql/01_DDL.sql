/*
 - 데이터(data) :  화면에 보이거나, 사용자가 입력하거나, 저장해야 하는 정보
 - 데이터 베이스 (database) : 데이터를 저장하고 필요할 때 꺼내 쓰는 공간
 - DBMS (datanase  ): 
     데이터 베이스를 만들고, 저장하고, 수정하고, 조회할 수 있게 하는 프로그램 
 - RDBMS(relational database management system) : 관계형 데이터 베이스 관리 시스템
     예) MySQL, Oracle, PostgreSQL
 - SQL(Structured Query Language)
    : 관계형 데이터베이스에서 데이터를 조회하거나 조작하기 위해 사용하는 표준언어 

  - SQL 종류
    - DDL(Data Definition Language) : 데이터 정의어
        - DB의 구조를 정의하거나 변경, 삭제하기 위한 언어
         - CREATE : 생성 
         - DROP : 삭제
         - ALTER : 수정
    - DML(Data Manipulation Language) : 데이터 조작어
        -데이터를 조회하거나 조작하기 위한 언어
        - SELECT : 조회
        - INSERT : 추가
        - UPDATE : 수정
        - DELETE : 삭제

        --> CRUD


    - DCL(Data Control Language) : 데이터 제어어
        - DB의 보안, 권한 관리, 무결성 제어를 위한 언어
        - GRANT : 권한 부여
        - REVOKE : 권한 회수
    
    - TCL(Transaction Control Language) : 트랜잭션 제어어
        - 트랜잭션 처리 및 제어를 위한 언어
        - COMMIT : 실행, ROLLBACK : 취소, SAVEPOINT :  임시저장

 - 엔티티(Entity) : 같은 성격을 가진 데이터를 묶어놓는 큰 주제
 
*/

/*
    DDL(Data Definition Language) : 데이터 정의어
    - 실제 데이터 값이 아닌 구조 자체를 정의하는 언어
    - 객체를 만들고(CREATE), 변경하고(ALTER), 삭제하는(DROP) 언어

    MySQL에서 객체 : 스키마(schema),  테이블(table), 
                    뷰(view), 인덱스(index), 
                    함수(function), 프로시저(procedure), 트리거(trigger)
*/
/*
    스키마 : 테이블들을 담는 큰 공간
    프로젝트 단위로 하나의 스키마를 만들어 사용
*/
 -- 스키마 생성

CREATE DATABASE sample; -- MySQL에서는 DATABASE랑 SCHMA가 같은 뜻
CREATE SCHEMA cocktail;
/*
    CREATE TABLE 테이블명(
        컬럼명1 자료형(크기),
        컬럼명2 자료형(크기),....
    );

    * 자료형
        1. 문자
            -  CHAR / **VARCHAR** : 고정 및 가변 길이 문자, 반드시 크기 지정
            -  TEXT : 매우 긴 문자열을 저장하는데에 사용
        2. 숫자
            - **INT** : 정수값 저장하는데에 사용 
            - FLOAT / DOUBLE : 부동 소수점 저장 
            - DECIMAL : 고정 소수점 자리 저장 
        3. 날짜 및 시간
            - DATE : 날짜 
            - TIME : 시간
            - DATETIME / TIMESTAMP : 날짜 및 시간 함께 저장         
        4. 불리언
            - BOOLEAN / BOOL : 참(True) 또는 거짓(False) 값을 저장하는데 사용
        5.이진 데이터
            - BLOB : 이진 데이터를 저장하는데 사용, 이미지나 동영상과 같은 이진 파일
            ->  실제로는 이미지나 동영상은 따로 관리 (URL로 문자형으로 저장)


    - 엔티티(Entity) : 같은 성격을 가진 데이터를 묶어놓는 큰 주제
    - 테이블 : 같은 성격의 데이터를 모아두는 곳
    - 컬럼 : 테이블 안에서 각 정보의 종류를 구분하는 칸
    - 레코드(DATA) : 실제 저장된 데이터 한 줄  
*/
CREATE TABLE recipes(
	name VARCHAR(50),
    image VARCHAR(200),
    descrpition TEXT
);

 select * from users;
 -- DROP : 삭제
 DROP TABLE users;
 
 -- 제약조건(constraint) : 데이터 무결성을 지키기 위한 규칙 
 
 CREATE TABLE users(
	id VARCHAR (50),
    email VARCHAR(200),
    password VARCHAR(200)
 );
 SELECT * FROM users;
 
 INSERT INTO users VALUES('user01','user@google.com', 'pass01'); -- 데이터 추가
 INSERT INTO users VALUES (NULL, NULL, NULL);
 INSERT INTO users VALUES('user01','user@google.com', NULL);
 
 -- UNIQUE : 중목된 값은 허용 X
  DROP TABLE users;
    DROP TABLE recipes;
  
 CREATE TABLE users(
	id VARCHAR (50) UNIQUE,
	name VARCHAR(100),
    email VARCHAR(200)NOT NULL UNIQUE,
    password VARCHAR(200)NOT NULL
 );
 SELECT * FROM users;
 DROP TABLE users; -- 삭제
INSERT INTO users VALUES('user01' ,'user@google.com', 'pass01'); -- 데이터 추가
 INSERT INTO users VALUES ('user02', 'user@google.com', 'pass01');
 INSERT INTO users VALUES(NULL, 'user@google.com', 'pass01');
 
 
 -- foreing key
CREATE TABLE recipes(
	id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
	name VARCHAR(50) NOT NULL,
    image VARCHAR(200) NOT NULL,
    description TEXT NOT NULL
);
 SELECT * FROM recipes; -- 실행
 DROP TABLE recipes; -- 삭제 
 --  FOREIGN KEY (user_id) REFERENCES users(id)
  DROP TABLE users; -- 삭제
  
insert into recipes(user_id, name, image, description)
VALUES(NOT NULL, '미나리 소주', 'localhost:3000/soju.jpg')

-- DEFULT : 제약 조건 X, 값을 직접 넣지 않고 자동으로 들어갈 기본값 

CREATE TABLE recipes(
	id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
	name VARCHAR(50) NOT NULL,
    image VARCHAR(200) NOT NULL,
    description TEXT NOT NULL
);

/*
	외래키 삭제 옵션 
    : 부모 테이블의 데이터를 삭제 할 시 그 값을 참조하는 자식 테이블 데이터를 어떻게 할지
    
    - on delete recipes (기본 값) : 자식 테이블에서 사용 중인 부모 데이터느 삭제 x
    - on delete set null : 부모 데이터르 삭제하면 자식 테이블의 FK 값을 null 로 변경 
    - on delet cascade : 부모 데이터를 삭제하면 그 부모를 참조하는 자식 데이터도 삭제 
*/
 
 CREATE TABLE recipes(
	id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
	name VARCHAR(50) NOT NULL,
    image VARCHAR(200) NOT NULL,
    description TEXT NOT NULL
);







DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(200) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL
);

DROP TABLE IF EXISTS recipes;

CREATE TABLE recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    image VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
INSERT INTO users (email, password)
VALUES ('user@google.com', 'pass01');

INSERT INTO recipes (user_id, name, image, description)
VALUES (1, '미나리 소주', 'localhost:3000/soju.jpg', '맛있는 소주 칵테일');
DELETE FROM recipes WHERE id = 3; -- id 3 삭제 

 SELECT * FROM recipes; -- 실행
 DROP TABLE recipes; -- 삭제 
 
 SELECT * FROM users; -- 실행
  DROP TABLE users; -- 삭제
  
  
  
  --
  
  CREATE TABLE recipes(
	id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
	name VARCHAR(50) NOT NULL,
    image VARCHAR(200) NOT NULL,
    description TEXT NOT NULL
    created_at DATETIME DEFALT
    
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

INSERT INTO recipes(user_id, name, image, description)
VALUES(2, '미나리 소주', 'localhost:3000/soju.jpg', '요리하는 돌아이 윤남노 셰프가 방송에서 만든 미나리 소주');

-- DELETE FROM 테이블 명 WHERE 컬럼 = 값; : 해당 테이블의 컬럼 값과 일치하는 것을 삭제
DELETE FROM users WHERE id = 2;

CREATE TABLE recipes(
	id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(50) NOT NULL,
    image VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO recipes(user_id, name, image, description)
VALUES(2, '미나리 소주', 'localhost:3000/soju.jpg', '요리하는 돌아이 윤남노 셰프가 방송에서 만든 미나리 소주');

INSERT INTO users(name, email, password)
VALUES('user02', 'user02@google.com', 'pass01');


/*
   - 데이터(data) : 화면에 보이거나, 사용자가 입력하거나, 저장해야 하는 정보
   - 데이터베이스(database) : 데이터를 저장하고 필요할 때 꺼내 쓰는 공간
   - DBMS(database management system) : 데이터베이스를 관리 하는 프로그램
   - RDBMS(relational database management system) : 관계형 데이터베이스 관리 시스템
        예) mySQL, Oracle, PostgreSQL
   - 엔티티(Entity) : 같은 성격을 가진 데이터를 묶어놓는 큰 주제
   - SQL (Structured Query Language) : 관계형 데이터베이스에서 데이터를 조회하거나 조작하기 위한 표준 언어
   - SQL 종류
       - DDL(Data Definition Language) : 데이터 정의어
         - DB의 구조를 정의하거나 변경, 삭제하기 위한 언어
         - CREATE : 생성, ALTER : 수정, DROP : 삭제
       - DML(Data Manipulation Language) : 데이터 조작어
         - 데이터를 조작하기 위한 언어
         - SELECT : 조회, INSERT : 추가, UPDATE : 수정, DELETE : 삭제 -> CRUD
       - DCL(Data Control Language) : 데이터 제어어
         - DB의 보안, 권한 관리, 무결성 제어를 위한 언어
         - GRANT : 권한 부여, REVOKE : 권한 회수
       - TCL(Transaction Control Language) : 트랜잭션 제어어
         - 트랜잭션 처리 및 제어를 위한 언어
         - COMMIT : 실행, ROLLBACK : 취소, SAVEPOINT : 임시저장
*/
/*
    DDL(Data Definition Language) : 데이터 정의어
    - 실제 데이터 값이 아닌 구조 자체를 정의하는 언어
    - 객체를 만들고(CREATE), 변경하고(ALTER), 삭제(DROP)하는 언어
    MySQL에서 객체 : !스키마(Schema), 테이블(Table)!, 뷰(View), 인덱스(Index), 프로시저(Procedure), 함수(Function), 트리거(Trigger)
*/
/*
    스키마 : 테이블들을 담는 큰 공간
    프로젝트 단위로 하나의 스키마를 만들어 사용
*/

-- 보통 사용자 지정명은 소문자, 문법은 대문자로 구분함
-- 스키마 생성 ( DATABASE 와 SCHEMA 는 같은 기능 )
CREATE DATABASE sample;
CREATE SCHEMA cocktail;

/*
    CREATE TABLE 테이블명(
        컬럼명 자료형(크기),
        컬럼명 자료형(크기), ...
    );

    * 자료형
        1. 문자
            - CHAR / **VARCHAR** : 고정 및 가변 길이 문자, 반드시 크기 지정
            - TEXT : 매우 긴 문자열을 저장하는데 사용
        2. 숫자
            - INT : 정수값 저장하는데 사용
            - FLOAT / DOUBLE : 부동소수점 저장하는데 사용
            - DECIMAL : 고정소수점 저장하는데 사용
        3. 날짜
            - DATE : 날짜 저장하는데 사용
            - TIME : 시간 저장하는데 사용
            - DATETIME / TIMESTAMP : 날짜와 시간을 함께 저장
        4. 불리언
            - BOOLEAN / BOOL : 참(True) 또는 거짓(False) 값을 저장하는데 사용
        5. 이진 데이터
            - BLOB : 이진 데이터를 저장하는데 사용, 이미지나 동영상과 같은 이진 파일
            -> 실제로는 이미지나 동영상은 따로 관리 (URL로 문자형으로 저장)

    - 엔티티(Entity) : 같은 성격을 가진 데이터를 묶어놓는 큰 주제
    - 테이블 : 같은 성격의 데이터를 모아두는 곳
    - 컬럼 : 테이블 안에서 각 정보의 종류를 구분하는 칸
    - 레코드(data) : 실제 저장된 데이터 한 줄

   * 데이터 모델링
    1. 개념적 모델링 : 어떤 정보가 필요한지 클 묶음으로 정리
        ex) recipes, users
    2. 논리적 모델링 : 각 묶음에 어떤 컬럼이 필요한지 정리
        ex) recipes(name, image, description)
    3. 물리적 모델링 : 실제 DB에서 자료형과 제약조건까지 정해서 CREATE TABLE로 작성
        ex) name VARCHAR(50)
*/
-- 칵테일 이름, 대표 칵테일 사진, 칵테일 설명, 만드는 방법
CREATE TABLE  recipes(
   name VARCHAR(50),
   image VARCHAR(200),
   description TEXT
);
CREATE TABLE users(
   id VARCHAR(50),
   email VARCHAR(200),
   name VARCHAR(50),
   gender VARCHAR(1),
   password VARCHAR(200),
   nickname VARCHAR(100),
   phone VARCHAR(20),
   address VARCHAR(200),
   birthday DATE
);

-- SELECT * FROM 테이블 명; : 테이블 명을 조회
-- DROP TABLE 테이블 명; : 테이블 명을 삭제
-- INSERT INTO 테이블 명 VALUES('', ...); : 테이블 명에 데이터를 추가, 테이블의 컬럼 수와 맞아야 함
-- 값에 NULL 을 넣으면 NULL 값의 데이터가 저장됨

DROP TABLE users;
DROP TABLE recipes;

-- 제약조건(CONSTRAINT) : 데이터 무결성을 지키기 위한 규칙
CREATE TABLE users(
    id VARCHAR(50),
    email VARCHAR(200),
    password VARCHAR(200)
);

SELECT * FROM users;

INSERT INTO users VALUES('user01', 'user01@google.com', 'pass01');
INSERT INTO users VALUES(NULL, NULL, NULL);
INSERT INTO users VALUES('user02', 'user02@google.com', NULL);

-- NOT NULL : NULL 값을 허용 X, 반드시 값이 있어야 한다
INSERT INTO users VALUES('user01', 'user01@google.com', 'pass01'); -- 허용된 데이터
INSERT INTO users VALUES(NULL, NULL, NULL); -- 허용되지 못한 데이터

-- UNIQUE : 중복된 값은 허용 X
INSERT INTO users VALUES('user01', 'user01@google.com', 'pass01'); -- 허용된 데이터
INSERT INTO users VALUES('user01', 'user02@google.com', 'pass02'); -- 허용되지 못한 데이터

-- PRIMARY KEY (PK) : 각 레코드를 구분하는 대표 값. 중복 + NULL X. 무조건 TABLE 당 한 개.
-- 문자열에서 사용하면 느려져, 보통 숫자 값에서 사용함
-- AUTO_INCREMENT : 숫자 값 자동 증가
DROP TABLE users;
CREATE TABLE users(
	id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL
);
SELECT * FROM users;
CREATE TABLE recipes(
	id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    image VARCHAR(200) NOT NULL,
    description TEXT NOT NULL
);
SELECT * FROM users;
-- id는 자동으로 데이터가 저장되기 때문에 id를 제외한 어떤 정보를 적을지 지정
INSERT INTO users(name, email, password) 
VALUES('유저01', 'user01@google.com', 'pass01'); -- 지정한 정보 순서대로 데이터를 넣으면 됨

-- FOREIGN KEY (FK) : 다른 테이블들과 연결할 때 사용
-- FOREIGN KEY (컬럼) REFERENCES 참조할 테이블 명(컬럼)
DROP TABLE recipes;
CREATE TABLE recipes(
	id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    image VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO recipes(user_id, name, image, description)
VALUES(1, '미나리 소주', 'localhost:3000/soju.jpg', '요리하는 돌아이 윤남노 셰프가 방송에서 만든 미나리 소주');

SELECT recipes.name, users.name, image
FROM recipes
JOIN users ON (user_id = users.id);
-- DEFAULT : 제약조건 X, 값을 직접 넣지 않고 자동으로 들어갈 기본 값
-- CURRENT_TIMESTAMP : 데이터를 넣을 당시에 시간
CREATE TABLE recipes(
	id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    image VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

SELECT * FROM users;
SELECT * FROM recipes;

/*
	외래키 삭제 옵션 :
    부모 테이블의 데이터를 삭제할 시 그 값을 참조하는 자식 테이블 데이터를 어떻게 할 지

    - ON DELETE RESTRICT (기본값) : 자식 테이블에서 사용 중인 부모 데이터는 삭제 X
    - ON DELETE SET NULL : 부모 데이터를 삭제하면 자식 테이블의 FK 값을 NULL로 변경
    - ON DELETE CASCADE : 부모 데이터를 삭제하면 그 부모를 참조하는 자식 데이터도 삭제
*/

CREATE TABLE recipes(
	id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(50) NOT NULL,
    image VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

INSERT INTO recipes(user_id, name, image, description)
VALUES(2, '미나리 소주', 'localhost:3000/soju.jpg', '요리하는 돌아이 윤남노 셰프가 방송에서 만든 미나리 소주');

-- DELETE FROM 테이블 명 WHERE 컬럼 = 값; : 해당 테이블의 컬럼 값과 일치하는 것을 삭제
DELETE FROM users WHERE id = 2;

CREATE TABLE recipes(
	id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(50) NOT NULL,
    image VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO recipes(user_id, name, image, description)
VALUES(2, '미나리 소주', 'localhost:3000/soju.jpg', '요리하는 돌아이 윤남노 셰프가 방송에서 만든 미나리 소주');

INSERT INTO users(name, email, password)
VALUES('user02', 'user02@google.com', 'pass01');




-- 선생님 자료
CREATE TABLE recipes(
	name VARCHAR(50),
    image VARCHAR(200),
    description TEXT
);
CREATE TABLE users(
    id VARCHAR(50),
    email VARCHAR(200),
    name VARCHAR(50),
    gender CHAR(1),
    password VARCHAR(200),
    nickname VARCHAR(100),
    phone VARCHAR(20),
    address VARCHAR(200),
    birth DATE
);
 SELECT * FROM recipes; -- 실행
 DROP TABLE recipes; -- 삭제 
 --  FOREIGN KEY (user_id) REFERENCES users(id)
  DROP TABLE users; -- 삭제
SELECT * FROM users; -- 실행
