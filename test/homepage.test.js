// const request = require('supertest');
// const index = require('../index');

// describe("first test", function(){
//     it("welcomes the user", function(done){
//         request(index).get('/patients/test')
//             //.send()
//             .expect(200)
//             .expect('{"message":"test succesfull"}', done)
//     })
// })

const chai = require("chai");
const server = require("../index");
const chaiHttp = require("chai-http");

//Assertion style
chai.should();
chai.use(chaiHttp);
describe('Test API', () =>{
    describe("GET /patients/test", ()=>{
        it("get 200 json and a message", (done)=>{
            chai.request(server)
                .get("/patients/test")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                done();
                })
        })
    })

})