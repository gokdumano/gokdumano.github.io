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
- At least **8GB RAM** available for the VM
- **40GB** free disk space
- **Virtualization enabled** in BIOS/UEFI


{{<notice tip>}}
The list of official mirrors can be found <a href="https://mirrors.rockylinux.org/mirrormanager/mirrors" target="_blank">here</a>, which is advisable for one to select the mirror that is geographically closest to them. To build our lab, the latest release of Rocky Linux 9 is prefered. 
{{</notice>}}

<pre class="command-line" data-prompt="c:\users\gokdumano>" data-continuation-prompt="More?" data-filter-output="(out)" data-continuation-str=" ^">
<code class="lang-batch" data-prismjs-copy="copy">:: --output-dir     Directory to save files in
:: --progress-bar   Display transfer progress as a bar
:: --remote-name    Write output to a file named as the remote file
:: --location       Follow redirects
curl --progress-bar --remote-name --location --output-dir %userprofile%\downloads ^
https://download.rockylinux.org/pub/rocky/9.6/isos/x86_64/Rocky-9-latest-x86_64-minimal.iso</code></pre>

{{<notice info>}}
Rocky Linux ISOs follow this naming convention `Rocky-<MAJOR#>.<MINOR#>-<ARCH>-<VARIANT>.iso`. To select the ISO with the architecture matching our PC, the following command can be used:
{{</notice>}}

<pre class="command-line" data-prompt="c:\users\gokdumano>" data-continuation-prompt="More?" data-filter-output="(out)" data-continuation-str=" ^">
<code class="lang-batch" data-prismjs-copy="copy">systeminfo | findstr /c:"System Type:"
:: System Type:               x64-based PC</code></pre> 

{{<notice info>}}
You can use the `certutil` utility to verify that the file(s) you downloaded are not corrupt. We will demonstrate the verification of the Rocky-9-latest-x86_64-minimal.iso file by checking its checksum.
{{</notice>}}

<pre class="command-line" data-prompt="c:\users\gokdumano>" data-continuation-prompt="More?" data-continuation-str=" ^" data-filter-output="(out)">
<code class="lang-batch" data-prismjs-copy="copy">:: --output-dir   Directory to save files in
:: --output       Write to file instead of stdout
:: --silent       Silent mode
:: --location     Follow redirects
curl --output-dir %userprofile%\downloads --output CHECKSUM --silent --location ^
https://download.rockylinux.org/pub/rocky/9.6/isos/x86_64/Rocky-9-latest-x86_64-minimal.iso.CHECKSUM

type %userprofile%\downloads\CHECKSUM
:: # Rocky-9-latest-x86_64-minimal.iso: 2252013568 bytes
:: SHA256 (Rocky-9-latest-x86_64-minimal.iso) = aed9449cf79eb2d1c365f4f2561f923a80451b3e8fdbf595889b4cf0ac6c58b8

:: Use the certutil utility to verify the integrity of the ISO file against corruption or tampering.
certutil -hashfile %userprofile%\downloads\Rocky-9-latest-x86_64-minimal.iso sha256 | findstr /v "hash"
:: aed9449cf79eb2d1c365f4f2561f923a80451b3e8fdbf595889b4cf0ac6c58b8</code></pre> 

{{<notice info>}} The latest stable version of VirtualBox can be found <a href="https://download.virtualbox.org/virtualbox/LATEST-STABLE.TXT" target="_blank">here</a>. However, for those who are comfortable with the 'bleeding edge' of the latest version, this <a href="https://download.virtualbox.org/virtualbox/LATEST.TXT" target="_blank">URL</a> can also be used.
{{</notice>}}

<pre class="command-line" data-prompt="c:\users\gokdumano>" data-continuation-prompt="More?" data-continuation-str=" ^" data-filter-output="(out)">
<code class="lang-batch" data-prismjs-copy="copy">curl --silent --location https://download.virtualbox.org/virtualbox/LATEST-STABLE.TXT
:: 7.1.12 (as of writing this post the latest stable version is '7.1.12')

curl https://download.virtualbox.org/virtualbox/7.1.12/ | findstr /c:Win.exe
:: <a href="VirtualBox-7.1.12-169651-Win.exe">VirtualBox-7.1.12-169651-Win.exe</a>  14-Jul-2025 20:31  119M
:: this command allows us to extract the download link for the latest stable version

