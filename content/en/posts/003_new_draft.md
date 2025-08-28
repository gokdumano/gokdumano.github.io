+++
title = "PostgreSQL Installation and Configuration: Complete Guide for Rocky Linux 9.6"
date = "2024-08-28"
author = "Deniz Gökduman"
cover = "img/assets_task_01k3rdfbesfcdss2zv0jt11n47_1756387451_img_1.webp"
coverCredit = 'PostgreSQL Installation and Configuration'
coverAltText = 'PostgreSQL Installation and Configuration: Complete Guide for Rocky Linux 9.6'

tags= ["postgresql", "rocky-linux", "database-installation", "performance-tuning", "database-security", "system-administration"]
keywords= "PostgreSQL installation, Rocky Linux 9.6, database configuration, PostgreSQL performance tuning, database security, PostgreSQL setup guide"
description= "Learn how to install and configure PostgreSQL on Rocky Linux 9.6 with optimal performance settings, security hardening, and resource management for production environments."
categories= ["Database", "PostgreSQL", "Linux", "System Administration"]

toc = true
showFullContent = false
slug= "postgresql-installation-configuration-rocky-linux"
canonical = "https://gokdumano.github.io/posts/postgresql-installation-configuration-rocky-linux/"
mermaid = true
+++

# PostgreSQL Installation and Configuration: A Production-Ready Setup Guide

Setting up PostgreSQL correctly from the beginning can save you countless hours of troubleshooting later. Whether you're a developer setting up your first database or a DBA preparing a production environment, this comprehensive guide covers everything you need to know about PostgreSQL installation, directory structure, permissions, and performance optimization.

```batch
VBoxManage                  ^
snapshot rocky-linux-db-lab ^
take ver.1                  ^
--uniquename timestamp      ^
--description "Snapshot taken right after VM setup"

VBoxManage                  ^
startvm rocky-linux-db-lab  ^
--type headless
```

