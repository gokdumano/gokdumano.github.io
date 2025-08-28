+++
title = "Building Your Database Lab: Rocky Linux 9 on VirtualBox"
date = "2025-08-19"
author = "Deniz Gökduman"
cover = "img/assets_task_01k30y8bsrf0xt0692htj3qc6m_1755599735_img_0.webp"
coverCredit = 'Building Your Database Lab'
coverAltText = 'Complete guide to setting up Rocky Linux 9 on Oracle VirtualBox for database environments'

tags = ["Rocky Linux", "VirtualBox", "DBA", "Linux Installation", "System Security", "Network Configuration", "Virtual Machine"]
keywords = ["Rocky Linux 9", "VirtualBox", "database lab setup", "DBA environment", "Linux installation", "system security", "network configuration", "PostgreSQL setup", "Oracle database", "virtual machine"]
description = "Complete guide to setting up Rocky Linux 9 on Oracle VirtualBox for database environments. Includes security hardening, network configuration, and performance optimization for DBAs."

toc = true
showFullContent = false
slug = "rocky-linux-9-virtualbox-database-lab-setup"
canonical = "https://gokdumano.github.io/posts/rocky-linux-9-virtualbox-database-lab-setup/"
mermaid = true
+++


# Building Your Database Lab: Rocky Linux 9 on VirtualBox

Welcome back! In my previous post, we explored the open source philosophy and Linux distributions. Today, we're getting hands-on by building a virtual lab environment that will serve as the foundation for our database experiments and learning.

**Why Rocky Linux 9?** It's the spiritual successor to CentOS, offering enterprise-grade stability without licensing costs—perfect for database workloads and learning environments.

## 0. Prerequisites

Before we begin, ensure you have:

