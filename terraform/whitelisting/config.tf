terraform {
  required_version = "~> 1.3.0"

  required_providers {
    local = {
      source  = "hashicorp/local"
      version = "~> 2.1.0"
    }

    azurerm = {
      source  = "hashicorp/azurerm"
      version = "2.93.1"
    }
  }

  backend "azurerm" {
    resource_group_name  = "firewall_whitelisting_backend"
    storage_account_name = "tfstatewhitelistdevdb"
    container_name       = "tfstate"
    key                  = "terraform.tfstate"
  }
}
