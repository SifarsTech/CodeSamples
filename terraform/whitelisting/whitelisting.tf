data "local_file" "ip_addresses" {
  filename = "${path.module}/ip_addresses.yaml"
}

data "azurerm_resource_group" "dev" {
  name = "COMPANY_RG_DEV"
}

data "azurerm_mariadb_server" "dev" {
  name                = "company-maria-db-dev"
  resource_group_name = data.azurerm_resource_group.dev.name
}

resource "azurerm_mariadb_firewall_rule" "developers" {
  for_each = { for index, mapping in yamldecode(data.local_file.ip_addresses.content).users : index => mapping }

  resource_group_name = data.azurerm_resource_group.dev.name
  server_name         = data.azurerm_mariadb_server.dev.name

  name             = each.value.name
  start_ip_address = each.value.ip
  end_ip_address   = each.value.ip
}
