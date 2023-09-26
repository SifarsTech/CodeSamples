Firewall
========
Whitelist developer IPs for dev db firewall, to provide temporary access.

For developers:
---------------
- Edit / add ip address of your machine to `ip_addresses.yaml` file along with your name using template:
 ```
  - name: <NAME>
    ip: <IPAddress>
```

**NOTE:**
1. Participaing users are expected to edit only file `ip_addresses.yaml`.
2. Developers are encouraged to remove their entry once they are done.

For operations:
---------------
Terraform resources are being configured in containers.
- `Dockerfile`: multi-stage container image build, includes whitelisting IP addresses.
> NOTE: Second layer i.e. based on `azure-cli` official image didn't provide latest terraform repository, so we are using alpine image to download terraform.
- `.dockerignore`: prevents un-necessary resources including git from getting in conatiner
- `azure-pipeline.yml`: azure pipeline using hosted pool, builds container via `Dockerfile`

- `providers.tf`: terraform providers conf. i.e. only *azurerm* in this case
- `config.tf`: hold configurations for terraform, including version constraints
- `whitelisting.tf`: terraform configuration responsible for firewall configurations

- `ip_addresses.yaml`: collection of objects mapping i.e. user's name /w their ip addresses

