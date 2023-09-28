FROM alpine as terraform
RUN apk update && \
    apk add terraform

FROM mcr.microsoft.com/azure-cli
WORKDIR /terraform
COPY --from=terraform /usr/bin/terraform /usr/local/bin/terraform
COPY config.tf .

ARG ARM_CLIENT_ID
ARG ARM_TENANT_ID
ARG ARM_CLIENT_SECRET
ARG ARM_SUBSCRIPTION_ID
ARG AZDO_ORG_SERVICE_URL

ENV ARM_CLIENT_ID=$ARM_CLIENT_ID
ENV ARM_TENANT_ID=$ARM_TENANT_ID
ENV ARM_CLIENT_SECRET=$ARM_CLIENT_SECRET
ENV ARM_SUBSCRIPTION_ID=$ARM_SUBSCRIPTION_ID
ENV AZDO_ORG_SERVICE_URL=$AZDO_ORG_SERVICE_URL

RUN terraform init
COPY . .
RUN terraform apply --auto-approve
