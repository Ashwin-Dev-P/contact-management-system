const chai = require('chai');
const chaiHttp = require("chai-http");
chai.use(chaiHttp)
const should = chai.should();
const index = require("../index")

const expect = chai.expect;

describe("API testing", () => {
  const auth= {
      username: "admin",
      password: "password"
  }

  //Basic auth middleare check
  it("basic auth denial check request", (done) => {
      chai.request(index).get("/api/*")
      .end((err, response) => {
        
          if (err) {
              done();
          }

          //response body check
          should.exist(response.body);
          response.body.should.be.a('Object')

          //status check
          should.exist(response.body.status)
          response.body.should.have.status(401)



          //data check
          should.exist(response.body.message)




          done();
      })
  });

    //get About us singleton
    it("get /about_us_singleton request", (done) => {
        chai.request(index).get("/api/about_us_singleton")
        .set("Authorization", "basic " + new Buffer.from("admin:password").toString("base64"))
        .end((err, response) => {

            if (err) {
                done();
            }

            //response body check
            should.exist(response.body);
            response.body.should.be.a('Object')

            //status check
            should.exist(response.body.status)
            response.body.should.have.status(200)



            //data check
            should.exist(response.body.data)
            response.body.data.should.be.a('array')




            done();
        })
    });



})
