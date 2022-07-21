import Bree from "bree";
import * as path from "node:path";

export default async () => {
  const jobScheduler = new Bree({
    root: path.join(__dirname, "../jobs"),
    jobs: [{ name: "normalize-coins", interval: "at 8:00 am" }]
  });
  await jobScheduler.start();
};
