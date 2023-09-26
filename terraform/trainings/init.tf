terraform {
  required_providers {
    linode = {
      source  = "linode/linode"
    }
  }
}

provider "linode" {
}

data "linode_instance_types" "specific-types" {
  filter {
    name = "class"
    values = ["nanode"]
    match_by = "exact"
  }
  filter {
    name = "vcpus"
    values = [1]
    match_by = "exact"
  }
  order_by = "memory"
  order = "desc"
}

data "linode_images" "specific-images" {
  filter {
    name = "label"
    values = ["Ubuntu 23.04"]
  }

  filter {
    name = "is_public"
    values = ["true"]
  }
}

data "linode_sshkeys" "filtered_ssh" {
    filter {
        name = "label"
        values = ["MacBook"]
    }
}

resource "linode_instance" "web" {
    for_each = {
        user = "1pass@theWord"
    }

    region = "ap-west"

    group = "docker-session"
    tags = [ each.key, "docker", "sifars", "session" ]

    root_pass = each.value
    authorized_keys    = data.linode_sshkeys.filtered_ssh.sshkeys.*.ssh_key

    image = element(data.linode_images.specific-images.images.*.id, 0)

    type = element(data.linode_instance_types.specific-types.types.*.id, 0)
    label = replace(
                join("-",
                [
                    element(data.linode_instance_types.specific-types.types.*.label, 0),
                    each.key
                ]),
                " ",
                "_"
            )
}

output "machines" {
  value = {
    for instance_key, instance_value in linode_instance.web :
    "For ${ instance_key }" => "ssh root@${ instance_value.ip_address }"
  }
}
