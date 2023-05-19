import {exec,spawn} from "child_process";
console.log("dummy entrypoint process")

const run = spawn("npm",["run", "dev"]);

run.stdout.on("data", data =>{
    console.log(data.toString());
})

run.stderr.on("data", data => {
    console.log(data.toString());
});
