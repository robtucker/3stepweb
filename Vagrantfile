# -*- mode: ruby -*-

VAGRANT_API_VERSION=2
BOX_NAME = "ubuntu/trusty64"
BOX_MEMORY = "1024"
BOX_CPUS = "6"
HOST_NAME = "3stepweb"
HOST_CODE_PWD = "."
GUEST_CODE_PWD = "/var/www/3stepweb"
GUEST_CODE_OWNER = "www-data"
GUEST_CODE_GROUP = "www-data"
GUEST_NETWORK_IP = "10.0.0.124"
DJANGO_PORT = "8000"
NODE_PORT = "3001"
REDIS_PORT = "6379"
ELASTIC_PORT = "9200"
MYSQL_PORT = "3306"

Vagrant.configure(VAGRANT_API_VERSION) do |config|
  config.vm.box = BOX_NAME

  config.vm.network :private_network, ip: GUEST_NETWORK_IP
  config.vm.hostname = HOST_NAME

  #config.vm.network "forwarded_port", guest: DJANGO_PORT, host: DJANGO_PORT, protocol: "tcp"
  #config.vm.network "forwarded_port", guest: NODE_PORT, host: NODE_PORT, protocol: "tcp"
  #config.vm.network "forwarded_port", guest: REDIS_PORT, host: REDIS_PORT, protocol: "tcp"
  #config.vm.network "forwarded_port", guest: ELASTIC_PORT, host: ELASTIC_PORT, protocol: "tcp"
  #config.vm.network "forwarded_port", guest: MYSQL_PORT, host: MYSQL_PORT, protocol: "tcp"

  config.vm.synced_folder ".", "/vagrant", disabled: false
  config.vm.synced_folder HOST_CODE_PWD, GUEST_CODE_PWD, owner: GUEST_CODE_OWNER, group: GUEST_CODE_GROUP

  config.vm.provider "virtualbox" do |vb|
    #vb.gui = "true"
    vb.customize ["modifyvm", :id, "--memory", BOX_MEMORY]
    vb.customize ["modifyvm", :id, "--cpus", BOX_CPUS]
  end

  config.vm.provision "ansible" do |ansible|
    ansible.playbook = "ansible/playbook.yml"
  end
end

