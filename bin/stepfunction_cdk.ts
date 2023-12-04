#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { StepfunctionCdkStack } from '../lib/stepfunction_cdk-stack';

const app = new cdk.App();
new StepfunctionCdkStack(app, 'StepfunctionCdkStack', {
});