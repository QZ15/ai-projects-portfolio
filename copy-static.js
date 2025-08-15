import fs from "fs";
import fse from "fs-extra";

fse.copySync("apps/portfolio/frontend/dist", "public/portfolio");
fse.copySync("apps/glaze/frontend/dist", "public/glaze");
fse.copySync("apps/landing/dist", "public/landing");
