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
const service = new awsx.ecs.FargateService(`${projectName}-td-${getStack()}`, {
    name: `${projectName}-service-${getStack()}`,
    taskDefinitionArgs: {
        containers: {
            reactApp: {
                image: dockerImage/*awsx.ecs.Image.fromPath(`${projectName}-docker-${getStack()}`, "./app")*/,
                memory: 512,
                portMappings: [web],
                environment: [
                    {
                        name: "nginx_pass",
                        value: password
                    }
                ],
            },
        },
    },
});

export const url = web.endpoint.hostname;