- **Oracle VirtualBox** installed (version 7.0 or later) from [virtualbox.org](https://www.virtualbox.org/wiki/Downloads)
- **Rocky Linux 9 ISO** downloaded from [rockylinux.org](https://rockylinux.org/download)
- At least **4GB RAM** available for the VM
- **40GB** free disk space
- **Virtualization enabled** in BIOS/UEFI

{{<notice info>}}
The list of official mirrors can be found [here](https://mirrors.rockylinux.org/mirrormanager/mirrors), 
which is advisable for one to select the mirror that is geographically closest to them. 
To build our lab, the latest release of Rocky Linux 9 is preferred.
{{</notice>}}

### Quick Download Commands (Windows)

```batch
:: Download Rocky Linux 9 ISO
curl                                 ^
--progress-bar                       ^
--remote-name                        ^
--location                           ^
--output-dir %userprofile%\downloads ^
https://download.rockylinux.org/pub/rocky/9.6/isos/x86_64/Rocky-9-latest-x86_64-minimal.iso

:: Verify checksum integrity
curl                                 ^
--output CHECKSUM                    ^
--silent                             ^
--location                           ^
--output-dir %userprofile%\downloads ^
https://download.rockylinux.org/pub/rocky/9.6/isos/x86_64/Rocky-9-latest-x86_64-minimal.iso.CHECKSUM

type %userprofile%\downloads\CHECKSUM
:: # Rocky-9-latest-x86_64-minimal.iso: 2252013568 bytes
:: SHA256 (Rocky-9-latest-x86_64-minimal.iso) = aed9449cf79eb2d1c365f4f2561f923a80451b3e8fdbf595889b4cf0ac6c58b8

certutil -hashfile %userprofile%\downloads\Rocky-9-latest-x86_64-minimal.iso sha256 | findstr /v "hash"
:: aed9449cf79eb2d1c365f4f2561f923a80451b3e8fdbf595889b4cf0ac6c58b8
```

{{<notice info>}}
The latest stable version of VirtualBox can be found 
[here](https://download.virtualbox.org/virtualbox/LATEST-STABLE.TXT). 
However, those who are comfortable with the 'bleeding edge' can find 
the latest version [here](https://download.virtualbox.org/virtualbox/LATEST.TXT).
{{</notice>}}

```batch
:: Extract what the latest stable version is
:: as of writing this post the latest stable version is '7.1.12'
curl       ^
--location ^
--silent   ^
https://download.virtualbox.org/virtualbox/LATEST-STABLE.TXT
:: 7.1.12 

curl https://download.virtualbox.org/virtualbox/7.1.12/ | findstr /c:"Win.exe"
:: <a href="VirtualBox-7.1.12-169651-Win.exe">VirtualBox-7.1.12-169651-Win.exe</a>  14-Jul-2025 20:31  119M

:: Download Oracle VirtualBox
curl                                 ^
--progress-bar                       ^
--remote-name                        ^
--location                           ^
--output-dir %userprofile%\downloads ^
https://download.virtualbox.org/virtualbox/7.1.12/VirtualBox-7.1.12-169651-Win.exe
```

## 1. Virtual Machine Creation

You can create your VM either through the VirtualBox GUI or using the powerful command-line interface. 
For this article, the latter is covered.

Oracle VM VirtualBox offers the following tools to control virtualization engine settings, create new VMs, and work on existing VMs within Oracle VM VirtualBox:

* VirtualBox Manager, the GUI for controlling Oracle VM VirtualBox
* VBoxManage, the CLI to Oracle VM VirtualBox
* The Main API, which is implemented using the Component Object Model (COM/XPCOM)
* The web service, which maps nearly the entire Main API for web applications

{{<mermaid>}}
block-beta
columns 1
  block
    A["VirtualBox GUI"]
    B["VBoxManage <a href="https://www.oracle.com/technical-resources/articles/it-infrastructure/admin-manage-vbox-cli.html">#dagger;</a>"]
    C["Web Service API"]
  end
  space
  D["VirtualBox Main API: COM/XPCOM"]
  space
  E["Virtualization Engine"]
  A --> D
  B --> D
  C --> D
  D --> E
  style B fill:#ff0000;
{{</mermaid>}}

### 1.1 VM Configuration Summary

```batch
:: SET will remain only for the duration of the current CMD session.
set "PATH=%PATH%;C:\Program Files\Oracle\VirtualBox"

:: To set environment variables permanently, SETX command can be used
:: setx PATH "%PATH%;C:\Program Files\Oracle\VirtualBox"

VBoxManage --version
:: 7.1.12r169651

VBoxManage list --long ostypes | findstr /c:"RedHat9_64"
:: ID:               RedHat9_64
```

**Name and Operating System:**
- **Name**: `rocky-linux-db-lab`
- **Type**: Linux
- **Subtype**: Red Hat
- **Version**: Red Hat 9.x (64-bit)

```batch
:: --name          The name of the VM
:: --basefolder    Specifies the name of the folder in which to
::                 save the machine configuration file for the new VM.
:: --ostype        Specifies the guest OS to run in the VM.
:: --register      Registers the VM with your Oracle VM VirtualBox
::                 installation.

VBoxManage createvm              ^
--name rocky-linux-db-lab        ^
--basefolder "E:\VirtualBox VMs" ^
--ostype RedHat9_64              ^
--register
```

{{<notice tip>}}

**What happens when you no longer need the VM?**

The `VBoxManage unregistervm` command unregisters a virtual machine (VM).

```batch 
VBoxManage unregistervm rocky-linux-db-lab --delete-all
```
{{</notice>}}

**Hardware:**
- **Base Memory**: 4096 MB (4GB) minimum
- **Processors**: Assign 2 CPU cores

```batch
:: --memory 4096    Allocates 4GB RAM - critical for high-traffic database
::                  workloads
:: --cpus 2         Assigns 2 virtual CPUs from 4 physical cores, leaving 
::                  resources for other VMs
:: --vram 16        Minimal video memory allocation since database servers
::                  don't need graphics
::
VBoxManage modifyvm ^
rocky-linux-db-lab  ^
--memory 4096       ^
--cpus 2            ^
--vram 16
```

**Hard Disk:**
- **Hard Disk File Location**: Choose an appropriate location
- **Hard Disk File Size**: 40 GB
- **Hard Disk File Type and Variant**: VDI (VirtualBox Disk Image)
- **Uncheck** `Pre-allocate Full Size`
- **Check** `Host I/O Cache` for better performance
- Attach Rocky Linux 9 ISO to `Controller:IDE`

```batch
:: ====================================================================
:: The `VBoxManage createmedium` command creates a new medium, such 
:: as a disk image file.
:: ====================================================================
:: --size               Specifies the image capacity in one megabyte units.
:: --format             Specifies the file format of the output file.
:: --variant=Standard   The variant that has a dynamically allocated file size.
:: --filename           Specifies the absolute path name to a file on the host
::                      file system.
:: ====================================================================
:: This creates a 40GB dynamically allocated disk that grows as needed.
:: ====================================================================
VBoxManage createmedium disk ^
--size 40960                 ^
--format VDI                 ^
--variant Standard           ^
--filename "E:\VirtualBox VMs\rocky-linux-db-lab\rocky-linux-db-lab.vdi"
```

```batch
:: ====================================================================
:: The `VBoxManage storagectl` command enables you to attach, modify,
:: and remove a storage controller.
:: ====================================================================
:: --name          Specifies the name of the storage controller.
:: --add           Specifies the type of the system bus to which to connect
::                 the storage controller.
:: --portcount     This specifies the number of ports the storage controller
::                 should support.
:: --hostiocache   Specifies whether to use the host I/O cache for all disk
::                 images attached to this storage controller.
:: --bootable      Specifies whether this controller is bootable.
:: ====================================================================
:: Create SATA controller for the hard disk:
:: ====================================================================
VBoxManage storagectl ^
rocky-linux-db-lab    ^
--name "sata01"       ^
--add sata            ^
--portcount 1         ^
--hostiocache on      ^
--bootable on
```

```batch
:: ====================================================================
:: Create IDE controller for the installation media:
:: ====================================================================
VBoxManage storagectl ^
rocky-linux-db-lab    ^
--name "ide01"        ^
--add ide
```

```batch
:: ====================================================================
:: The `VBoxManage storageattach` command enables you to manage a storage medium
:: that you connectedto a storage controller by using the `VBoxManage storagectl`
:: command.
:: ====================================================================
:: --storagectl        Specifies the name of the storage controller. 
:: --port              Specifies the port number of the storage controller
::                     to modify.
:: --device            Specifies the port's device number to modify.
:: --type              Specifies the drive type to which the medium is associated.
:: --medium=filename   Specifies the full path of an existing disk image 
::                     to attach to the specified device slot.
:: ====================================================================
:: Attach the virtual hard disk:
:: ====================================================================
VBoxManage storageattach ^
rocky-linux-db-lab       ^
--storagectl "sata01"    ^
--port 0                 ^
--device 0               ^
--type hdd               ^
--medium "E:\VirtualBox VMs\rocky-linux-db-lab\rocky-linux-db-lab.vdi"
```

```batch
:: ====================================================================
:: Attach the Rocky Linux ISO:
:: ====================================================================
VBoxManage storageattach ^
rocky-linux-db-lab       ^
--storagectl "ide01"     ^
--port 0                 ^
--device 0               ^
--type dvddrive          ^
--medium %userprofile%\downloads\Rocky-9-latest-x86_64-minimal.iso
```

**Audio Settings:**
- **Uncheck** `Enable Audio` to avoid unnecessary system load
```batch
:: --audio-enabled off    Disables audio completely - not needed for server workloads
:: --usb-ohci off         Disables all USB controllers for security and performance
:: --usb-ehci off
:: --usb-xhci off
:: --graphicscontroller   Specifies the graphics controller type to use.
::
VBoxManage modifyvm ^
rocky-linux-db-lab  ^
--audio-enabled off ^
--usb-ohci off      ^
--usb-ehci off      ^
--usb-xhci off      ^
--graphicscontroller vmsvga
```


**Network Settings:**
- **Adapter 1**: NAT (for internet access)
- **Adapter 2**: Host-only Adapter (for host machine access)

```batch
:: Check if there is any host-only network
VBoxManage list hostonlyifs | findstr /b "Name:"
:: Name:            VirtualBox Host-Only Ethernet Adapter
```

```batch
:: ====================================================================
:: We can create a new Host-Only Network in case there is none:
:: VBoxManage hostonlyif create
:: ====================================================================
:: --ip        Specifies the IPv4 IP address for the network interface.
:: --netmask   Specifies the IPv4 netmask of the network interface.
:: ====================================================================
VBoxManage hostonlyif ipconfig           ^
 "VirtualBox Host-Only Ethernet Adapter" ^
--ip 192.168.56.1                        ^
--netmask 255.255.255.0
```

```batch
:: ====================================================================
:: --nic1 nat              First adapter uses NAT for internet access
:: --nic-type1 82545EM     Intel PRO/1000 MT Server network adapter for high 
::                         performance
:: --cable-connected1 on   Ensures NAT adapter is connected
:: --nic2 hostonly         Second adapter for VM-to-VM communication
:: --nic-type2 82545EM     Intel PRO/1000 MT Server for host-only network
:: --cable-connected2 on   Ensures host-only adapter is connected
:: --host-only-adapter2    Specifies which host-only interface to use 
::                         (may need to be created first)
:: ====================================================================
VBoxManage modifyvm rocky-linux-db-lab ^
--nic1 nat                             ^
--cable-connected1 on                  ^
--nic2 hostonly                        ^
--cable-connected2 on                  ^
--host-only-adapter2 "VirtualBox Host-Only Ethernet Adapter"
```

Now you can boot the VM and start the guest installation using the following command, 
which starts in GUI mode by default, taking you through a standard guest OS installer:

```batch
VBoxManage startvm rocky-linux-db-lab
:: Waiting for VM "rocky-linux-db-lab" to power on...
:: VM "rocky-linux-db-lab" has been successfully started.

VBoxManage list --long runningvms | findstr /c:"Name:"
:: Name:                        rocky-linux-db-lab
```

{{< figure src="/img/002/gui_installation_with_monitor.png" alt="Rocky Linux 9.6 Boot Menu" position="center" caption="Boot Menu" captionPosition="center" >}}

Once you have completed the OS installation, you can cleanly shut down the VM from within the guest, 
which causes Oracle VM VirtualBox to power off the VM was well. You can also initiate this from 

Oracle VM VirtualBox using the following command, which is equivalent to briefly pressing the
power button on a physical computer:

```batch
VBoxManage controlvm rocky-linux-db-lab acpipowerbutton
```

Operating systems that are programmed to respond to this command will shut themselves down. 
You can forcibly shut down a VM using the following command, which is equivalent to pressing 
and holding a computer's power button:

```batch
VBoxManage controlvm rocky-linux-db-lab poweroff
```


## 2. Rocky Linux 9 Installation

Start the VirtualBox virtual machine with Rocky Linux 9.6 ISO mounted.
Select "Install Rocky Linux 9.6" from the boot menu and proceed to the Installation Summary screen.

{{< figure src="/img/002/installation_summary.png" alt="Rocky Linux 9.6 Installation Summary" position="center" caption="Installation Summary" captionPosition="center" >}}

### 2.1. Installation Summary Configuration

**Localization:**
- **Keyboard & Language Support**: Choose the appropriate options for you
- **Time & Date**: Set your timezone correctly and enable Network Time Protocol (NTP)

**Software:**
- **Software Selection**: **Minimal Install** (recommended for its light-weight)

**User Settings > User Creation:**
- **Username**: `dbadmin`
- **Password**: Strong password
- **Make this user administrator**: ✓

### 2.2. Custom Partitioning for Database Workloads

#### Access Custom Partitioning
1. Click on **"Installation Destination"** in the Installation Summary
2. Select your 40 GiB virtual disk
3. Under "Storage Configuration," select **"Custom"**
4. Click **"Done"** to proceed to the manual partitioning interface


Create these partitions for optimal database performance. 
The configuration is specifically designed[^1] for a system with 40 GiB disk space and 4 GiB RAM.

[^1]: Red Hat Documentation [9.15.5. Recommended Partitioning Scheme](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/6/html/installation_guide/s2-diskpartrecommend-x86).

| Mount Point     | Size   | File System | Purpose                       |
|-----------------|-------:|:-----------:|:------------------------------|
| `/boot`         |  1 GiB | ext4        | Boot files and kernels        |
| `swap`          |  4 GiB | swap        | Virtual memory (equal to RAM) |
| `/` (root)      | 10 GiB | xfs         | Operating system files        |
| `/var`          | 20 GiB | xfs         | Database files, logs, cache   |
| `/home`         |  3 GiB | xfs         | User data and configurations  |
| `/tmp`          |  2 GiB | xfs         | Temporary files               |

{{< figure src="/img/002/custom_partitioning.png" alt="Rocky Linux 9.6 Manual Partitioning Screen" position="center" caption="Manual Partitioning Screen" captionPosition="center" >}}

**Why Not Use Automatic Partitioning?**

Automatic partitioning typically creates a large root partition that may not be optimal for database workloads because:
* Database files compete with system files for disk space
* No isolation between different types of data
* Limited flexibility for database-specific optimizations
* Difficult to implement targeted backup strategies
* Potential for database growth to impact system stability

{{< figure src="/img/002/installation_process.png" alt="Rocky Linux 9.6 Installation Process" position="center" caption="Installation Process" captionPosition="center" >}}

{{<notice tip>}}
Finally, when the OS is installed in the guest, you can remove the DVD from the VM configuration:

```batch
VBoxManage storageattach ^
rocky-linux-db-lab       ^
--storagectl "ide01"     ^
--port 0                 ^
--device 0               ^
--type dvddrive          ^
--medium none
```
{{</notice>}}

## 3. Post-Installation Configuration

{{< figure src="/img/002/first_login.png" alt="Rocky Linux 9.6 First Login Screen" position="center" caption="First Login Screen" captionPosition="center" >}}

### 3.1. System Updates

First, update the system completely:

```bash
# Switch to root
sudo su -

# Update all packages
dnf --assumeyes update 

# Install additional useful packages
dnf --assumeyes group install --with-optional 'Development Tools'

# Set a new hostname
hostnamectl set-hostname dblab

# Reboot to ensure kernel updates take effect
reboot
```

### 3.2. Security Hardening

**Configure Firewall:**
```bash
# Check firewall status
systemctl status firewalld

# If for some reason firewalld is not enabled on your machine, 
# you can enable it with a simple command:
# systemctl enable --now firewalld

# Configure basic rules
grep --silent cockpit < <(firewall-cmd --list-services) && \
firewall-cmd --remove-service cockpit

grep --silent ssh < <(firewall-cmd --list-services) || \
firewall-cmd --add-service ssh

firewall-cmd --add-port 1433/tcp  # SQL Server
firewall-cmd --add-port 1521/tcp  # Oracle
firewall-cmd --add-port 3306/tcp  # MySQL
firewall-cmd --add-port 5432/tcp  # PostgreSQL

firewall-cmd --runtime-to-permanent

# List current rules
firewall-cmd --list-all
```

{{<notice warning>}}
By default, all changes to firewalld's configuration are temporary.
If you restart the whole firewalld service, or restart your machine, 
none of your changes to the firewall will be saved unless you do one 
of two very specific things.

Once you have a working configuration, you can save your changes permanently with:
`firewall-cmd --runtime-to-permanent`

However, if you're absolutely sure about what you're doing, and just want to add the
rule and move on with your life, you can add the `--permanent` flag to any configuration command:
`firewall-cmd --permanent [the rest of your command]`
{{</notice>}}

**SSH Security:**
```bash
# To modify the system-wide sshd configuration, create a *.conf 
# file under /etc/ssh/sshd_config.d/
tee /etc/ssh/sshd_config.d/00_ssh-security.conf &>/dev/null <<BODY
# Created by [$(whoami)] at [$(date +"%Y-%m-%d %H:%M:%S")]
PasswordAuthentication yes # for lab environment
PermitRootLogin no
Port 22 # consider changing in production
MaxAuthTries 3
BODY

# Restart SSH service
systemctl restart sshd

# Check SSH service status
systemctl status sshd
```

### 3.3. System Monitoring Setup

Install and configure system monitoring:

```bash
# Installation epel source (also called repository)
dnf --assumeyes install epel-release

# Many EPEL packages require CodeReady Builder (CRB) repository
# It is recommended to enable the CRB repository
/usr/bin/crb enable

# Install monitoring tools
dnf --assumeyes install htop   # Interactive process viewer
dnf --assumeyes install iotop  # Simple top-like I/O monitor
dnf --assumeyes install iftop  # Display bandwidth usage on an interface by host

# Configure system logging
systemctl enable --now rsyslog
```

### 3.4. Network Configuration

**Configure Static IP for Host-Only Network:**
```bash
# Identify network interfaces
nmcli device status
# DEVICE    TYPE       STATE                   CONNECTION
# enp0s3    ethernet   connected               enp0s3
# lo        loopback   connected(externally)   lo
# enp0s8    ethernet   disconnected            --

# We did neither configure nor enable the host-only interface,
# so it is safe to assume `enp0s8` is host-only interface

# Configure static IP
nmcli --pretty                \
connection modify enp0s8      \
ipv4.address 192.168.56.10/24 \
ipv4.gateway 192.168.56.1     \
ipv4.method manual            \
connection.autoconnect yes

# Show protocol addresses
lo       UNKNOWN    127.0.0.1/8
enp0s3   UP         10.0.2.15/24
enp0s8   UP         192.168.56.10/24 <-- static IP of this single lab server
```

## 4. Verification and Testing

### System Health Check
```bash
# Check system resources
free --human
df --human

# CPU information
lscpu

# Memory information
cat /proc/meminfo | grep --extended 'MemTotal|MemFree|MemAvailable'
```

## What's Next?

Congratulations! You now have a robust, secure Rocky Linux 9 environment ready for database installations. This virtual lab serves as the perfect foundation for our database journey ahead.

### **Final System Verification**

Before we wrap up, let's ensure everything is working correctly:

```bash
# Quick system health check
systemctl status firewalld sshd auditd
firewall-cmd --list-all
free -h && df -h
```

Your system should now show:
- **Firewall**: Active with DB ports configured
- **SSH**: Secured and accessible via port 22
- **Partitions**: Properly configured for database workloads
- **Network**: Both NAT and host-only adapters functional

## Looking Ahead: Your Database Journey

This Rocky Linux foundation opens up exciting possibilities for your database learning path:

**Immediate Next Steps:**
- **PostgreSQL 17** installation and cluster configuration
- **User management** and authentication setup
- **Basic performance tuning** and monitoring

**Advanced Topics Coming:**
- **High Availability** configurations with multiple nodes
- **Backup and Recovery** strategies and automation
- **Performance optimization** techniques and troubleshooting
- **Security hardening** for production environments

**What database are you planning to install first?** PostgreSQL for its open-source flexibility, or perhaps Oracle for enterprise features?