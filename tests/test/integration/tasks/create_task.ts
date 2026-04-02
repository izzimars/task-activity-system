import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { createExpressApp } from "../../../../src/config/express";
import taskFixtures from "../../fixtures/taskFixtures";
import userFixtures from "../../fixtures/userFixtures";
import states from "../../helpers/states";

chai.use(chaiHttp);

const app = createExpressApp();

describe("Create Task", () => {
  before((done) => {
    chai
      .request(app)
      .post("/api/v1/auth/register")
      .send(userFixtures.registerSecondary)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        states.secondaryUser.id = res.body.id;
        states.secondaryUser.token = res.body.token;
        states.secondaryUser.email = res.body.email;
        process.env.SECONDARY_USER_ID = res.body.id;
        process.env.SECONDARY_USER_TOKEN = res.body.token;
        process.env.SECONDARY_USER_EMAIL = res.body.email;
        done();
      });
  });

  it("should create task and return 201 with owner", (done) => {
    const token = process.env.PRIMARY_USER_TOKEN || states.primaryUser.token;

    chai
      .request(app)
      .post("/api/v1/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send(taskFixtures.createPrimaryTask)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res).to.have.status(201);
        expect(res.body).to.have.property("id");
        expect(res.body).to.have.property("title", taskFixtures.createPrimaryTask.title);
        expect(res.body).to.have.property("created_by", process.env.PRIMARY_USER_ID || states.primaryUser.id);

        states.tasks.primaryTaskId = res.body.id;
        process.env.PRIMARY_TASK_ID = res.body.id;
        done();
      });
  });

  it("should fail when title is missing", (done) => {
    const token = process.env.PRIMARY_USER_TOKEN || states.primaryUser.token;

    chai
      .request(app)
      .post("/api/v1/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send(taskFixtures.missingTitle)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res).to.have.status(400);
        expect(res.body).to.have.property("message", "Validation failed");
        done();
      });
  });

  it("should fail with invalid token", (done) => {
    chai
      .request(app)
      .post("/api/v1/tasks")
      .set("Authorization", "Bearer invalid-token")
      .send(taskFixtures.createPrimaryTask)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res).to.have.status(401);
        expect(res.body).to.have.property("message", "Unauthorized");
        done();
      });
  });
});
