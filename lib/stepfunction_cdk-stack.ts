import * as cdk from 'aws-cdk-lib';
import { CfnRule } from 'aws-cdk-lib/aws-events';
import { ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { EmailSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
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

      stateMachineArns.push(stateMachine.stateMachineArn);
    });

    const topicName: string = "notification-failure-statemachine";
    const email: string = "isliverpool@yahoo.co.jp";

    //ステートマシン失敗通知用SNS
    const topic: Topic = new Topic(this, topicName, {
      topicName: topicName,
    });

    const emailSubscription = new EmailSubscription(email);
    topic.addSubscription(emailSubscription);

    const failEventRule: CfnRule = new CfnRule(this, "fail-statemachine-detect", {
      name: "fail-statemachine-detect",
      description: "",
      eventBusName: "default",
      eventPattern: {
        "source": ["aws.states"],
        "detail-type": ["Step Functions Execution Status Change"],
        "detail": {
          "status": ["FAILED"],
          "stateMachineArn": stateMachineArns
        }
      },
      state: "ENABLED",
      targets: [
        {
          id: "sns-notification",
          arn: topic.topicArn
        }
      ]
    }); 


  }
}