curl --output-dir %userprofile%\Downloads --progress-bar --remote-name --location ^
https://download.virtualbox.org/virtualbox/7.1.12/VirtualBox-7.1.12-169651-Win.exe</code></pre> 

## 1. Virtual Machine Creation

Oracle VM VirtualBox offers the following tools to control virtualization engine settings, create new VMs, and work on existing VMs within Oracle VM VirtualBox:

* VirtualBox Manager, the GUI for controlling Oracle VM VirtualBox
* VBoxManage, the CLI to Oracle VM VirtualBox
* The Main API, which is implemented using the Component Object Model (COM/XPCOM)
* The web service, which maps nearly the entire Main API for web applications

### 1.1. Create New Virtual Machine

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

VBoxManage CLI guarantees access to all the features of the virtualization engine, as well as providing some advanced and experimental configuration settings for a VM.

{{<notice tip>}} Users may want to add VirtualBox to PATH to be able to access VBoxManage from any directory.{{</notice>}}

<pre class="command-line" data-prompt="c:\users\gokdumano>">
<code class="lang-batch" data-prismjs-copy="copy">:: Changes made with SET will remain only for the duration of the current CMD session.
set "PATH=%PATH%;C:\Program Files\Oracle\VirtualBox"
VBoxManage --version
:: 7.1.12r169651

:: To set environment variables permanently, SETX command can be used
:: setx PATH "%PATH%;C:\Program Files\Oracle\VirtualBox"</code></pre>

You can check the supported OS types using the following command, which outputs a long list of supported OS types, including Red Hat (64 bit), among many others:

<pre class="command-line" data-prompt="c:\users\gokdumano>">
<code class="lang-batch" data-prismjs-copy="copy">VBoxManage list --long ostypes | findstr /c:"RedHat9_64"
:: ID:               RedHat9_64</code></pre>

If you're just getting started with Oracle VM VirtualBox and it has no VMs registered, your first step would be to create a VM. 
VBoxManage lets you do that with the createvm command. By default, the `VBoxManage createvm` command creates only the XML configuration for the VM but does not register the VM.

{{<notice warning>}}
Following commands assume that the folder tree shown below is created.
```
E:/VirtualBox VMs/
├─ trace-files/
├─ vdi/
└─ icons/
   └─ network.png
```
{{</notice>}}

The following command creates a VM called `rocky-linux-db-lab` where you plan to run a 64-bit version of Rocky Linux 9.

<pre class="command-line" data-prompt="c:\users\gokdumano>" data-continuation-prompt="More?" data-continuation-str=" ^" data-filter-output="(out)">
<code class="lang-batch" data-prismjs-copy="copy">:: --name         The name of the VM
:: --basefolder   Specifies the name of the folder in which to save the machine configuration file for the new VM
:: --register     Registers the VM with your Oracle VM VirtualBox installation.
VBoxManage createvm ^
--name rocky-linux-db-lab ^
--basefolder "E:\VirtualBox VMs" ^
--register
:: Virtual machine 'rocky-linux-db-lab' is created and registered.
:: UUID: 2a1a63a1-97dc-4f28-a377-5e09d8f3d14f
:: Settings file: 'E:\VirtualBox VMs\rocky-linux-db-lab\rocky-linux-db-lab.vbox'

:: If you do not register the VM at creation, you can run the `VBoxManage registervm` command after you create the VM.
:: VBoxManage registervm "E:\VirtualBox VMs\rocky-linux-db-lab\rocky-linux-db-lab.vbox"</code></pre>

### 1.2. Setting Up a VM's Properties

As you might notice, Oracle VM VirtualBox requires minimal information from you to create and register a new VM, and it sets many properties of the VM to default values. 
However, to meet your needs and to comply with the requirements of the guest OS you're going to install, you might need to modify the properties of the VM.

To look at the current settings of the VM we created, you can issue the following command:

<pre class="command-line" data-prompt="c:\users\gokdumano>"><code class="lang-batch" data-prismjs-copy="copy">VBoxManage showvminfo rocky-linux-db-lab</code></pre>

Examining the output can help you see what settings should be set or modified. 
You can use the `VBoxManage modifyvm` command to change VM settings only when the VM is powered off. 
The VM **cannot** be running or in saved state when you use this command. 
You can use the `VBoxManage controlvm` command to dynamically change some VM machine settings while the VM is running.

#### 1.2.1 Network Configuration

