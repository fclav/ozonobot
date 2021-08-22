import * as cdk from '@aws-cdk/core';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as lambda from '@aws-cdk/aws-lambda';
import { requestMappingTemplate } from "./mapping-template";

export class OzonoStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const interactionLambda = new lambda.Function(this, 'OzonoInteractionLambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('dist/lambda'),
      handler: 'index.post'
    });

    const integration = new apigw.LambdaIntegration(interactionLambda, {
      proxy: false,
      passthroughBehavior: apigw.PassthroughBehavior.WHEN_NO_MATCH,
      requestTemplates: {'application/json': requestMappingTemplate},
      integrationResponses: [
        {
          selectionPattern: '-',
          statusCode: '200'
        },
        {
          selectionPattern: '.*[UNAUTHORIZED].*',
          statusCode: '401'
        },
      ]
    });

    const api = new apigw.RestApi(this, 'OzonoApi');
    const resource = api.root.addResource('discord', {
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS
      }
    });
    resource.addMethod('POST', integration, {
      authorizationType: apigw.AuthorizationType.NONE,
      methodResponses: [
        {statusCode: '200'},
        {statusCode: '401'},
      ]
    });

    
  }
}
