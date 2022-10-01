import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import { getStack } from "@pulumi/pulumi";

const config = new pulumi.Config();
const password = config.require("pass");
const projectName = config.require("name");

const repository = new awsx.ecr.Repository(`${projectName}-repo-${getStack()}`);
const image = repository.buildAndPushImage("./app/react-app");
