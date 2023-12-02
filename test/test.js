const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server");
const expect = chai.expect;
chai.use(chaiHttp);

//profile test cases
describe("User API Tests", () => {
  // Test for GET /user_info
  describe("GET /user_info", () => {
    it("should get user information by ID", (done) => {
      chai
        .request(app)
        .get("/user_info")
        .set("Cookie", "connect.sid=s%3A1234567890")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("data").that.is.an("array");

          done();
        });
    });

    it("should handle invalid user ID", (done) => {
      const invalidUserId = "99";

      chai
        .request(app)
        .get("/user_info")
        .set("Cookie", "connect.sid=s%3A1234567890")
        .send({ id: invalidUserId })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.data).to.be.an("array").that.has.lengthOf(0);
          done();
        });
    });
  });

  // Test for PATCH /update_user_info
  describe("PATCH /update_user_info", () => {
    const updateData = {
      first_name: "Viet",
      last_name: "Pham",
      addressOne: "324 street blv",
      addressTwo: "",
      city: "Houston",
      state: "TX",
      zipCode: "77004",
    };

    it("should update user information by ID", (done) => {
      chai
        .request(app)
        .patch("/update_user_info")
        .set("Cookie", "connect.sid=s%3A1234567890")
        .send(updateData)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("success").that.is.true;

          done();
        });
    });

    it("should handle updating with invalid user ID", (done) => {
      const invalidUserId = "99";

      chai  
        .request(app)
        .patch("/update_user_info")
        .set("Cookie", "connect.sid=s%3A1234567890")
        .send({ id: invalidUserId, ...updateData })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("success").that.is.false;
          done();
        });
    });
  });
});
//end of profile test cases