{{<notice info>}} Oracle VM usually creates a Host-Only Network named `VirtualBox Host-Only Ethernet Adapter`. 
However, to create a comprehensive tutorial, we delete and create it again.{{</notice>}}

<pre class="command-line" data-prompt="c:\users\gokdumano>" data-continuation-prompt="More?" data-continuation-str=" ^" data-filter-output="(out)">
<code class="lang-batch" data-prismjs-copy="copy">:: VBoxManage list hostonlyifs | findstr /b "Name:"
:: Name:            VirtualBox Host-Only Ethernet Adapter
VBoxManage hostonlyif remove "VirtualBox Host-Only Ethernet Adapter"
:: 0%...10%...20%...30%...40%...50%...60%...70%...80%...90%...100%

VBoxManage hostonlyif create
:: 0%...10%...20%...30%...40%...50%...60%...70%...80%...90%...100%
:: Interface 'VirtualBox Host-Only Ethernet Adapter' was successfully created

VBoxManage hostonlyif ipconfig "VirtualBox Host-Only Ethernet Adapter" ^
--ip 192.168.56.1 ^
--netmask 255.255.255.0</code></pre>

#### 1.2.2 Storage Configuration

The `VBoxManage storagectl` command enables you to attach, modify, and remove a storage controller. 
After you configure the storage controller, you can use the `VBoxManage storageattach` command to attach virtual media to the controller.

<pre class="command-line" data-prompt="c:\users\gokdumano>" data-continuation-prompt="More?" data-continuation-str=" ^" data-filter-output="(out)">
<code class="lang-batch" data-prismjs-copy="copy">:: --name          Specifies the name of the storage controller.
:: --add           Specifies the type of the system bus to which to connect the storage controller.
:: --controller    Specifies the chipset type to emulate for the specified storage controller.
:: --hostiocache   Specifies whether to use the host I/O cache for all disk images attached to this storage controller.
:: --bootable      Specifies whether this controller is bootable.
VBoxManage storagectl rocky-linux-db-lab ^
--name "SATA Controller" ^
--add sata ^
--controller IntelAhci ^
--hostiocache on ^
--bootable on</code></pre>

The `VBoxManage createmedium` command creates a new medium, such as a disk image file.

<pre class="command-line" data-prompt="c:\users\gokdumano>" data-continuation-prompt="More?" data-continuation-str=" ^" data-filter-output="(out)">
<code class="lang-batch" data-prismjs-copy="copy">:: --filename   Specifies the absolute path name to a file on the host file system.
:: --size       Specifies the image capacity in one megabyte units.
:: --format     Specifies the file format of the output file.
VBoxManage createmedium disk ^
--filename "E:\VirtualBox VMs\vdi\rocky-linux-db-lab.vdi" ^
--size 40960 ^
--format VDI
:: 0%...10%...20%...30%...40%...50%...60%...70%...80%...90%...100%
:: Medium created. UUID: c32bc6b2-7eea-4bff-bb3e-c6b9129ca1e7</code></pre>

The `VBoxManage storageattach` command enables you to manage a storage medium that you connected to a storage controller by using the `VBoxManage storagectl` command.

<pre class="command-line" data-prompt="c:\users\gokdumano>" data-continuation-prompt="More?" data-continuation-str=" ^" data-filter-output="(out)">
<code class="lang-batch" data-prismjs-copy="copy">:: --storagectl        Specifies the name of the storage controller. 
:: --port              Specifies the port number of the storage controller to modify.
:: --device            Specifies the port's device number to modify.
:: --type              Specifies the drive type to which the medium is associated.
:: --medium=filename   Specifies the full path of an existing disk image to attach to the specified device slot. 
VBoxManage storageattach rocky-linux-db-lab ^
--storagectl "SATA Controller" ^
--port 0 ^
--device 0 ^
--type hdd ^
--medium "E:\VirtualBox VMs\vdi\rocky-linux-db-lab.vdi"</code></pre>

### 1.3. VM Settings Optimization

