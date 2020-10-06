if(process.env.NODE_ENV === 'production'){
    module.exports = require('./prod');
}
else{
    module.exports = require("./dev");
}
//개발모드와 배포모드의 차이를 여기서 분기시킨다. 예를들어 포트번호같은것이 있다.
//로컬에선 3000으로열고 클라우드를 이용할 땐 3001을 여는 등...
//깃헙에 올리면 보이는 소스코드(특히 아이디 비밀번호)를 숨기기 위해서(나만쓰기 위해서) 
//따로 분리하여 사용 할 수 있도록 한다.