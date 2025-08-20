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
+++

# Building Your Database Lab: Rocky Linux 9 on VirtualBox

Welcome back! In my previous post, we explored the open source philosophy and Linux distributions. Today, we're getting hands-on by building a virtual lab environment that will serve as the foundation for our database experiments and learning.

**Why Rocky Linux 9?** It's the spiritual successor to CentOS, offering enterprise-grade stability without licensing costs—perfect for database workloads and learning environments.

## Prerequisites

Before we begin, ensure you have:

- **Oracle VirtualBox** installed (version 7.0 or later) from [virtualbox.org](https://www.virtualbox.org/wiki/Downloads)
- **Rocky Linux 9 ISO** downloaded from [rockylinux.org](https://rockylinux.org/download)
- At least **8GB RAM** available for the VM
- **40GB** free disk space
- **Virtualization enabled** in BIOS/UEFI

## Part 1: Virtual Machine Creation

### Step 1: Create New Virtual Machine

1. Open VirtualBox and click **"New"**
2. Configure basic settings:
   - **Name**: `rocky-linux-db-lab`
   - **Type**: Linux
   - **Version**: Red Hat (64-bit)
   - **Memory**: 4096 MB (4GB) minimum
   - **Hard Disk**: Create a virtual hard disk now

### Step 2: Virtual Hard Disk Configuration

1. **File Type**: VDI (VirtualBox Disk Image)
2. **Storage**: Dynamically allocated
3. **Size**: 40 GB
4. **Location**: Choose appropriate location with sufficient space

### Step 3: VM Settings Optimization

Before installation, optimize these settings:

**System Settings:**

- **Processor**: Assign 2-4 CPU cores
- **Acceleration**: Enable VT-x/AMD-V and Nested Paging
- **Boot Order**: Optical, Hard Disk

**Storage Settings:**

- Attach Rocky Linux 9 ISO to IDE Controller
- Enable **"Host I/O Cache"** for better performance

**Network Settings:**

- **Adapter 1**: NAT (for internet access)
- **Adapter 2**: Host-only Adapter (for host machine access)

## Part 2: Rocky Linux 9 Installation

### Step 1: Boot and Language Selection

1. Start the VM and boot from ISO
2. Select **"Install Rocky Linux 9"**
3. Choose **English (United States)** as installation language

### Step 2: Installation Summary Configuration

**Date & Time:**

- Set your timezone correctly
- Enable **Network Time Protocol (NTP)**

**Software Selection:**

- **Base Environment**: Server with GUI (recommended for learning)
- **Additional Software**:
  - Development Tools
  - System Administration Tools
  - Network Servers

**Installation Destination:**

- Select your virtual disk
- **Partitioning**: Custom partitioning for database optimization

### Step 3: Custom Partitioning for Database Workloads

Create these partitions for optimal database performance:

```
/boot      - 1GB   (xfs)
/          - 15GB  (xfs)
/var       - 8GB   (xfs)
/var/log   - 4GB   (xfs)
/tmp       - 2GB   (xfs)
/home      - 2GB   (xfs)
/database  - 8GB   (xfs) - For future database files
swap       - 4GB
```

**Why this partitioning?**

- Separate `/var` and `/var/log` prevent log files from filling root partition
- Dedicated `/database` partition allows for specific mount options
- Adequate swap for database operations

### Step 4: Network and Hostname

- **Hostname**: `dblab.local`
- **Enable both network interfaces**
- Configure static IP for host-only adapter if needed

### Step 5: User Creation

Create a standard user account:

- **Username**: `dbadmin`
- **Password**: Strong password
- **Make this user administrator**: ✓

## Part 3: Post-Installation Configuration

### Step 1: System Updates

First, update the system completely:

```bash
# Switch to root
sudo su -

# Update all packages
dnf update -y

# Install additional useful packages
dnf install -y wget curl vim htop git tree net-tools

# Reboot to ensure kernel updates take effect
reboot
```

### Step 2: Security Hardening

**Configure Firewall:**

```bash
# Check firewall status
systemctl status firewalld

# Enable firewall
systemctl enable firewalld
systemctl start firewalld

# Configure basic rules
firewall-cmd --permanent --add-service=ssh
firewall-cmd --permanent --add-port=5432/tcp  # PostgreSQL
firewall-cmd --permanent --add-port=1521/tcp  # Oracle
firewall-cmd --reload

# List current rules
firewall-cmd --list-all
```

**SSH Security:**

```bash
# Edit SSH configuration
vim /etc/ssh/sshd_config

# Recommended changes:
# PermitRootLogin no
# PasswordAuthentication yes (for lab environment)
# Port 22 (consider changing in production)
# MaxAuthTries 3

# Restart SSH service
systemctl restart sshd
```

**SELinux Configuration:**

```bash
# Check SELinux status
sestatus

# Keep SELinux enforcing for security
# If you need to troubleshoot, use permissive mode temporarily:
# setenforce 0

# Install SELinux management tools
dnf install -y policycoreutils-python-utils
```

### Step 3: System Monitoring Setup

**Install and configure system monitoring:**

```bash
# Install monitoring tools
dnf install -y htop iotop iftop

# Configure system logging
systemctl enable rsyslog
systemctl start rsyslog

# Set up log rotation
vim /etc/logrotate.conf
# Ensure database logs will be rotated properly
```

### Step 4: Network Configuration

**Configure Static IP for Host-Only Network:**

```bash
# Identify network interfaces
ip addr show

# Configure static IP (assuming enp0s8 is host-only interface)
vim /etc/NetworkManager/system-connections/enp0s8.nmconnection

# Example configuration:
[connection]
id=enp0s8
type=ethernet
interface-name=enp0s8

[ipv4]
method=manual
addresses=192.168.56.10/24
```

**Test Network Connectivity:**

```bash
# Test internet access
ping -c 4 google.com

# Test host-only network
ping -c 4 192.168.56.1

# Check listening services
netstat -tulpn
```

### Step 5: Database Preparation

**Create Database User and Directories:**

```bash
# Create database group and user
groupadd -g 1001 dbgroup
useradd -u 1001 -g dbgroup -m -d /home/dbuser dbuser

# Create database directories
mkdir -p /database/{data,backup,scripts,logs}
chown -R dbuser:dbgroup /database
chmod 755 /database

# Set up database mount with optimal options
echo "/dev/mapper/rocky-database /database xfs defaults,noatime,nodiratime 0 2" >> /etc/fstab
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

### Step 6: Security Best Practices

**Configure Automatic Updates for Security:**

```bash
# Install and configure automatic updates
dnf install -y dnf-automatic

# Configure automatic security updates only
vim /etc/dnf/automatic.conf

# Set these values:
# upgrade_type = security
# apply_updates = yes
# emit_via = email

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

**User Security:**

```bash
# Configure password policies
vim /etc/security/pwquality.conf

# Recommended settings:
# minlen = 12
# minclass = 3
# maxrepeat = 2
# maxclasrepeat = 2

# Lock unused accounts
passwd -l games
passwd -l ftp
```

## Verification and Testing

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

# Network performance
iperf3 -s  # On server
iperf3 -c server_ip  # On client
```

## VirtualBox Guest Additions (Optional)

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

Congratulations! You now have a robust, secure Rocky Linux 9 environment ready for database installations. This virtual lab will serve as our playground for:

- **PostgreSQL cluster setup**
- **Oracle Database installation**
- **Performance tuning experiments**
- **Backup and recovery testing**
- **High availability configurations**

In our next post, we'll install PostgreSQL 16 on this system and configure our first database cluster. We'll explore initial configuration, basic security setup, and create our first database schema.

## Key Takeaways

1. **Security First**: Always harden your systems before installing databases
2. **Plan Your Partitioning**: Proper disk layout prevents future headaches
3. **Monitor from Day One**: Establish baselines before adding complexity
4. **Document Everything**: Your future self will thank you
5. **Test Your Setup**: Verify everything works before proceeding

## Community Note

This setup represents a learning environment. For production deployments, you'll need additional considerations like hardware redundancy, network security, compliance requirements, and vendor support agreements.

---

_Coming up next: "PostgreSQL 17 Installation and Initial Configuration on Rocky Linux 9" - Where we'll transform this foundation into a working database server._
