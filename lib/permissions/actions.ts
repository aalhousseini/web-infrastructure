const Cloudformation = {
  Cloudformation: {
    CRUDStacks: [
      "cloudformation:ListStacks",
      "cloudformation:CreateStack",
      "cloudformation:DeleteStack",
      "cloudformation:UpdateStack",
      "cloudformation:DescribeStacks",
    ],
  },
};
const Cloudwatch = {
  Cloudwatch: {
    CreateAndWrite: [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
      "logs:DescribeLogStreams",
    ],
    DescribeAlarms: [
      "cloudwatch:DescribeAlarms",
      "cloudwatch:DescribeAlarmsForMetric",
      "cloudwatch:DescribeAlarmHistory",
    ],
    PutMetricData: ["cloudwatch:PutMetricData"],
    ListMetrics: ["cloudwatch:ListMetrics"],
    GetMetrics: [
      "cloudwatch:GetMetricStatistics",
      "cloudwatch:GetMetricData",
      "cloudwatch:ListMetrics",
    ],
    DescribeLogs: ["logs:DescribeLogGroups"],
    GetLogs: [
      "logs:GetLogGroupFields",
      "logs:GetQueryResults",
      "logs:GetLogEvents",
    ],
    QueryLogs: ["logs:StartQuery", "logs:StopQuery"],
    PutDashboard: ["cloudwatch:PutDashboard"],
    GetDashboard: ["cloudwatch:GetDashboard"],
  },
};

const Kafka = {
  Kafka: {
    Connect: ["kafka-cluster:Connect"],
    DescribeCluster: ["kafka-cluster:DescribeCluster"],
    DescribeTopic: ["kafka-cluster:DescribeTopic"],
    CreateDescribeTopic: [
      "kafka-cluster:CreateTopic",
      "kafka-cluster:DescribeTopic",
    ],
    DeleteTopic: ["kafka-cluster:DeleteTopic"],
    ConnectAndAlter: [
      "kafka-cluster:AlterCluster",
      "kafka-cluster:Connect",
      "kafka-cluster:DescribeCluster",
    ],
    ReadWriteTopic: [
      "kafka-cluster:*Topic*",
      "kafka-cluster:WriteData",
      "kafka-cluster:ReadData",
    ],
    AlterGroup: ["kafka-cluster:AlterGroup", "kafka-cluster:DescribeGroup"],
    GetBrokers: ["kafka:GetBootstrapBrokers"],
    MetaData: ["kafka:ListClusters", "kafka:GetBootstrapBrokers"],
    ListNodes: ["kafka:ListNodes"],
    GetPolicy: ["kafka:GetClusterPolicy"],
    PutPolicy: ["kafka:PutClusterPolicy"],
    DescribeKafka: [
      "kafka:DescribeCluster",
      "kafka:DescribeConfiguration",
      "kafka:DescribeConfigurations",
      "kafka:DescribeBrokerLogs",
      "kafka:DescribeBrokerLogDirs",
      "kafka:DescribeBroker",
      "kafka:DescribeNode",
    ],
    ClusterManagement: ["kafka:UpdateConnectivity"],
  },
};

const EC2 = {
  EC2: {
    All: ["ec2:*"],
    CreateTags: ["ec2:CreateTags"],
    AcceptPeering: ["ec2:AcceptVpcPeeringConnection"],
    CRUDPeering: [
      "ec2:DescribeVpcPeeringConnections",
      "ec2:CreateVpcPeeringConnection",
      "ec2:DeleteVpcPeeringConnection",
      "ec2:AcceptVpcPeeringConnection",
    ],
    DescribeSecurityGroupsVpcsAndSubnets: [
      "ec2:DescribeSecurityGroups",
      "ec2:DescribeSubnets",
      "ec2:DescribeVpcs",
    ],
    Describe: [
      "ec2:DescribeVolumes",
      "ec2:DescribeInstances",
      "ec2:DescribeTags",
      "ec2:DescribeRegions",
      "ec2:DescribeRouteTables",
    ],
    CRUDNetworkInterfaces: [
      "ec2:DeleteNetworkInterface",
      "ec2:DetachNetworkInterface",
      "ec2:CreateNetworkInterface",
      "ec2:DescribeNetworkInterfaces",
    ],
    CRUDRouteTable: [
      "ec2:AssociateRouteTable",
      "ec2:DescribeRouteTables",
      "ec2:CreateRouteTable",
      "ec2:DeleteRouteTable",
      "ec2:DescribeRoute",
      "ec2:CreateRoute",
      "ec2:DeleteRoute",
    ],
  },
};

const Tag = {
  Tag: {
    Get: ["tag:GetResources"],
  },
};

const Lambda = {
  Lambda: {
    TagResource: ["lambda:TagResource"],
    Invoke: ["lambda:InvokeFunction"],
    Get: ["lambda:GetFunction"],
    Delete: ["lambda:DeleteFunction"],
    Create: ["lambda:CreateFunction"],
    Manage: [
      "lambda:GetFunction",
      "lambda:CreateFunction",
      "lambda:DeleteFunction",
      "lambda:TagResource",
      "lambda:ListTags",
      "lambda:PutFunctionConcurrency",
      "lambda:DeleteFunctionConcurrency",
      "lambda:GetLayerVersion",
      "lambda:DeleteLayerVersion",
      "lambda:GetFunctionConfiguration",
      "lambda:GetFunctionCodeSigningConfig",
      "lambda:GetFunctionConcurrency",
      "lambda:ListFunctions",
      "lambda:AddPermission",
      "lambda:UntagResource",
    ],
    ManageEventSource: [
      "lambda:CreateEventSourceMapping",
      "lambda:GetEventSourceMapping",
      "lambda:DeleteEventSourceMapping",
      "lambda:ListEventSourceMappings",
    ],
  },
};

