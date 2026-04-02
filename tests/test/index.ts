import { execSync } from "child_process";

before(function () {
  this.timeout(120000);
  execSync("npm run migrate:test:down", { stdio: "inherit" });
  execSync("npm run migrate:test:up", { stdio: "inherit" });
});

import "./integration/auth/register";
import "./integration/auth/login";
import "./integration/tasks/create_task";
import "./integration/tasks/get_tasks";
import "./integration/tasks/update_task_status";
import "./integration/tasks/real_time";
