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
    
);
