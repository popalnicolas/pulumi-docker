import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import { getStack } from "@pulumi/pulumi";

const config = new pulumi.Config();
const password = config.require("htpasswd");
const projectName = config.require("name");

const repository = new awsx.ecr.Repository(`${projectName}-repo-${getStack()}`);
const dockerImage = repository.buildAndPushImage("./app");

const web = new awsx.elasticloadbalancingv2.NetworkListener(`${projectName}-lb-${getStack()}`, { port: 80 });
