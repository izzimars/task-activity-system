import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { createExpressApp } from "../../../../src/config/express";
import userFixtures from "../../fixtures/userFixtures";
import states from "../../helpers/states";

chai.use(chaiHttp);

const app = createExpressApp();

describe("Auth Login", () => {
  it("should login and return 200 with jwt", (done) => {
    chai
      .request(app)
      .post("/api/v1/auth/login")
      .send({
        email: userFixtures.registerPrimary.email,
        password: userFixtures.registerPrimary.password
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("id");
        expect(res.body).to.have.property("email", userFixtures.registerPrimary.email.toLowerCase());
        expect(res.body).to.have.property("token");

        states.primaryUser.token = res.body.token;
        process.env.PRIMARY_USER_TOKEN = res.body.token;
        done();
      });
  });

  it("should fail with wrong password", (done) => {
    chai
      .request(app)
      .post("/api/v1/auth/login")
      .send({
        email: userFixtures.registerPrimary.email,
        password: userFixtures.wrongPassword.password
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res).to.have.status(401);
        expect(res.body).to.have.property("message", "Invalid credentials");
        done();
      });
  });

  it("should fail with non-existent email", (done) => {
    chai
      .request(app)
      .post("/api/v1/auth/login")
      .send(userFixtures.nonExistentLogin)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res).to.have.status(401);
        expect(res.body).to.have.property("message", "Invalid credentials");
        done();
      });
  });
});