```ascii
========================================================================
1. MEMORY AND CPU CONFIGURATION
========================================================================
--memory 4096                                                  Allocates 4GB RAM - critical for high-traffic database workloads
--cpus 2                                                       Assigns 2 virtual CPUs from 4 physical cores, leaving resources for other VMs
--cpuexecutioncap 75                                           Limits CPU usage to 75% for resource control and system stability
--vram 12                                                      Minimal video memory allocation since database servers don't need graphics
========================================================================
2. HARDWARE VIRTUALIZATION AND PERFORMANCE
========================================================================
--hwvirtex on                                                  Enables hardware virtualization extensions - mandatory for optimal performance
--nested-paging on                                             Enables nested paging for improved memory management performance
--large-pages on                                               Reduces TLB overhead - crucial for database I/O operations
--vtx-vpid on                                                  Enables VT-x VPID feature for TLB optimization on Intel processors
--vtx-ux on                                                    Enables VT-x unrestricted guest mode for better execution
--pae on                                                       Enables Physical Address Extension for >4GB RAM support
========================================================================
3. SYSTEM ARCHITECTURE AND INTERRUPTS
========================================================================
--apic on                                                      Enables Advanced Programmable Interrupt Controller for multi-processor support
--x2apic on                                                    Enables x2APIC for enhanced interrupt management in virtualized environments
--ioapic on                                                    Enables I/O APIC for PCI device interrupt handling
--chipset ich9                                                 Uses modern ICH9 chipset with better PCI Express support
--acpi on                                                      Enables ACPI for power management and multi-processor support
--hpet on                                                      Enables High Precision Event Timer - important for database timing accuracy
========================================================================
4. PARAVIRTUALIZATION AND GUEST OS
========================================================================
--paravirt-provider kvm                                        Uses KVM paravirtualization for optimal Linux guest performance
--ostype RedHat9_64                                            Optimizes VM settings for 64-bit Red Hat Linux distributions
========================================================================
5. NETWORK CONFIGURATION
========================================================================
--nic1 nat                                                     First adapter uses NAT for internet access
--nic-type1 82545EM                                            Intel PRO/1000 MT Server network adapter for high performance
--cable-connected1 on                                          Ensures NAT adapter is connected
--nic2 hostonly                                                Second adapter for VM-to-VM communication
--nic-type2 82545EM                                            Intel PRO/1000 MT Server for host-only network
--cable-connected2 on                                          Ensures host-only adapter is connected
--host-only-adapter2 "VirtualBox Host-Only Ethernet Adapter"   Specifies which host-only interface to use (may need to be created first)
========================================================================
6. PORT FORWARDING FOR DATABASE ACCESS
========================================================================
--nat-pf1 "SSH,tcp,,2222,,22"                                  Forwards SSH port for remote administration
--nat-pf1 "PostgreSQL,tcp,,8001,,5432"                         Forwards PostgreSQL port for external database connections
--nat-pf1 "Oracle,tcp,,8002,,1521"                             Forwards Oracle Database port for external database connections
--nat-pf1 "MySQL,tcp,,8003,,3306"                              Forwards MySQL/MariaDB port for external database connections
========================================================================
7. SECURITY AND RESOURCE MANAGEMENT
========================================================================
--boot1 disk                                                   Sets boot priority: disk first, then network
--boot2 net
--boot3 none
--boot4 none
--vm-process-priority normal                                   Sets normal process priority for balanced OS resource management
--page-fusion on                                               Enables memory page sharing between VMs to save RAM
--rtc-use-utc on                                               Uses UTC for real-time clock - ensures database timestamp consistency
========================================================================
8. DISABLE UNNECESSARY FEATURES FOR DATABASE SERVERS
========================================================================
--accelerate-3d off                                            Disables 3D acceleration - unnecessary for database servers
--audio-enabled off                                            Disables audio completely - not needed for server workloads
--usb-ohci off                                                 Disables all USB controllers for security and performance
--usb-ehci off
--usb-xhci off
--clipboard-mode disabled                                      Disables clipboard sharing for security isolation
--drag-and-drop disabled                                       Disables drag-and-drop for security
--graphicscontroller none                                      Minimal graphics controller for headless server operation
--snapshot-folder default                                      Specifies the name of the VM's snapshot storage folder
```

### 1.3. VM Settings Optimization

