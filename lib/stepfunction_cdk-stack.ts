import * as cdk from 'aws-cdk-lib';
import { ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class StepfunctionCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const stateMachineRole = new Role(this, "StepFunction-cdk-kn", {
      assumedBy: new ServicePrincipal("states.amazonaws.com")
    });
    stateMachineRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("AWSLambdaRole"));
  }
}
