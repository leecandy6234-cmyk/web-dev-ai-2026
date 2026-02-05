/*
사람 {
    //특징들! => 변수
    이름,
    나이,
    사는곳
    //행동들! => 함수 (기능)
    일어난다
    밥을 먹는다
    씻는다
    옷을 입는다
    나간다
}
*/
//변수 끼리 서로 관련이 있다는 게 보이지 X
const name = "이붕어";
const age = 3;
const addr = "어항";

//배열은 서로 관련이 있는데 보임 근데 뭘의미하는지는 모름
const personArr = ["이붕어", 10, "어항"];

// 객체  (변수- 키: 값)
//변수랑 함수를 같이 묶을 수 있다
const person = {
  //변수
  name: "이붕어",
  age: 3,
  addr: "어항",
  //함수
  hello() {
    // this : 본인 자체(현재 기준person)
    console.log(`안녕하세요, ${this.name} 입니다`); //이안에 name 만 써도 되긴 하나 this를 쓰는 걸 권장함
  },
};
console.log(person);
console.log(person.name); // .함수명 하면 그거 나옴
console.log(person.age);
console.log(person.addr);
person.hello();

//1.객체 생성과 속성/함수 추가

const person1 = {};
person1.name = "김붕어";
person1.name = "김잉어";
person1["age"] = 13;
person1.hello = function () {
  console.log(`나는 ${this.name}이고, 나이는${this.age}살이다.`);
};
console.log(person1);
person1.hello();

const person2 = new Object(); //거의 안씀 {}=new Object()
person2.name = "뿡이";
person2["age"] = 2;
person2.hello = function () {
  console.log(`전 ${this.name}(이)고, 나이는${this.age}살 인데요.`);
};
person2.hello();

// this
const person3 = {
  name: "오란다",
  hello: function () {
    console.log(`익명함수 :${this.name}`);
  },
};
const person4 = {
  name: "난주",
  hello: () => {
    //=>에서의 this는 전역객체인 (가장큰 함수인) window를 가르킴 ///추천 안함 찾기 힘듬
    console.log(this.alert("안녕하세요!"));
    console.log(`화살표 함수 :${this.name}`);
  },
};

person3.hello();
person4.hello();

// 생성자 함수, 클래스 :여긴 대문자로 시작하는게 좋음
//자바는 함수먼저 생기고 클래스가 나중에 생겨서 함수는 자바만 있음
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.hello = function () {
    console.log(`안녕? 나는${this.name}이고, 나이는 ${this.age}살이야`);
  };
}
const p1 = new Person("붕어", 5);
p1.hello();
const p2 = new Person("잉어", 10);
p2.hello();

//함수 형식보다는 클래스 형식을 더 사용!
class Person2 /*대문자!*/ {
  // 객체 생성시 호출
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  hello() {
    console.log(`안녕? 나는${this.name}이고, 나이는 ${this.age}살이야`);
  }
}
const p3 = new Person2("이은경", 22);
p3.hello();
