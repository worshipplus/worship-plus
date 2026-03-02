# Worship+ Infrastructure

**Infrastructure as Code (Terraform + Kubernetes)**

**Organização:** [worshipplus](https://github.com/worshipplus)  
**Repositório:** https://github.com/worshipplus/worship-plus-infra.git  
**Visibilidade:** Private

---

## ⚠️ Status: **Planejado (P1-P2)**

Este repositório será criado em **P1-P2** quando migrarmos de Supabase + Vercel para infraestrutura AWS gerenciada.

---

## 📖 Propósito

**Infrastructure as Code (IaC)** para provisionar e gerenciar:
- **Storage:** S3 (uploads), Glacier (archive), CloudFront (CDN)
- **Compute:** EKS (Kubernetes), ECS (containers), Lambda (serverless)
- **Database:** RDS (Postgres backup), DynamoDB (cache)
- **Cache:** Redis/ElastiCache
- **Queue:** SQS, SNS (async processing)
- **Monitoring:** CloudWatch, Prometheus, Grafana

---

## 🚦 Roadmap de Infraestrutura

### P0 (MVP - Now)
**Serviços Gerenciados (SaaS):**
- ✅ **Supabase:** Postgres + Auth + RLS + Realtime
- ✅ **Vercel:** Deploy frontend (React + Vite)
- ✅ **GitHub Actions:** CI/CD

**Custo:** ~$0-25/mês (free tiers)

**Sem IaC necessário.**

---

### P1 (Após MVP - Sprint 5-6)
**Adicionar Storage AWS:**
- 🔄 **S3:** Upload de áudios (WAV, MP3, AAC)
- 🔄 **Glacier:** Archive de gravações antigas (>6 meses)
- 🔄 **CloudFront:** CDN para streaming

**Features que precisam:**
- US-INT-001: Upload de vídeos de shows (YouTube Link)
- US-INT-003: Player de áudio in-app

**Terraform modules:**
- `modules/s3-media-bucket`
- `modules/cloudfront-distribution`
- `modules/lifecycle-glacier`

**Custo adicional:** ~$10-50/mês (dependendo do volume de uploads)

---

### P2 (6-9 meses após MVP)
**Adicionar Backend + Cache:**
- 🔄 **ECS ou EKS:** Deploy backend NestJS
- 🔄 **Redis:** Cache de queries pesadas
- 🔄 **SQS:** Fila de transcodificação de áudio

**Features que precisam:**
- Backend BFF (orquestração de múltiplos serviços)
- Transcodificação serverless (WAV → MP3)
- Cache de relatórios/dashboards

**Terraform modules:**
- `modules/ecs-service`
- `modules/elasticache-redis`
- `modules/sqs-queue`

**Custo adicional:** ~$50-150/mês

---

### P3 (Multi-tenancy - 12+ meses)
**Escala para múltiplas igrejas:**
- 🔄 **EKS:** Kubernetes multi-tenant
- 🔄 **RDS Multi-AZ:** HA database
- 🔄 **Auto Scaling:** Load-based scaling

**Custo estimado:** $300-500/mês (50+ igrejas ativas)

---

## 🛠️ Stack Técnico

### IaC
- **Terraform 1.6+** (provisioning)
- **Terragrunt** (DRY configs, opcional)

### Orchestration
- **Kubernetes 1.28+** (EKS)
- **Helm 3** (charts para apps)

### CI/CD
- **GitHub Actions** (terraform plan/apply)
- **ArgoCD** (GitOps, opcional P2)

### Monitoring
- **CloudWatch** (logs, métricas AWS)
- **Prometheus** (métricas custom, P2)
- **Grafana** (dashboards, P2)

### Secrets
- **AWS Secrets Manager** (prod)
- **GitHub Secrets** (CI/CD)

---

## 📂 Estrutura

```
worship-plus-infra/
├── README.md                          # Este arquivo
├── .gitignore
│
├── terraform/
│   ├── environments/                  # Configurações por ambiente
│   │   ├── dev/
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   ├── outputs.tf
│   │   │   └── terraform.tfvars
│   │   ├── staging/
│   │   │   └── [mesma estrutura]
│   │   └── prod/
│   │       └── [mesma estrutura]
│   │
│   ├── modules/                       # Módulos reutilizáveis
│   │   ├── s3-media-bucket/
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   └── outputs.tf
│   │   ├── cloudfront-distribution/
│   │   ├── ecs-service/
│   │   ├── eks-cluster/
│   │   ├── elasticache-redis/
│   │   └── rds-postgres/
│   │
│   └── backend.tf                     # Remote state (S3 + DynamoDB)
│
├── kubernetes/
│   ├── base/                          # Kustomize base
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── ingress.yaml
│   │
│   ├── overlays/                      # Kustomize overlays
│   │   ├── dev/
│   │   ├── staging/
│   │   └── prod/
│   │
│   └── helm/                          # Helm charts (opcional)
│       └── worship-plus/
│           ├── Chart.yaml
│           ├── values.yaml
│           └── templates/
│
├── scripts/
│   ├── setup-aws-profile.sh          # Setup inicial
│   ├── deploy-terraform.sh           # Helper para terraform apply
│   └── rollback.sh                   # Rollback de deploy
│
└── docs/
    ├── runbooks/
    │   ├── incident-response.md
    │   ├── scaling.md
    │   └── disaster-recovery.md
    └── architecture/
        └── diagrams/                  # Arquitetura AWS
```

---

## 🚀 Setup (Quando P1)

### 1. Pré-requisitos

- AWS CLI configurado
- Terraform 1.6+
- kubectl (se usar EKS)
- Conta AWS (root ou IAM com admin)

---

### 2. Configurar AWS CLI

```bash
aws configure
# AWS Access Key ID: [seu_access_key]
# AWS Secret Access Key: [seu_secret_key]
# Default region: us-east-1
# Default output: json
```

---

### 3. Inicializar Terraform (Backend S3)

```bash
cd terraform/environments/dev

# Criar bucket para remote state (apenas 1x)
aws s3 mb s3://worship-plus-terraform-state
aws dynamodb create-table \
  --table-name worship-plus-terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST

# Inicializar
terraform init
```

---

### 4. Plan e Apply

```bash
# Ver mudanças
terraform plan

# Aplicar (cria infra)
terraform apply
# Type 'yes' to confirm

# Ver outputs
terraform output
```

---

## 📝 Terraform Modules

### Module: s3-media-bucket (P1)

**Propósito:** Bucket S3 para uploads de áudio/vídeo

```hcl
# terraform/modules/s3-media-bucket/main.tf
resource "aws_s3_bucket" "media" {
  bucket = var.bucket_name

  tags = {
    Name        = var.bucket_name
    Environment = var.environment
  }
}

resource "aws_s3_bucket_versioning" "media" {
  bucket = aws_s3_bucket.media.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "media" {
  bucket = aws_s3_bucket.media.id

  rule {
    id     = "archive-old-media"
    status = "Enabled"

    transition {
      days          = 180  # 6 meses
      storage_class = "GLACIER"
    }

    expiration {
      days = 1095  # 3 anos
    }
  }
}

resource "aws_s3_bucket_cors_configuration" "media" {
  bucket = aws_s3_bucket.media.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST"]
    allowed_origins = ["https://app.worshipplus.com"]
    max_age_seconds = 3000
  }
}
```

**Uso:**

```hcl
# terraform/environments/prod/main.tf
module "media_bucket" {
  source = "../../modules/s3-media-bucket"

  bucket_name = "worship-plus-media-prod"
  environment = "prod"
}
```

---

### Module: cloudfront-distribution (P1)

**Propósito:** CDN para streaming de áudio

```hcl
# terraform/modules/cloudfront-distribution/main.tf
resource "aws_cloudfront_distribution" "cdn" {
  origin {
    domain_name = var.s3_bucket_domain
    origin_id   = "S3-${var.s3_bucket}"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
    }
  }

  enabled             = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${var.s3_bucket}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  price_class = "PriceClass_100"  # US/EU only

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["BR"]  # Apenas Brasil
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
```

---

### Module: ecs-service (P2)

**Propósito:** Deploy backend NestJS em ECS

```hcl
# terraform/modules/ecs-service/main.tf
resource "aws_ecs_cluster" "main" {
  name = "${var.project}-${var.environment}"
}

resource "aws_ecs_task_definition" "backend" {
  family                   = "${var.project}-backend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.cpu
  memory                   = var.memory

  container_definitions = jsonencode([{
    name  = "backend"
    image = "${var.ecr_url}:${var.image_tag}"
    
    portMappings = [{
      containerPort = 3001
      hostPort      = 3001
      protocol      = "tcp"
    }]

    environment = [
      { name = "NODE_ENV", value = var.environment },
      { name = "PORT", value = "3001" },
    ]

    secrets = [
      { name = "SUPABASE_URL", valueFrom = "${var.secrets_arn}:SUPABASE_URL::" },
      { name = "DATABASE_URL", valueFrom = "${var.secrets_arn}:DATABASE_URL::" },
    ]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group         = "/ecs/${var.project}-backend"
        awslogs-region        = var.aws_region
        awslogs-stream-prefix = "ecs"
      }
    }
  }])
}

resource "aws_ecs_service" "backend" {
  name            = "${var.project}-backend"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.private_subnets
    security_groups  = [aws_security_group.backend.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.backend.arn
    container_name   = "backend"
    container_port   = 3001
  }
}
```

---

## 🔐 Secrets Management

### AWS Secrets Manager

```bash
# Criar secret
aws secretsmanager create-secret \
  --name worship-plus/prod/supabase \
  --secret-string '{"SUPABASE_URL":"https://...","SUPABASE_ANON_KEY":"..."}'

# Atualizar secret
aws secretsmanager update-secret \
  --secret-id worship-plus/prod/supabase \
  --secret-string '{"SUPABASE_URL":"https://...","SUPABASE_ANON_KEY":"..."}'

# Listar secrets
aws secretsmanager list-secrets --query 'SecretList[?starts_with(Name, `worship-plus`)].Name'
```

---

### Terraform (referência de secrets)

```hcl
data "aws_secretsmanager_secret" "supabase" {
  name = "worship-plus/${var.environment}/supabase"
}

data "aws_secretsmanager_secret_version" "supabase" {
  secret_id = data.aws_secretsmanager_secret.supabase.id
}

# Uso em ECS task definition
secrets = [
  {
    name      = "SUPABASE_URL"
    valueFrom = "${data.aws_secretsmanager_secret.supabase.arn}:SUPABASE_URL::"
  }
]
```

---

## 🚀 CI/CD (GitHub Actions)

### Workflow: Terraform Plan

```yaml
# .github/workflows/terraform-plan.yml
name: Terraform Plan

on:
  pull_request:
    paths:
      - 'terraform/**'

jobs:
  plan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
        with:
          terraform_version: 1.6.0
      
      - name: Configure AWS
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Terraform Init
        run: |
          cd terraform/environments/${{ github.event.inputs.environment }}
          terraform init
      
      - name: Terraform Plan
        run: |
          cd terraform/environments/${{ github.event.inputs.environment }}
          terraform plan -out=tfplan
      
      - name: Comment PR
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '✅ Terraform plan completed'
            })
```

---

### Workflow: Terraform Apply

```yaml
# .github/workflows/terraform-apply.yml
name: Terraform Apply

on:
  push:
    branches:
      - main
    paths:
      - 'terraform/**'

jobs:
  apply:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
      
      - name: Configure AWS
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Terraform Init
        run: |
          cd terraform/environments/prod
          terraform init
      
      - name: Terraform Apply
        run: |
          cd terraform/environments/prod
          terraform apply -auto-approve
```

---

## 📊 Monitoramento

### CloudWatch Alarms

```hcl
# terraform/modules/monitoring/main.tf
resource "aws_cloudwatch_metric_alarm" "high_cpu" {
  alarm_name          = "${var.project}-${var.environment}-high-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = 300
  statistic           = "Average"
  threshold           = 80

  dimensions = {
    ClusterName = aws_ecs_cluster.main.name
    ServiceName = aws_ecs_service.backend.name
  }

  alarm_actions = [aws_sns_topic.alerts.arn]
}

resource "aws_cloudwatch_metric_alarm" "high_memory" {
  alarm_name          = "${var.project}-${var.environment}-high-memory"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "MemoryUtilization"
  namespace           = "AWS/ECS"
  period              = 300
  statistic           = "Average"
  threshold           = 85

  dimensions = {
    ClusterName = aws_ecs_cluster.main.name
    ServiceName = aws_ecs_service.backend.name
  }

  alarm_actions = [aws_sns_topic.alerts.arn]
}
```

---

## 🔗 Referências

- **Documentação:** https://github.com/worshipplus/worship-plus
- **ARCHITECTURE-DECISIONS:** Quando migrar de Supabase para AWS
- **MVP-ROADMAP:** Features que precisam de infra (US-INT-001, US-INT-003)
- **Inspiração:** https://github.com/MatheusLimaGomes/dvn-workshop-jan-dia-1

---

## 🤝 Contribuindo (Quando P1)

### Commit (Conventional Commits)

```bash
git commit -m "feat(infra): adiciona módulo S3 media bucket [US-INT-001]"
```

### Pull Request

```bash
gh pr create --title "feat(infra): adiciona S3 + CloudFront para uploads [US-INT-001]" \
             --body "Provisiona:
- S3 bucket com lifecycle (→ Glacier após 6 meses)
- CloudFront distribution (cache de áudio)
- IAM policies para upload direto

Terraform modules:
- modules/s3-media-bucket
- modules/cloudfront-distribution

Terraform plan: ✅ (0 errors)

Related: US-INT-001"
```

---

## 📞 Contato

**Issues:** https://github.com/worshipplus/worship-plus-infra/issues  
**Organização:** https://github.com/worshipplus

---

**Este repositório será criado em P1, quando implementarmos upload de mídia.**

**Última atualização:** 2 de Março de 2026
