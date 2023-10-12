import * as cdk from 'aws-cdk-lib';
import { ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { DefinitionBody, StateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

type paramType = {
  stateMachineName: string,
  jsonPath: string,
}

export class StepfunctionCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const stateMachineRole = new Role(this, "StepFunction-cdk-kn", {
      assumedBy: new ServicePrincipal("states.amazonaws.com")
    });

    const awsLambdaRoleArn = "arn:aws:iam::aws:policy/service-role/AWSLambdaRole";

    const lambdarole = ManagedPolicy.fromManagedPolicyArn(this, "AWSLambdaRole", awsLambdaRoleArn);
    stateMachineRole.addManagedPolicy(lambdarole);



    const params: paramType[] = [
      {
        stateMachineName: "test1",
        jsonPath: "./json/test.json"
      },
      {
        stateMachineName: "test2",
        jsonPath: "./json/test.json"
      },
    ];

    const stateMachineArns: string[] = [];

    params.forEach((param) => {
      const {stateMachineName, jsonPath} = param;
      const stateMachine: StateMachine = new StateMachine(this, stateMachineName, {
        stateMachineName,
        definitionBody: DefinitionBody.fromFile(jsonPath),
        role: stateMachineRole
      });
    });
  }
}
