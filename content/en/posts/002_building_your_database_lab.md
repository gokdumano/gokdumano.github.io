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
The list of official mirrors can be found [here](https://mirrors.rockylinux.org/mirrormanager/mirrors), which is advisable for one to select the mirror that is geographically closest to them. To build our lab, the latest release of Rocky Linux 9 is preferred.
{{</notice>}}

### Quick Download Commands (Windows)

```batch
:: Download Rocky Linux 9 ISO
curl --progress-bar --remote-name --location --output-dir %userprofile%\downloads ^
https://download.rockylinux.org/pub/rocky/9.6/isos/x86_64/Rocky-9-latest-x86_64-minimal.iso

:: Verify checksum integrity
curl --output-dir %userprofile%\downloads --output CHECKSUM --silent --location ^
https://download.rockylinux.org/pub/rocky/9.6/isos/x86_64/Rocky-9-latest-x86_64-minimal.iso.CHECKSUM

type %userprofile%\downloads\CHECKSUM
:: # Rocky-9-latest-x86_64-minimal.iso: 2252013568 bytes
:: SHA256 (Rocky-9-latest-x86_64-minimal.iso) = aed9449cf79eb2d1c365f4f2561f923a80451b3e8fdbf595889b4cf0ac6c58b8

certutil -hashfile %userprofile%\downloads\Rocky-9-latest-x86_64-minimal.iso sha256 | findstr /v "hash"
:: aed9449cf79eb2d1c365f4f2561f923a80451b3e8fdbf595889b4cf0ac6c58b8
```

{{<notice info>}} The latest stable version of VirtualBox can be found [here](https://download.virtualbox.org/virtualbox/LATEST-STABLE.TXT). However, those who are comfortable with the 'bleeding edge' can find the latest version [here](https://download.virtualbox.org/virtualbox/LATEST-STABLE.TXT).
{{</notice>}}

```batch
:: Extract what the latest stable version is
curl --location --silent https://download.virtualbox.org/virtualbox/LATEST-STABLE.TXT

curl https://download.virtualbox.org/virtualbox/7.1.12/ | findstr /c:Win.exe

:: Download Oracle VirtualBox
curl --progress-bar --remote-name --location --output-dir %userprofile%\downloads ^
https://download.virtualbox.org/virtualbox/7.1.12/VirtualBox-7.1.12-169651-Win.exe
```

## 1. Virtual Machine Creation

You can create your VM either through the VirtualBox GUI or using the powerful command-line interface. For this article, the first method is covered below.

Open VirtualBox and press **Ctrl+N** to create a new machine.

**Name and Operating System:**
- **Name**: `rocky-linux-db-lab`
- **Type**: Linux
- **Subtype**: Red Hat
- **Version**: Red Hat 9.x (64-bit)

**Hardware:**
- **Base Memory**: 2048 MB (4GB) minimum
- **Processors**: Assign 1-2 CPU cores

**Hard Disk:**
- **Hard Disk File Location**: Choose an appropriate location
- **Hard Disk File Size**: 40 GB
- **Hard Disk File Type and Variant**: VDI (VirtualBox Disk Image)
- **Uncheck** `Pre-allocate Full Size`

**VM Settings Optimization:**
Before installation, optimize these settings:

**System Settings:**
- **Boot Order**: Optical, Hard Disk

**Storage Settings:**
- **Check** `Host I/O Cache` for better performance
- Attach Rocky Linux 9 ISO to `Controller:IDE`

**Audio Settings:**
- **Uncheck** `Enable Audio` to avoid unnecessary system load

**Network Settings:**
- **Adapter 1**: NAT (for internet access)
- **Adapter 2**: Host-only Adapter (for host machine access)


## 2. Rocky Linux 9 Installation

### 2.1. Custom Partitioning for Database Workloads

#### Step 1: Boot from Rocky Linux 9.6 Installation Media
1. Start the VirtualBox virtual machine with Rocky Linux 9.6 ISO mounted
2. Select "Install Rocky Linux 9.6" from the boot menu
3. Configure language and keyboard layout preferences
4. Proceed to the Installation Summary screen

{{< figure src="/img/002_gui_installation_with_monitor.png" alt="Rocky Linux 9.6 Boot Menu" position="center" caption="Rocky Linux 9.6 Boot Menu" captionPosition="center" >}}

#### Access Custom Partitioning
1. Click on **"Installation Destination"** in the Installation Summary
2. Select your 40 GiB virtual disk
3. Under "Storage Configuration," select **"Custom"**
4. Click **"Done"** to proceed to the manual partitioning interface

{{< figure src="/img/002_installation_summary.png" alt="Rocky Linux 9.6 Installation Summary" position="center" caption="Rocky Linux 9.6 Installation Summary" captionPosition="center" >}}

Create these partitions for optimal database performance. 
The configuration is specifically designed[^1] for a system with 40 GiB disk space and 4 GiB RAM.

[^1]: Red Hat Documentation [9.15.5. Recommended Partitioning Scheme](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/6/html/installation_guide/s2-diskpartrecommend-x86).

| Mount Point     | Size   | Device Type        | File System | Purpose                       |
|-----------------|-------:|:-------------------|:-----------:|:------------------------------|
| `/boot`         |  1 GiB | Standard Partition | ext4        | Boot files and kernels        |
| `swap`          |  4 GiB | Standard Partition | swap        | Virtual memory (equal to RAM) |
| `/` (root)      |  8 GiB | LVM                | ext4        | Operating system files        |
| `/var`          | 15 GiB | LVM                | ext4        | Database files, logs, cache   |
| `/home`         |  5 GiB | LVM                | ext4        | User data and configurations  |
| `/tmp`          |  2 GiB | LVM                | ext4        | Temporary files               |
| **Unallocated** | ~5 GiB | LVM                |    -        | Reserved for future expansion |

{{< figure src="/img/002_custom_partitioning.png" alt="Rocky Linux 9.6 Manual Partitioning Screen" position="center" caption="Manual Partitioning Screen" captionPosition="center" >}}

#### Why Not Use Automatic Partitioning?

Automatic partitioning typically creates a large root partition that may not be optimal for database workloads because:
- Database files compete with system files for disk space
- No isolation between different types of data
- Limited flexibility for database-specific optimizations
- Difficult to implement targeted backup strategies
- Potential for database growth to impact system stability

### 2.2. Installation Summary Configuration

**Localization:**
- **Keyboard & Language Support**: Choose the appropriate options for you
- **Time & Date**: Set your timezone correctly and enable Network Time Protocol (NTP)

**Software:**
- **Software Selection**: **Minimal Install** (recommended for its light-weight)

**System:**
- **Network & Host Name**: Enable both network interfaces and configure static IP for host-only adapter if needed. To configure the host-only interface, use the parameters set by **your** Oracle VM. We used `dblab.local` for the hostname.

{{< figure src="/img/002_oracle_vm_host_only_network.png" alt="Oracle VM Host-Only Network Parameters" position="center" caption="Oracle VM Host-Only Network Parameters" captionPosition="center" >}}


**User Settings > User Creation:**
- **Username**: `dbadmin`
- **Password**: Strong password
- **Make this user administrator**: ✓

## 3. Post-Installation Configuration

{{< figure src="/img/002_first_login.png" alt="Rocky Linux 9.6 First Login Screen" position="center" caption="Rocky Linux 9.6 First Login Screen" captionPosition="center" >}}

### 3.1. System Updates

First, update the system completely:

```bash
# Switch to root
sudo su -

# Update all packages
dnf update --assumeyes

# Install additional useful packages
dnf install --assumeyes wget curl vim git tree net-tools

# Reboot to ensure kernel updates take effect
reboot
```

### 3.2. Security Hardening

**Configure Firewall:**
```bash
# Check firewall status
systemctl status firewalld

# Enable firewall
systemctl enable firewalld
systemctl start firewalld

# Configure basic rules
firewall-cmd --remove-service cockpit
firewall-cmd --add-service ssh
firewall-cmd --add-port 5432/tcp  # PostgreSQL
firewall-cmd --add-port 1521/tcp  # Oracle
firewall-cmd --add-port 3306/tcp  # MySQL
firewall-cmd --runtime-to-permanent

# List current rules
firewall-cmd --list-all
```

**SSH Security:**
```bash
# To modify the system-wide sshd configuration, create a *.conf 
# file under /etc/ssh/sshd_config.d/
tee /etc/ssh/sshd_config.d/00_ssh_security &>/dev/null <<BODY
# Created by $(whoami) at $(date +%Y-%m-%dT%H:%M:%S)
PasswordAuthentication   yes   # for lab environment
PermitRootLogin           no
Port                      22   # consider changing in production
MaxAuthTries               3
BODY

# Restart SSH service
systemctl restart sshd

# Check SSH service status
systemctl is-active sshd
```

**SELinux Configuration:**
```bash
# Check SELinux status
sestatus

# Keep SELinux enforcing for security
# Install SELinux management tools
dnf install --assumeyes policycoreutils-python-utils
```

### 3.3. System Monitoring Setup

Install and configure system monitoring:

```bash
# Installation epel source (also called repository)
dnf install --assumeyes epel-release

# Many EPEL packages require CodeReady Builder (CRB) repository
# It is recommended to enable the CRB repository
/user/bin/crb enable

# Install monitoring tools
dnf install --assumeyes htop   # Interactive process viewer
dnf install --assumeyes iotop  # Simple top-like I/O monitor
dnf install --assumeyes iftop  # Display bandwidth usage on an interface by host

# Configure system logging
systemctl enable rsyslog
systemctl start rsyslog
```

### 3.4. Network Configuration

**Configure Static IP for Host-Only Network:**
```bash
# Identify network interfaces
ip addr show

# Configure static IP (assuming enp0s8 is host-only interface)
vim /etc/NetworkManager/system-connections/enp0s8.nmconnection

# The content of the file should looks like this in case things 
# go smoothly in section 2.2 
# 
# [connection]
# id=enp0s8
# uuid=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
# type=ethernet
# autoconnect-priority=-999
# interface-name=enp0s8
# timestamp=xxxxxxxxxx
# zone=public
# 
# [ethernet]
# 
# [ipv4]
# address1=192.168.168.101/28
# gateway=192.168.168.100
# method=manual
# 
# [ipv6]
# addr-gen-mode=eui64
# method=auto
# 
# [proxy]
```

### 3.5. Database Preparation

**Create Database User and Directories:**
```bash
# Create database group
groupadd dba

# Create database user for postgresql
useradd --create-home --no-user-group --gid dba postgres

# Create database directories for postgresql
mkdir -p /database/{data,backup,scripts,logs}
chown -R dbuser:dbgroup /database
chmod 755 /database
```

**Kernel Parameter Optimization:**
```bash
# Edit sysctl for database optimization
vim /etc/sysctl.d/99-database.conf

# Add these parameters:
# Database optimization
vm.swappiness = 1
vm.dirty_ratio = 15
vm.dirty_background_ratio = 5
kernel.shmmax = 17179869184
kernel.shmall = 4194304
kernel.shmmni = 4096
kernel.sem = 250 32000 100 128
net.ipv4.ip_local_port_range = 9000 65500
net.core.rmem_default = 262144
net.core.rmem_max = 4194304
net.core.wmem_default = 262144
net.core.wmem_max = 1048576

# Apply changes
sysctl -p /etc/sysctl.d/99-database.conf
```

### 3.6. Security Best Practices

**Configure Automatic Updates for Security:**
```bash
# Install and configure automatic updates
dnf install -y dnf-automatic

# Configure automatic security updates only
vim /etc/dnf/automatic.conf
# Set these values:
# upgrade_type = security
# apply_updates = yes

# Enable automatic updates
systemctl enable --now dnf-automatic.timer
```

**File System Security:**
```bash
# Set secure umask
echo "umask 027" >> /etc/bashrc

# Configure audit logging
systemctl enable auditd
systemctl start auditd

# Add database-specific audit rules
echo "-w /database -p rwxa -k database_access" >> /etc/audit/rules.d/database.rules
service auditd restart
```

## 4. Verification and Testing

### System Health Check
```bash
# Check system resources
free -h
df -h
lscpu

# Verify services
systemctl status firewalld
systemctl status sshd
systemctl status auditd

# Check security status
sestatus
firewall-cmd --list-all

# Test network connectivity
ping -c 4 8.8.8.8
nslookup google.com
```

### Performance Baseline
```bash
# CPU information
lscpu

# Memory information
cat /proc/meminfo | grep -E 'MemTotal|MemFree|MemAvailable'

# Disk performance test
dd if=/dev/zero of=/tmp/test_file bs=1M count=1024 conv=fdatasync
rm /tmp/test_file
```

## 5. VirtualBox Guest Additions (Optional)

For better performance and usability:

```bash
# Install development tools
dnf groupinstall -y "Development Tools"
dnf install -y kernel-devel kernel-headers

# Mount Guest Additions CD and install
mkdir /mnt/cdrom
mount /dev/cdrom /mnt/cdrom
cd /mnt/cdrom
./VBoxLinuxAdditions.run

# Reboot to activate
reboot
```

## What's Next?

Congratulations! You now have a robust, secure Rocky Linux 9 environment ready for database installations. This virtual lab serves as the perfect foundation for our database journey ahead.

### **Final System Verification**

Before we wrap up, let's ensure everything is working correctly:

```bash
# Quick system health check
sudo systemctl status firewalld sshd auditd
sudo firewall-cmd --list-all
free -h && df -h
```

Your system should now show:
- **Firewall**: Active with PostgreSQL/Oracle ports configured
- **SSH**: Secured and accessible via port 22
- **Partitions**: Properly configured for database workloads
- **Network**: Both NAT and host-only adapters functional

### **Performance Baseline Established**

We've configured essential performance parameters:
- **Kernel tuning** optimized for database operations
- **Memory settings** configured for high-traffic scenarios  
- **Network parameters** tuned for database connectivity
- **File system** optimized with proper mount options

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

## Key Achievements

✅ **Enterprise-ready OS** with Rocky Linux 9  
✅ **Security-first approach** with proper hardening  
✅ **Database-optimized** partitioning and kernel parameters  
✅ **Network isolation** with proper adapter configuration  
✅ **Monitoring foundation** with system logging and auditing  
✅ **Scalable architecture** ready for multiple database instances  

## Best Practices Summary

**Security First**: Every configuration prioritized security without compromising functionality. This lab environment maintains production-like security standards.

**Performance Foundation**: The kernel parameters, file system optimizations, and resource allocation create an optimal environment for database workloads.

**Scalability Ready**: The partitioning scheme and network setup allow for easy expansion as your database requirements grow.

## Community Engagement

This setup represents a solid foundation for database learning and experimentation. For production deployments, you'll want to consider additional factors like:

- Hardware redundancy and fault tolerance
- Enterprise backup solutions
- Compliance and regulatory requirements
- Vendor support agreements

**What database are you planning to install first?** PostgreSQL for its open-source flexibility, or perhaps Oracle for enterprise features? Share your choice and reasoning - I'd love to hear about your database journey!

## Coming Up Next

In our next post, **"PostgreSQL 17: From Installation to First Database"**, we'll transform this foundation into a working database server. We'll cover:

- Step-by-step PostgreSQL installation
- Initial cluster configuration
- Creating your first database and users  
- Essential security configurations
- Basic performance monitoring setup

This hands-on continuation will demonstrate how our carefully prepared Rocky Linux environment translates into real database capabilities.

---

*Ready to dive into database administration? This Rocky Linux foundation is your launching pad into the world of high-performance database systems. Let's build something amazing together!*