const Elb = {
  Elb: {
    Metadata: [
      "elasticloadbalancing:DescribeLoadBalancers",
      "elasticloadbalancing:DescribeTargetGroups",
      "elasticloadbalancing:DescribeTargetHealth",
    ],
  },
};

const SSM = {
  SSM: {
    ReadParameter: ["ssm:GetParameter"],
    ReadWriteParameter: [
      "ssm:PutParameter",
      "ssm:PutParameters",
      "ssm:DeleteParameter",
      "ssm:DeleteParameters",
      "ssm:GetParameter",
      "ssm:GetParameters",
      "ssm:DescribeParameters",
      "ssm:GetParametersByPath",
    ],
    SendCommand: ["ssm:SendCommand"],
  },
};

const IAM = {
  IAM: {
    GetRole: ["iam:GetRole"],
    PassRole: ["iam:PassRole"],
    CRUDRole: [
      "iam:AttachRolePolicy",
      "iam:CreateRole",
      "iam:DeleteRole",
      "iam:DeleteRolePolicy",
      "iam:DetachRolePolicy",
      "iam:GetRole",
      "iam:GetRolePolicy",
      "iam:ListAttachedRolePolicies",
      "iam:PutRolePolicy",
      "iam:TagRole",
      "iam:UpdateRoleDescription",
    ],
  },
};

const STS = {
  STS: {
    AssumeRole: ["sts:AssumeRole"],
  },
};

const DYNAMODB = {
  DYNAMODB: {
    Scan: ["dynamodb:Scan"],
    Query: ["dynamodb:Query"],
    UpdateItem: ["dynamodb:UpdateItem"],
    GetItem: ["dynamodb:GetItem", "dynamodb:BatchGetItem"],
    PutItem: ["dynamodb:PutItem"],
    DeleteItem: ["dynamodb:DeleteItem"],
    EnableStream: [
      "dynamodb:DescribeStream",
      "dynamodb:GetRecords",
      "dynamodb:ListStreams",
      "dynamodb:GetShardIterator",
    ],
  },
};

const API = {
  API: {
    Invoke: ["execute-api:Invoke"],
  },
};

const BACKUP = {
  BACKUP: {
    StartBackupJob: ["backup:StartBackupJob"],
  },
};

const SNS = {
  SNS: {
    Publish: ["sns:Publish"],
    Create: [
      "sns:CreateTopic",
      "sns:DeleteTopic",
      "sns:GetTopicAttributes",
      "sns:SetTopicAttributes",
      "sns:TagResource",
    ],
  },
};
const SQS = {
  SQS: {
    Create: [
      "sqs:CreateQueue",
      "sqs:DeleteQueue",
      "sqs:GetQueueUrl",
      "sqs:GetQueueAttributes",
      "sqs:TagQueue",
      "sqs:UntagQueue",
    ],
    SendMessage: ["sqs:sendmessage"],
  },
};

const S3 = {
  S3: {
    Get: [
      "s3:GetObject",
      "s3:ListObject",
      "s3:GetLifecycleConfiguration",
      "s3:ListBucket",
      "s3:ListObjectsV2",
    ],
    Put: ["s3:PutObject"],
    Copy: ["s3:CopyObject"],
  },
};

const SecretsManagager = {
  SecretsManager: {
    Read: [
      "secretsmanager:GetResourcePolicy",
      "secretsmanager:GetSecretValue",
      "secretsmanager:DescribeSecret",
      "secretsmanager:ListSecretVersionIds",
    ],
    ListSecerets: ["secretsmanager:ListSecrets"],
    Write: [
      "secretsmanager:UntagResource",
      "secretsmanager:PutSecretValue",
      "secretsmanager:CreateSecret",
      "secretsmanager:DeleteSecret",
      "secretsmanager:CancelRotateSecret",
      "secretsmanager:UpdateSecret",
      "secretsmanager:StopReplicationToReplica",
      "secretsmanager:ReplicateSecretToRegions",
      "secretsmanager:RestoreSecret",
      "secretsmanager:RotateSecret",
      "secretsmanager:UpdateSecretVersionStage",
      "secretsmanager:RemoveRegionsFromReplication",
      "secretsmanager:TagResource",
    ],
    ReadOneSecret: ["secretsmanager:GetSecretValue"],
  },
};

const SES = {
  SES: {
    SendEmail: ["ses:SendEmail"],
  },
};

const KMS = {
  KMS: {
    Read: ["kms:Decrypt", "kms:GenerateDataKey"],
    Describe: ["kms:DescribeKey"],
  },
};

const AmazonManagedPrometheus = {
  AMP: {
    Read: [
      "aps:ListWorkspaces",
      "aps:DescribeWorkspace",
      "aps:QueryMetrics",
      "aps:GetLabels",
      "aps:GetSeries",
      "aps:GetMetricMetadata",
      "aps:Get",
      "aps:List",
    ],
    Describe: ["aps:Describe"],
  },
};

const RDS = {
  RDS: {
    ConnectToRds: ["rds-db:connect"],
    DescribeDBInstances: ["rds:DescribeDBInstances"],
  },
};

export const Actions = {
  ...API,
  ...Cloudformation,
  ...Cloudwatch,
  ...Kafka,
  ...EC2,
  ...Tag,
  ...Lambda,
  ...Elb,
  ...SSM,
  ...IAM,
  ...STS,
  ...DYNAMODB,
  ...BACKUP,
  ...SNS,
  ...SQS,
  ...S3,
  ...SecretsManagager,
  ...KMS,
  ...AmazonManagedPrometheus,
  ...SES,
  ...RDS,
};
