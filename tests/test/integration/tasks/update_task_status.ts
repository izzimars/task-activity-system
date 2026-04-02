import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { createExpressApp } from "../../../../src/config/express";
import taskFixtures from "../../fixtures/taskFixtures";
import states from "../../helpers/states";

chai.use(chaiHttp);

const app = createExpressApp();

describe("Update Task Status", () => {
  it("should update task status and return 200", (done) => {
    const token = process.env.PRIMARY_USER_TOKEN || states.primaryUser.token;
    const taskId = process.env.PRIMARY_TASK_ID || states.tasks.primaryTaskId;

    chai
      .request(app)
      .patch(`/api/v1/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(taskFixtures.statusDone)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("id", taskId);
        expect(res.body).to.have.property("status", taskFixtures.statusDone.status);
        done();
      });
  });

  it("should fail with invalid status value", (done) => {
    const token = process.env.PRIMARY_USER_TOKEN || states.primaryUser.token;
    const taskId = process.env.PRIMARY_TASK_ID || states.tasks.primaryTaskId;

    chai
      .request(app)
      .patch(`/api/v1/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(taskFixtures.invalidStatus)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res).to.have.status(400);
        expect(res.body).to.have.property("message", "Validation failed");
        done();
      });
  });

  it("should fail with 403 when task belongs to another user", (done) => {
    const token = process.env.PRIMARY_USER_TOKEN || states.primaryUser.token;
    const taskId = process.env.SECONDARY_TASK_ID || states.tasks.secondaryTaskId;

    chai
      .request(app)
      .patch(`/api/v1/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(taskFixtures.statusDone)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res).to.have.status(403);
        expect(res.body).to.have.property("message", "You are not authorized to update this task");
        done();
      });
  });

  it("should fail with 404 for non-existent task", (done) => {
    const token = process.env.PRIMARY_USER_TOKEN || states.primaryUser.token;

    chai
      .request(app)
      .patch("/api/v1/tasks/00000000-0000-0000-0000-000000000000")
      .set("Authorization", `Bearer ${token}`)
      .send(taskFixtures.statusDone)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res).to.have.status(404);
        expect(res.body).to.have.property("message", "Task not found");
        done();
      });
  });
});