<pre class="command-line" data-prompt="c:\users\gokdumano>" data-continuation-prompt="More?" data-continuation-str=" ^" data-filter-output="(out)">
<code class="lang-batch" data-prismjs-copy="copy">VBoxManage modifyvm rocky-linux-db-lab                       ^
--memory 4096                                                ^
--cpus 2                                                     ^
--cpuexecutioncap 75                                         ^
--vram 12                                                    ^
--hwvirtex on                                                ^
--nested-paging on                                           ^
--large-pages on                                             ^
--vtx-vpid on                                                ^
--vtx-ux on                                                  ^
--pae on                                                     ^
--apic on                                                    ^
--x2apic on                                                  ^
--ioapic on                                                  ^
--chipset ich9                                               ^
--acpi on                                                    ^
--hpet on                                                    ^
--paravirt-provider kvm                                      ^
--ostype RedHat9_64                                          ^
--nic1 nat                                                   ^
--nic-type1 82545EM                                          ^
--cable-connected1 on                                        ^
--nic2 hostonly                                              ^
--nic-type2 82545EM                                          ^
--cable-connected2 on                                        ^
--host-only-adapter2 "VirtualBox Host-Only Ethernet Adapter" ^
--nat-pf1 "SSH,tcp,,2222,,22"                                ^
--nat-pf1 "PostgreSQL,tcp,,8001,,5432"                       ^
--nat-pf1 "Oracle,tcp,,8002,,1521"                           ^
--nat-pf1 "MySQL,tcp,,8003,,3306"                            ^
--boot1 disk                                                 ^
--boot2 net                                                  ^
--boot3 none                                                 ^
--boot4 none                                                 ^
--vm-process-priority normal                                 ^
--page-fusion on                                             ^
--rtc-use-utc on                                             ^
--accelerate-3d off                                          ^
--audio-enabled off                                          ^
--usb-ohci off                                               ^
--usb-ehci off                                               ^
--usb-xhci off                                               ^
--clipboard-mode disabled                                    ^
--drag-and-drop disabled                                     ^
--graphicscontroller none                                    ^
--snapshot-folder default</code></pre>

Open VirtualBox and press <kbd>CTRL</kbd>+<kbd>N</kbd> to create a new machine.

**Name and Operating System:**
* Name: `rocky-linux-db-lab`
* Type: Linux
* Subtype: Red Hat
* Version: Red Hat (64-bit)

**Hardware:**
* Base Memory: 4096 MB (4GB) minimum
* Processors: Assign 2-4 CPU cores

### 1.2. Virtual Hard Disk Configuration

**Hard Disk**
* Hard Disk File Location: Choose an appropriate location
* Hard Disk File Size: 40 GB
* Hard Disk File Type and Variant: VDI (VirtualBox Disk Image)
* Uncheck `Pre-allocate Full Size`

### 1.3. VM Settings Optimization

Before installation, optimize these settings.

**System Settings:**
* Boot Order: Optical, Hard Disk

**Storage Settings:**
* Check `Host I/O Cache` for better performance
* Attach Rocky Linux 9 ISO to `Controller:IDE`

**Audio Settings:**
* Uncheck `Enable Audio` to avoid unneccessary system load 

**Network Settings:**
* Adapter 1: NAT (for internet access)
* Adapter 2: Host-only Adapter (for host machine access)

## 2. Rocky Linux 9 Installation

### 2.1. Boot and Language Selection

* Start the VM and boot from ISO
* Select **"Install Rocky Linux 9"**
* Choose the appropriate installation language for you

### 2.2. Installation Summary Configuration

**Localization:**

* **Keyboard** & **Language Support**: Choose the appropriate options for you
* **Time & Date**: Set your timezone correctly and enable **Network Time Protocol (NTP)**

**Software:**

* **Software Selection**: Minimal Install (recommended for its light-weight)

**System:**
* **Network & Host Name**: Enable both network interfaces and configure static IP for host-only adapter if needed. We used `dblab.local` for the hostname. 

_Adaptor 2 (Host-only Adapter) > Configure > IPv4 Settings > Addresses (Add) > Use values from Host-only network created automatically by VirtualBox_

* **Installation Destination**: Select your virtual disk and `Custom` **Storage Configuration** for database optimization

_Create these partitions for optimal database performance:_

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

**User Settings:**

* **User Creation**:

_Create a standard user account:_

```
Full name :  Database Admin
Username  :  dbadmin
Password  :  xxxx

Make this user administrator: ✓
```



## 3. Post-Installation Configuration

### 3.1. System Updates

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

### 3.2. Security Hardening

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

### 3.3. System Monitoring Setup

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

### 3.4. Network Configuration

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

### 3.5. Database Preparation

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

## 4. Verification and Testing

### 4.1. System Health Check

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

### 4.2. Performance Baseline

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
