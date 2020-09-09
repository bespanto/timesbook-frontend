terraform {
  required_providers {
    docker = {
      source = "terraform-providers/docker"
    }
  }
}

provider "docker" {

# registry_auth {
#    address = "localhost:5000"
#    config_file = "${pathexpand("~/.docker/config.json")}"
#  }
}


resource "docker_image" "timesbook" {
  name         = "localhost:5000/timesbook-front"
  keep_locally = false
}

resource "docker_container" "timesbook" {
  image = docker_image.timesbook.latest
  name  = "timesbook-app"
  ports {
    internal = 80
    external = 80
  }
}