**Table of Contents**
- [Pre-Installation Planning](#pre-installation-planning)
- [Installation Methods](#installation-methods)
- [Directory Structure and Permissions](#directory-structure-and-permissions)
- [Initial Configuration for Performance](#initial-configuration-for-performance)
- [Security Hardening](#security-hardening)
- [Post-Installation Steps](#post-installation-steps)
- [Performance Testing](#performance-testing)
- [Maintenance and Monitoring](#maintenance-and-monitoring)

## Pre-Installation Planning {#pre-installation-planning}

Before diving into the installation, let's plan our setup properly. A well-planned PostgreSQL installation considers data location, backup strategies, and future scaling needs.

### Optimizing for Rocky Linux 9.6 with Limited Resources

**Our target environment:**
- **Operating System:** Rocky Linux 9.6 on Oracle VM
- **RAM:** 4 GiB (requires careful memory tuning)
- **Storage:** 40 GiB with XFS file system on `/var`
- **Administrative User:** dbadmin (root disabled for security)

**Storage layout optimization:**
```bash
# Leveraging the existing disk partitioning
/var/lib/postgresql/     # Main data directory (20 GiB /var mount)
/var/log/postgresql/     # Log files (same /var mount)
/tmp/postgresql_backup/  # Temporary backup location (2 GiB /tmp)
/home/dbadmin/scripts/   # Administrative scripts
```

**Why this setup works well:**
- XFS file system provides excellent performance for database workloads
- 20 GiB `/var` mount gives plenty of space for data growth
- Separate `/tmp` mount prevents backup operations from filling root partition

## Installation Methods {#installation-methods}

### Package Manager Installation (Recommended) {#package-manager-installation}

**Rocky Linux 9.6:**
```bash
sudo su -

# Install PostgreSQL repository for RHEL 9 compatible
dnf --assumeyes install https://download.postgresql.org/pub/repos/yum/reporpms/EL-9-x86_64/pgdg-redhat-repo-latest.noarch.rpm

# Disable the built-in PostgreSQL module:
dnf --quiet --assumeyes module disable postgresql

# Install PostgreSQL:
dnf install -y postgresql17-server

# Optionally initialize the database and enable automatic start:
/usr/pgsql-17/bin/postgresql-17-setup initdb
systemctl enable --now postgresql-17

# Install PostgreSQL 15 (recommended for Rocky Linux 9.6)
sudo dnf install -y postgresql15-server postgresql15-contrib

# Initialize database with custom data directory in /var
sudo /usr/pgsql-15/bin/postgresql-15-setup initdb

# Enable and start the service
sudo systemctl enable --now postgresql-15

# Verify installation
systemctl status postgresql-15



sudo dnf install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-9-x86_64/pgdg-redhat-repo-latest.noarch.rpm
sudo dnf -qy module disable postgresql
sudo dnf install -y postgresql17-server
sudo /usr/pgsql-17/bin/postgresql-17-setup initdb
sudo systemctl enable postgresql-17
sudo systemctl start postgresql-17
```

### Source Compilation (Advanced) {#source-compilation}

For custom builds or specific requirements:
```bash
# Download and extract source
wget https://ftp.postgresql.org/pub/source/v15.4/postgresql-15.4.tar.gz
tar -xzf postgresql-15.4.tar.gz
cd postgresql-15.4

# Configure with optimizations
./configure --prefix=/usr/local/pgsql --with-openssl --with-libxml --with-libxslt
make -j$(nproc)
sudo make install
```

## Directory Structure and Permissions {#directory-structure-and-permissions}

Understanding PostgreSQL's directory structure is crucial for proper administration.

### Standard Directory Layout {#directory-layout}

```
/var/lib/postgresql/15/main/
├── base/                    # Database files
├── global/                  # Cluster-wide tables
├── pg_wal/                  # Write-Ahead Log files
├── pg_xact/                 # Transaction status data
├── pg_log/                  # Server log files
├── postgresql.conf          # Main configuration file
├── pg_hba.conf             # Host-based authentication
├── pg_ident.conf           # User name mapping
└── postmaster.pid          # Process ID file
```

### Setting Correct Permissions {#setting-permissions}

**Critical security setup for Rocky Linux with dbadmin user:**
```bash
# PostgreSQL user already created by package installation
# Ensure correct ownership (dbadmin can manage through sudo)
sudo chown -R postgres:postgres /var/lib/pgsql/15/
sudo chmod 700 /var/lib/pgsql/15/data/

# Grant dbadmin user necessary sudo permissions
sudo usermod -aG wheel dbadmin
echo 'dbadmin ALL=(postgres) NOPASSWD: ALL' | sudo tee /etc/sudoers.d/dbadmin-postgres

# Secure configuration files
sudo chmod 640 /var/lib/pgsql/15/data/postgresql.conf
sudo chmod 640 /var/lib/pgsql/15/data/pg_hba.conf

# Create directories for scripts and backups
sudo mkdir -p /home/dbadmin/scripts
sudo mkdir -p /tmp/postgresql_backup
sudo chown dbadmin:dbadmin /home/dbadmin/scripts
sudo chown postgres:postgres /tmp/postgresql_backup
```

## Initial Configuration for Performance {#initial-configuration-for-performance}

### Memory Configuration for 4 GiB RAM System {#memory-configuration}

**In /var/lib/pgsql/15/data/postgresql.conf:**
```sql
# Memory settings optimized for 4GB RAM system
shared_buffers = 1GB                    # 25% of total RAM (conservative)
effective_cache_size = 2GB              # 50% of total RAM (OS needs memory too)
work_mem = 16MB                         # Conservative for limited RAM
maintenance_work_mem = 256MB            # For maintenance operations

# Connection settings (important for limited memory)
max_connections = 50                    # Reduced for memory efficiency
```

**Important for 4GB systems:**
- Keep `shared_buffers` conservative to leave memory for OS and other processes
- Lower `max_connections` to prevent memory exhaustion
- Monitor swap usage to avoid performance degradation

### Write-Ahead Logging (WAL) Optimization for Limited Disk {#wal-optimization}

```sql
# WAL settings optimized for 20GB /var partition
wal_buffers = 32MB                      # Conservative for 4GB RAM
checkpoint_completion_target = 0.9
max_wal_size = 1GB                      # Smaller for limited space
min_wal_size = 256MB                    # Reduced for space conservation

# Archive settings using /tmp for temporary backup storage
wal_level = replica
archive_mode = on
archive_command = 'test ! -f /tmp/postgresql_backup/wal/%f && cp %p /tmp/postgresql_backup/wal/%f'

# Create WAL archive directory
# Run as dbadmin: sudo mkdir -p /tmp/postgresql_backup/wal && sudo chown postgres:postgres /tmp/postgresql_backup/wal
```

### Query Optimization Settings {#query-optimization}

```sql
# Query planner settings optimized for XFS and limited resources
random_page_cost = 1.1                  # For SSD/fast storage
effective_io_concurrency = 100          # Conservative for VM environment
seq_page_cost = 1.0

# Logging for performance analysis (be careful with disk space)
log_min_duration_statement = 2000       # Log queries taking 2+ seconds
log_checkpoints = on
log_connections = off                    # Disabled to save disk space
log_disconnections = off                 # Disabled to save disk space
log_lock_waits = on                      # Important for debugging
```

## Security Hardening {#security-hardening}

### Authentication Configuration {#authentication-configuration}

**pg_hba.conf setup:**
```
# TYPE  DATABASE        USER            ADDRESS                 METHOD

# Local connections
local   all             postgres                                peer
local   all             all                                     md5

# Remote connections (be specific about IP ranges)
host    myapp_db        myapp_user      192.168.1.0/24         md5
host    all             all             127.0.0.1/32           md5

# Reject all other connections
host    all             all             0.0.0.0/0              reject
```

### SSL Configuration {#ssl-configuration}

```sql
# In postgresql.conf
ssl = on
ssl_cert_file = 'server.crt'
ssl_key_file = 'server.key'
ssl_ca_file = 'root.crt'
ssl_prefer_server_ciphers = on
```

## Post-Installation Steps {#post-installation-steps}

### 1. Create Application Database and User {#create-database-user}

```sql
-- Connect as superuser (dbadmin can use sudo)
sudo -u postgres psql

-- Create database with locale compatible with Rocky Linux 9.6
CREATE DATABASE myapp_db 
    WITH ENCODING='UTF8' 
    LC_COLLATE='C.UTF-8' 
    LC_CTYPE='C.UTF-8'
    TEMPLATE=template0;

-- Create user with limited privileges
CREATE USER myapp_user WITH PASSWORD 'secure_password_here';
GRANT CONNECT ON DATABASE myapp_db TO myapp_user;
GRANT USAGE ON SCHEMA public TO myapp_user;
GRANT CREATE ON SCHEMA public TO myapp_user;
```

### 2. Set Up Backup Strategy for Limited Disk Space {#backup-strategy}

```bash
# Create backup script for dbadmin user
cat > /home/dbadmin/scripts/pg_backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/tmp/postgresql_backup"
DATE=$(date +%Y%m%d_%H%M%S)
MAX_BACKUPS=3  # Keep only 3 backups due to space limitations

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"

# Full database backup with compression to save space
sudo -u postgres pg_dump -h localhost myapp_db | gzip > "$BACKUP_DIR/myapp_db_$DATE.sql.gz"

# Remove old backups, keep only the most recent ones
ls -t "$BACKUP_DIR"/myapp_db_*.sql.gz | tail -n +$((MAX_BACKUPS + 1)) | xargs -r rm

# Log backup completion
echo "$(date): Backup completed - $BACKUP_DIR/myapp_db_$DATE.sql.gz" >> /var/log/postgresql/backup.log
EOF

chmod +x /home/dbadmin/scripts/pg_backup.sh

# Test the backup script
/home/dbadmin/scripts/pg_backup.sh

# Add to dbadmin's crontab for daily backups at 2 AM
(crontab -u dbadmin -l 2>/dev/null; echo "0 2 * * * /home/dbadmin/scripts/pg_backup.sh") | crontab -u dbadmin -
```

### 3. Monitoring Setup {#monitoring-setup}

```sql
-- Enable pg_stat_statements for query analysis
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Check configuration
SELECT name, setting FROM pg_settings WHERE name LIKE 'shared_preload%';
```

## Performance Testing on Limited Resources {#performance-testing}

Verify your installation with scaled performance tests suitable for 4GB RAM:

```bash
# Initialize pgbench with smaller scale for limited resources
sudo -u postgres pgbench -i -s 10 myapp_db  # Reduced from 100 to 10

# Run performance test with reduced connections
sudo -u postgres pgbench -c 5 -j 2 -t 500 myapp_db  # Conservative settings

# Monitor system resources during testing
# In another terminal as dbadmin:
watch -n 1 'free -m && echo "---" && df -h /var'
```

## Common Pitfalls to Avoid in Resource-Constrained Environments {#common-pitfalls}

1. **Never exceed 25% of RAM for shared_buffers on 4GB systems**
2. **Monitor swap usage - PostgreSQL performance degrades severely with swapping**
3. **Don't set max_connections too high - each connection uses ~2-4MB RAM**
4. **Always compress backups to save disk space in /tmp**
5. **Use `VACUUM` regularly to prevent table bloat in limited disk space**
6. **Monitor /var disk usage - 20GB can fill up quickly with logs and data**

## Rocky Linux 9.6 Specific Considerations {#rocky-linux-considerations}

```bash
# Configure firewall for PostgreSQL (if enabled)
sudo firewall-cmd --permanent --add-port=5432/tcp
sudo firewall-cmd --reload

# SELinux considerations (if enforcing)
sudo setsebool -P postgresql_can_rsync on

# Check system limits for postgres user
sudo -u postgres ulimit -a
```

## Maintenance Tasks for Resource-Constrained Systems {#maintenance-and-monitoring}

Create a maintenance checklist optimized for your 4GB/20GB setup:

```bash
# Daily tasks (automated via cron)
# Monitor disk space
df -h /var >> /var/log/postgresql/disk_usage.log

# Weekly tasks (run as dbadmin)
sudo -u postgres psql -d myapp_db -c "VACUUM ANALYZE;"

# Monthly tasks
# Backup verification and cleanup
/home/dbadmin/scripts/pg_backup.sh
# Log file rotation (automatically handled by Rocky Linux logrotate)

# Quarterly tasks
# Extension updates and minor version upgrades
sudo dnf update postgresql15*
```

## Conclusion {#conclusion}

A properly configured PostgreSQL installation is the foundation of any robust database system. By following this guide, you've set up a secure, performant, and maintainable PostgreSQL environment optimized for Rocky Linux 9.6 with limited resources. Remember to monitor your system regularly and adjust configurations based on your specific workload patterns.

**Next Steps:** Now that you have a solid PostgreSQL installation, you can focus on advanced topics like index optimization, query tuning, and scaling strategies to maximize your database performance.

### Related Articles
- PostgreSQL Index Optimization Techniques
- Database Performance Monitoring on Linux
- PostgreSQL Backup and Recovery Strategies

### Frequently Asked Questions {#faq}

**Q: Can I increase shared_buffers beyond 1GB on a 4GB system?**
A: It's not recommended. Leave sufficient memory for the OS and other processes to avoid swapping, which severely impacts PostgreSQL performance.

**Q: How often should I run VACUUM on my database?**
A: For active databases, run VACUUM ANALYZE weekly. For high-transaction systems, consider enabling autovacuum with custom settings.

**Q: What's the minimum disk space required for PostgreSQL on Rocky Linux 9.6?**
A: The installation requires about 500MB, but plan for at least 10GB for data, logs, and growth. Our 20GB `/var` partition provides comfortable headroom.

---
*This installation guide provides a production-ready PostgreSQL setup optimized for Rocky Linux 9.6 in resource-constrained environments. Always test configuration changes in a development environment before applying them to production systems.*

**Keywords:** PostgreSQL installation, Rocky Linux database setup, PostgreSQL configuration, database performance tuning, PostgreSQL security, Linux database administration