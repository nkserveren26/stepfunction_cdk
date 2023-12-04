## CDKの構成要素
CDKはコンストラクトと呼ばれる要素で構成されている。  
コンストラクトには以下3つがあり、これらは階層構成となっている。  
　App  
　Stack  
　Construct  

<br>

### App
最上位に位置するコンストラクト。  
CDKのエントリポイントとなり、cdk deployを実行すると、このコンストラクトが実行される。  
以下のcdk.Appがこのコンストラクトに該当し、この下に1つあるいは複数のStackコンストラクトが属する形となる。  
```sample.ts
#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { StepfunctionCdkStack } from '../lib/stepfunction_cdk-stack';

const app = new cdk.App();
new StepfunctionCdkStack(app, 'StepfunctionCdkStack', {
});
```

### Stack
Appの配下に属するコンストラクト。  
CloudFormationのスタックと1:1で対応する。  
StackはAppの配下に属するので、インスタンス化する際はscopeにAppインスタンスを指定する。
```sample.ts  
const app = new cdk.App();
new StepfunctionCdkStack(app, 'StepfunctionCdkStack', {
});
```

scopeにはConstructクラスが入ってくるので、クラス定義ではscopeの型にConstructを指定する。  
```sample.ts
export class StepfunctionCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    ...
  }
}
```

### Construct