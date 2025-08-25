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

Setting up a virtual machine doesn't always require a GUI. Using Oracle VirtualBox's command-line interface (VBoxManage) provides more control, enables automation, and is essential for headless server environments. This guide walks you through creating a Rocky Linux 9 virtual machine using only the command line.

**Why Rocky Linux 9?** It's the spiritual successor to CentOS, offering enterprise-grade stability without licensing costs—perfect for database workloads and learning environments.

**Why Use VBoxManage CLI?**
While VirtualBox Manager GUI is user-friendly, the CLI offers several advantages:
- Access to all VirtualBox features and advanced settings
- Perfect for automation and scripting
- Works on servers without X Window System
- Provides better understanding of VM components

## 0. Prerequisites

Before we begin, ensure you have:

- **Oracle VirtualBox** installed (version 7.0 or later) from [virtualbox.org](https://www.virtualbox.org/wiki/Downloads)
- **Rocky Linux 9 ISO** downloaded from [rockylinux.org](https://rockylinux.org/download)
- At least **4GB RAM** available for the VM
- **40GB** free disk space
- **Virtualization enabled** in BIOS/UEFI


{{<notice info>}}
The list of official mirrors can be found <a href="https://mirrors.rockylinux.org/mirrormanager/mirrors" target="_blank">here</a>, which is advisable for one to select the mirror that is geographically closest to them. To build our lab, the latest release of Rocky Linux 9 is prefered. 
{{</notice>}}

{{<notice info>}}
Rocky Linux ISOs follow this naming convention `Rocky-<MAJOR#>.<MINOR#>-<ARCH>-<VARIANT>.iso`.
{{</notice>}}

<pre class="command-line" data-prompt="c:\users\gokdumano>" data-continuation-prompt="More?" data-filter-output="(out)" data-continuation-str=" ^">
<code class="lang-batch" data-prismjs-copy="copy">systeminfo | findstr /c:"System Type:"
:: System Type:               x64-based PC

:: --output-dir         Directory to save files in
:: --output             Write to file instead of stdout
:: --progress-bar       Display transfer progress as a bar
:: --remote-name        Write output to a file named as the remote file
:: --location           Follow redirects
:: --retry              Retry request if transient problems occur
:: --retry-all-errors   Retry all errors (use with --retry)
:: --silent             Silent mode
curl                                 ^
--output-dir %userprofile%\downloads ^
--progress-bar                       ^
--remote-name                        ^
--location                           ^
--retry 3                            ^
--retry-all-errors                   ^
https://download.rockylinux.org/pub/rocky/9.6/isos/x86_64/Rocky-9-latest-x86_64-minimal.iso</code></pre>

{{<notice info>}}
You can use the `certutil` utility to verify that the file(s) you downloaded are not corrupt. We will demonstrate the verification of the Rocky-9-latest-x86_64-minimal.iso file by checking its checksum.
{{</notice>}}

<pre class="command-line" data-prompt="c:\users\gokdumano>" data-continuation-prompt="More?" data-continuation-str=" ^" data-filter-output="(out)">
<code class="lang-batch" data-prismjs-copy="copy">curl                                 ^
--output-dir %userprofile%\downloads ^
--output CHECKSUM                    ^
--location                           ^
--silent                             ^
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
<code class="lang-batch" data-prismjs-copy="copy">curl       ^
--location ^
--silent   ^
https://download.virtualbox.org/virtualbox/LATEST-STABLE.TXT
:: 7.1.12
:: as of writing this post the latest stable version is '7.1.12'

curl https://download.virtualbox.org/virtualbox/7.1.12/ | findstr /c:Win.exe
:: <a href="VirtualBox-7.1.12-169651-Win.exe">VirtualBox-7.1.12-169651-Win.exe</a>  14-Jul-2025 20:31  119M
:: this command allows us to extract the download link for the latest stable version

curl                                 ^
--output-dir %userprofile%\downloads ^
--progress-bar                       ^
--remote-name                        ^
--location                           ^
--retry 3                            ^
--retry-all-errors                   ^
https://download.virtualbox.org/virtualbox/7.1.12/VirtualBox-7.1.12-169651-Win.exe</code></pre> 


## 1. Virtual Machine Creation

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

VBoxManage CLI guarantees access to all the features of the virtualization engine, as well as providing some advanced and experimental configuration settings for a VM.

{{<notice tip>}} Users may want to add VirtualBox to PATH to be able to access VBoxManage from any directory.{{</notice>}}

<pre class="command-line" data-prompt="c:\users\gokdumano>">
<code class="lang-batch" data-prismjs-copy="copy">set "PATH=%PATH%;C:\Program Files\Oracle\VirtualBox"
:: Changes made with SET will remain only for the duration of the current CMD session.
:: To set environment variables permanently, SETX command can be used
:: setx PATH "%PATH%;C:\Program Files\Oracle\VirtualBox"

VBoxManage --version 2> nul || echo "Add VBoxManage to PATH"
:: 7.1.12r169651</code></pre>

You can check the supported OS types using the following command, which outputs a long list of supported OS types, including Red Hat (64 bit), among many others:

<pre class="command-line" data-prompt="c:\users\gokdumano>">
<code class="lang-batch" data-prismjs-copy="copy">VBoxManage list --long ostypes | findstr /c:"RedHat9_64"
:: ID:               RedHat9_64</code></pre>

If you're just getting started with Oracle VM VirtualBox and it has no VMs registered, your first step would be to create a VM. 
VBoxManage lets you do that with the createvm command. By default, the `VBoxManage createvm` command creates only the XML configuration for the VM but does not register the VM.

The following command creates a VM called `rocky-linux-db-lab` where you plan to run a 64-bit version of Rocky Linux 9.

<pre class="command-line" data-prompt="c:\users\gokdumano>" data-continuation-prompt="More?" data-continuation-str=" ^" data-filter-output="(out)">
<code class="lang-batch" data-prismjs-copy="copy">:: --name         The name of the VM
:: --basefolder   Specifies the name of the folder in which to save the machine configuration file for the new VM.
:: --ostype       Specifies the guest OS to run in the VM.
:: --register     Registers the VM with your Oracle VM VirtualBox installation.
VBoxManage createvm              ^
--name rocky-linux-db-lab        ^
--basefolder "E:\VirtualBox VMs" ^
--ostype RedHat9_64              ^
--register</code></pre>

### 1.1. Create the Virtual Machine

If everything went smoothly, the output should look like this:

<pre class="command-line" data-prompt="c:\users\gokdumano>" data-continuation-prompt="More?" data-continuation-str=" ^" data-filter-output="(out)">
<code class="lang-batch" data-prismjs-copy="copy">:: Virtual machine 'rocky-linux-db-lab' is created and registered.
:: UUID: c3404182-3055-4760-93fa-5f1aac922b4f
:: Settings file: 'E:\VirtualBox VMs\rocky-linux-db-lab\rocky-linux-db-lab.vbox'</code></pre>

If you do not register the VM at creation, you can run the `VBoxManage registervm` command after you create the VM.
<pre class="command-line" data-prompt="c:\users\gokdumano>" data-continuation-prompt="More?" data-continuation-str=" ^" data-filter-output="(out)">
<code class="lang-batch" data-prismjs-copy="copy">VBoxManage registervm "E:\VirtualBox VMs\rocky-linux-db-lab\rocky-linux-db-lab.vbox"</code></pre>

An important thing to realize here is that the VM is created empty. Although you specified the operating system type when creating the VM, you still have to set the CPU, RAM, network, and disk configuration for your VM, and you need to install your guest operating system into the VM afterwards.

### 1.2. Configure VM Resources

As you might notice, Oracle VM VirtualBox requires minimal information from you to create and register a new VM, and it sets many properties of the VM to default values. 
However, to meet your needs and to comply with the requirements of the guest OS you're going to install, you might need to modify the properties of the VM.

To look at the current settings of the VM we created, you can issue the following command:

<pre class="command-line" data-prompt="c:\users\gokdumano>"><code class="lang-batch" data-prismjs-copy="copy">VBoxManage showvminfo rocky-linux-db-lab</code></pre>

Examining the output can help you see what settings should be set or modified. You can use the `VBoxManage modifyvm` command to change VM settings only when the VM is powered off. 

The VM **cannot** be running or in saved state when you use this command. You can use the `VBoxManage controlvm` command to dynamically change some VM machine settings while the VM is running.

<pre class="command-line" data-prompt="c:\users\gokdumano>"><code class="lang-batch" data-prismjs-copy="copy">:: ========================================================================
:: MEMORY AND CPU CONFIGURATION
:: ========================================================================
:: --memory 4096                  Allocates 4GB RAM - critical for high-traffic database workloads
:: --cpus 2                       Assigns 2 virtual CPUs from 4 physical cores, leaving resources for other VMs
:: --vram 12                      Minimal video memory allocation since database servers don't need graphics
:: ========================================================================
:: HARDWARE VIRTUALIZATION AND PERFORMANCE
:: ========================================================================
:: --nested-paging on             Enables nested paging for improved memory management performance
:: --large-pages on               Reduces TLB overhead - crucial for database I/O operations
:: ========================================================================
:: SECURITY AND RESOURCE MANAGEMENT
:: ========================================================================
:: --boot1 dvd                    Sets boot priority: dvd first, then disk
:: --boot2 disk
:: --boot3 none
:: --boot4 none
:: --page-fusion on               Enables memory page sharing between VMs to save RAM
:: ===========================================================
:: DISABLE UNNECESSARY FEATURES FOR DATABASE SERVERS
:: ===========================================================
:: --accelerate-3d off            Disables 3D acceleration - unnecessary for database servers
:: --audio-enabled off            Disables audio completely - not needed for server workloads
:: --usb-ohci off                 Disables all USB controllers for security and performance
:: --usb-ehci off
:: --usb-xhci off
:: --clipboard-mode disabled      Disables clipboard sharing for security isolation
:: --drag-and-drop disabled       Disables drag-and-drop for security
:: ===========================================================
:: ADDITIONAL SETTINGS
:: ===========================================================
:: --graphicscontroller vmsvga    Specifies the graphics controller type to use.
:: --icon-file                    Specifies the path to the VM icon file in PNG format on the host system.
:: ========================================================================
VBoxManage modifyvm rocky-linux-db-lab ^
--memory 4096                          ^
--cpus 2                               ^
--vram 12                              ^
--nested-paging on                     ^
--large-pages on                       ^
--boot1 dvd                            ^
--boot2 disk                           ^
--boot3 none                           ^
--boot4 none                           ^
--page-fusion on                       ^
--accelerate-3d off                    ^
--audio-enabled off                    ^
--usb-ohci off                         ^
--usb-ehci off                         ^
--usb-xhci off                         ^
--clipboard-mode disabled              ^
--drag-and-drop disabled               ^
--graphicscontroller vmsvga            ^
--icon-file "E:\VirtualBox VMs\icons\network.png"
</code></pre>

**Resource Guidelines:**
- **CPUs**: Don't exceed your host's physical cores
- **Memory**: 2GB minimum for Rocky Linux 9, adjust based on intended use
- **VRAM**: 16MB is sufficient for server installations

### 1.3. Configure Network Adapter

{{<notice info>}} Oracle VM already creates a Host-Only Network named `VirtualBox Host-Only Ethernet Adapter`.{{</notice>}}

<pre class="command-line" data-prompt="c:\users\gokdumano>" data-continuation-prompt="More?" data-continuation-str=" ^" data-filter-output="(out)">
<code class="lang-batch" data-prismjs-copy="copy">VBoxManage list hostonlyifs | findstr /b "Name:"
:: Name:            VirtualBox Host-Only Ethernet Adapter</code></pre>


You can run `VBoxManage hostonlyif create` if you want to create a new host-only interface 

<pre class="command-line" data-prompt="c:\users\gokdumano>" data-continuation-prompt="More?" data-continuation-str=" ^" data-filter-output="(out)">
<code class="lang-batch" data-prismjs-copy="copy">VBoxManage hostonlyif create
:: 0%...10%...20%...30%...40%...50%...60%...70%...80%...90%...100%
:: Interface 'VirtualBox Host-Only Ethernet Adapter #2' was successfully created

VBoxManage list hostonlyifs | findstr /b "Name:"
:: Name:            VirtualBox Host-Only Ethernet Adapter #2
:: Name:            VirtualBox Host-Only Ethernet Adapter

:: --ip        Specifies the IPv4 IP address for the network interface.
:: --netmask   Specifies the IPv4 netmask of the network interface.
VBoxManage hostonlyif ipconfig             ^
"VirtualBox Host-Only Ethernet Adapter #2" ^
--ip 192.168.168.1                         ^
--netmask 55.255.255.240</code></pre>

You can remove this interface by running `VBoxManage hostonlyif remove` if you do not want to use it anymore:

<pre class="command-line" data-prompt="c:\users\gokdumano>" data-continuation-prompt="More?" data-continuation-str=" ^" data-filter-output="(out)">
<code class="lang-batch" data-prismjs-copy="copy">VBoxManage hostonlyif remove "VirtualBox Host-Only Ethernet Adapter #2"
:: 0%...10%...20%...30%...40%...50%...60%...70%...80%...90%...100%</code></pre>


**Network  Guidelines:**
- **Adapter 1**: NAT (for internet access)
- **Adapter 2**: Host-only Adapter (for host machine access)

<pre class="command-line" data-prompt="c:\users\gokdumano>"><code class="lang-batch" data-prismjs-copy="copy">:: ========================================================================
:: NETWORK CONFIGURATION
:: ========================================================================
:: --nic1 nat                                                     First adapter uses NAT for internet access
:: --nic-type1 82545EM                                            Intel PRO/1000 MT Server network adapter for high performance
:: --cable-connected1 on                                          Ensures NAT adapter is connected
:: --nic2 hostonly                                                Second adapter for VM-to-VM communication
:: --nic-type2 82545EM                                            Intel PRO/1000 MT Server for host-only network
:: --cable-connected2 on                                          Ensures host-only adapter is connected
:: --host-only-adapter2 "VirtualBox Host-Only Ethernet Adapter"   Specifies which host-only interface to use (may need to be created first)
:: ========================================================================
:: PORT FORWARDING FOR DATABASE ACCESS
:: ========================================================================
:: --nat-pf1 "SSH,tcp,,2222,,22"                                  Forwards SSH port for remote administration
:: --nat-pf1 "PostgreSQL,tcp,,8001,,5432"                         Forwards PostgreSQL port for external database connections
:: --nat-pf1 "Oracle,tcp,,8002,,1521"                             Forwards Oracle Database port for external database connections
:: --nat-pf1 "MySQL,tcp,,8003,,3306"                              Forwards MySQL/MariaDB port for external database connections
:: ========================================================================
VBoxManage modifyvm rocky-linux-db-lab                       ^
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
--nat-pf1 "MySQL,tcp,,8003,,3306"</code></pre>

### 1.4. Create Virtual Storage

#### 1.4.1 Create a Virtual Hard Disk

The `VBoxManage createmedium` command creates a new medium, such as a disk image file.

<pre class="command-line" data-prompt="c:\users\gokdumano>" data-continuation-prompt="More?" data-continuation-str=" ^" data-filter-output="(out)">
<code class="lang-batch" data-prismjs-copy="copy">:: --size               Specifies the image capacity in one megabyte units.
:: --format             Specifies the file format of the output file.
:: --variant=Standard   The variant that has a dynamically allocated file size.
:: --filename           Specifies the absolute path name to a file on the host file system.
VBoxManage createmedium disk ^
--size 40960                 ^
--format VDI                 ^
--variant Standard           ^
--filename "E:\VirtualBox VMs\rocky-linux-db-lab\rocky-linux-db-lab.vdi"
:: 0%...10%...20%...30%...40%...50%...60%...70%...80%...90%...100%
:: Medium created. UUID: 0d676fb6-a2c3-43fa-b57f-8cb9f2d4754a</code></pre>

This creates a 40GB dynamically allocated disk that grows as needed.

#### 1.4.2 Add Storage Controllers

The `VBoxManage storagectl` command enables you to attach, modify, and remove a storage controller.

Create SATA controller for the hard disk:

<pre class="command-line" data-prompt="c:\users\gokdumano>" data-continuation-prompt="More?" data-continuation-str=" ^" data-filter-output="(out)">
<code class="lang-batch" data-prismjs-copy="copy">:: --name          Specifies the name of the storage controller.
:: --add           Specifies the type of the system bus to which to connect the storage controller.
:: --hostiocache   Specifies whether to use the host I/O cache for all disk images attached to this storage controller.
:: --bootable      Specifies whether this controller is bootable.
VBoxManage storagectl rocky-linux-db-lab ^
--name "SATA Controller"                 ^
--add sata                               ^
--hostiocache on                         ^
--bootable on</code></pre>

Create IDE controller for the installation media:

<pre class="command-line" data-prompt="c:\users\gokdumano>" data-continuation-prompt="More?" data-continuation-str=" ^" data-filter-output="(out)">
<code class="lang-batch" data-prismjs-copy="copy">VBoxManage storagectl rocky-linux-db-lab ^
--name "IDE Controller"                  ^
--add ide</code></pre>

After you configure the storage controller, you can use the `VBoxManage storageattach` command to attach virtual media to the controller.

#### 1.4.3 Attach Storage Devices

The `VBoxManage storageattach` command enables you to manage a storage medium that you connected to a storage controller by using the `VBoxManage storagectl` command.

Attach the virtual hard disk:

<pre class="command-line" data-prompt="c:\users\gokdumano>" data-continuation-prompt="More?" data-continuation-str=" ^" data-filter-output="(out)">
<code class="lang-batch" data-prismjs-copy="copy">:: --storagectl        Specifies the name of the storage controller. 
:: --port              Specifies the port number of the storage controller to modify.
:: --device            Specifies the port's device number to modify.
:: --type              Specifies the drive type to which the medium is associated.
:: --medium=filename   Specifies the full path of an existing disk image to attach to the specified device slot. 
VBoxManage storageattach rocky-linux-db-lab ^
--storagectl "SATA Controller"              ^
--port 0                                    ^
--device 0                                  ^
--type hdd                                  ^
--medium "E:\VirtualBox VMs\rocky-linux-db-lab\rocky-linux-db-lab.vdi"</code></pre>

Attach the Rocky Linux ISO:

<pre class="command-line" data-prompt="c:\users\gokdumano>" data-continuation-prompt="More?" data-continuation-str=" ^" data-filter-output="(out)">
<code class="lang-batch" data-prismjs-copy="copy">:: --storagectl        Specifies the name of the storage controller. 
:: --port              Specifies the port number of the storage controller to modify.
:: --device            Specifies the port's device number to modify.
:: --type              Specifies the drive type to which the medium is associated.
:: --medium=filename   Specifies the full path of an existing disk image to attach to the specified device slot. 
VBoxManage storageattach rocky-linux-db-lab ^
--storagectl "IDE Controller"               ^
--port 0                                    ^
--device 0                                  ^
--type dvddrive                             ^
--medium %userprofile%\downloads\Rocky-9-latest-x86_64-minimal.iso"</code></pre>

## 2. Rocky Linux 9 Installation

All you need to do is follow the onscreen instructions to complete the installation. Now you can boot the VM and start the guest installation using the following command, which starts in GUI mode by default, taking you through a standard guest OS installer:

<pre class="command-line" data-prompt="c:\users\gokdumano>" data-continuation-prompt="More?" data-continuation-str=" ^" data-filter-output="(out)">
<code class="lang-batch" data-prismjs-copy="copy">VBoxManage startvm rocky-linux-db-lab
:: Waiting for VM "rocky-linux-db-lab" to power on...
:: VM "rocky-linux-db-lab" has been successfully started.

VBoxManage list --long runningvms | findstr /c:"Name:"
:: Name:                        rocky-linux-db-lab</code></pre>The figure below shows the first Rocky Linux 9 installation screen you should see upon the first start of the VM.

{{< figure src="/img/002_gui_installation_with_monitor.PNG" alt="The guest OS installation begins upon the first boot of the VM" position="center" caption="The guest OS installation begins upon the first boot of the VM" captionPosition="center" >}}

**User Creation**
- *Create a standard user account*
- *Username*: dbadmin
- *Password*: Strong password
- *Make this user administrator*: ✓

{{< figure src="/img/002_user_creation.PNG" alt="User creation settings" position="center" caption="User creation settings" captionPosition="center" >}}

**Time & Date**
- *Set your timezone correctly*
- *Enable Network Time Protocol (NTP)*

**Network & Host Name**
- *Hostname*: dblab.local
- *Enable both network interfaces*
- *Configure static IP for host-only adapter if needed*

{{< figure src="/img/002_installation_summary_configuration.PNG" alt="Installation Summary Configuration" position="center" caption="Installation Summary Configuration" captionPosition="center" >}}

Once you have completed the OS installation, you can cleanly shut down the VM from within the guest, which causes Oracle VM VirtualBox to power off the VM was well. You can also initiate this from Oracle VM VirtualBox using the following command, which is equivalent to briefly pressing the power button on a physical computer:

<pre class="command-line" data-prompt="c:\users\gokdumano>" data-continuation-prompt="More?" data-continuation-str=" ^" data-filter-output="(out)">
<code class="lang-batch" data-prismjs-copy="copy">VBoxManage controlvm rocky-linux-db-lab acpipowerbutton</code></pre>


Operating systems that are programmed to respond to this command will shut themselves down. You can forcibly shut down a VM using the following command, which is equivalent to pressing and holding a computer's power button:

<pre class="command-line" data-prompt="c:\users\gokdumano>" data-continuation-prompt="More?" data-continuation-str=" ^" data-filter-output="(out)">
<code class="lang-batch" data-prismjs-copy="copy">VBoxManage controlvm rocky-linux-db-lab poweroff</code></pre>

Finally, since the OS is installed in the guest, you can remove the DVD from the VM configuration:

<pre class="command-line" data-prompt="c:\users\gokdumano>" data-continuation-prompt="More?" data-continuation-str=" ^" data-filter-output="(out)">
<code class="lang-batch" data-prismjs-copy="copy">VBoxManage storageattach rocky-linux-db-lab ^
--storagectl "IDE Controller"               ^
--port 0                                    ^
--device 0                                  ^
--type dvddrive                             ^
--medium none</code></pre>

{{< figure src="/img/002_first_login.PNG" alt="The First Login Following Installation" position="center" caption="The First Login Following Installation" captionPosition="center" >}}

### 2.1. Post-Installation Configuration

**System Updates**

First, update the system completely:

<pre class="command-line" data-user="dbadmin" data-host="remotehost" data-filter-output="(out)" data-continuation-str="\" >
<code class="lang-bash" data-prismjs-copy="copy"># Switch to root
sudo su -

# Update all packages
dnf update --assumeyes # automatically answer yes for all questions

# To list all the available package groups in the repositories of 
# our distribution all we have to do is to run the following command:

# --extended-regexp Interpret PATTERNS as extended regular expressions
grep --extended-regexp 'Group|Description' < <(dnf group info development)
#Group: Development Tools
# Description: A basic development environment.

dnf group install "Development



# Install additional useful packages
dnf update                                   \
# automatically answer yes for all questions \
--assumeyes                                  \
# include optional packages from group       \
--with-optional                              \
"Development Tools"

dnf install  \
--assumeyes  \
wget curl vim htop git tree net-tools

# Reboot to ensure kernel updates take effect
reboot</code></pre>

**Security Hardening**

Configure Firewall:

## 3. Starting a VM on a Headless Server

As an option, Oracle VM VirtualBox allows you to monitor a VM remotely over the VirtualBox Remote Display Protocol (VRDP). This can be particularly useful if your server doesn't have a physical monitor and you want the VM to be displayed on another computer.

Oracle VM VirtualBox provides remote machine display through the VirtualBox Remote Desktop Extension (VRDE) interface implemented within the Oracle VM VirtualBox Extension Pack package

<pre class="command-line" data-prompt="c:\users\gokdumano>" data-continuation-prompt="More?" data-continuation-str=" ^" data-filter-output="(out)">
<code class="lang-batch" data-prismjs-copy="copy">VBoxManage modifyvm rocky-linux-db-lab --vrde on</code></pre>

Make sure the installation worked by running the following command:

<pre class="command-line" data-prompt="c:\users\gokdumano>" data-continuation-prompt="More?" data-continuation-str=" ^" data-filter-output="(out)">
<code class="lang-batch" data-prismjs-copy="copy">VBoxManage showvminfo rocky-linux-db-lab | findstr /b "VRDE:"
:: VRDE:     enabled (Address 0.0.0.0, Ports 3389, MultiConn: off, ReuseSingleConn: off, Authentication type: null)</code></pre>

Now you can start your VM for remote access, specifying type `headless` with the `VBoxManage startvm` command, which starts the VM but produces no visible output, delivering VRDP data to be displayed remotely on another computer:

<pre class="command-line" data-prompt="c:\users\gokdumano>" data-continuation-prompt="More?" data-continuation-str=" ^" data-filter-output="(out)">
<code class="lang-batch" data-prismjs-copy="copy">VBoxManage startvm rocky-linux-db-lab --type headless
:: Waiting for VM "rocky-linux-db-lab" to power on...
:: VM "rocky-linux-db-lab" has been successfully started.</code></pre>

Then you can connect to the VM from another computer using any standard RDP viewer. In Windows, for example, you might use the Remote Desktop Connection tool, which is part of a regular installation.