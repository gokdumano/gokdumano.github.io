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

draft = true
toc = false
showFullContent = false
slug= "postgresql-installation-configuration-rocky-linux"
canonical = "https://gokdumano.github.io/posts/postgresql-installation-configuration-rocky-linux/"
mermaid = true
+++

# PostgreSQL Installation and Configuration: A Production-Ready Setup Guide

Setting up PostgreSQL correctly from the beginning can save you countless hours of troubleshooting later. Whether you're a developer setting up your first database or a DBA preparing a production environment, this comprehensive guide covers everything you need to know about PostgreSQL installation, directory structure, permissions, and performance optimization.

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
/tmp/backup/postgresql/  # Temporary backup location (2 GiB /tmp)
/home/dbadmin/scripts/   # Administrative scripts
```

**Why this setup works well:**
- XFS file system provides excellent performance for database workloads
- 20 GiB `/var` mount gives plenty of space for data growth
- Separate `/tmp` mount prevents backup operations from filling root partition

## Package Manager Installation {#package-manager-installation}
```bash
# Rocky Linux 9.6
# As postgres user with sudo privileges

# Install PostgreSQL repository for RHEL 9 compatible
sudo dnf install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-9-x86_64/pgdg-redhat-repo-latest.noarch.rpm

# Install PostgreSQL 17
sudo dnf install -y postgresql17-{server,contrib}

# Initialize database with custom data directory in /var
sudo /usr/pgsql-17/bin/postgresql-17-setup initdb
# Initializing database ... OK

tail /var/lib/pgsql/17/initdb.log
# selecting default time zone ... Europe/Istanbul
# creating configuration files ... ok
# running bootstrap script ... ok
# performing post-bootstrap initialization ... ok
# syncing data to disk ... ok
# 
# Success. You can now start the database server using:
# 
#     /usr/pgsql-17/bin/pg_ctl -D /var/lib/pgsql/17/data/ -l logfile start

```

## Directory Structure and Permissions {#directory-structure-and-permissions}

Understanding PostgreSQL's directory structure is crucial for proper administration.

### Standard Directory Layout {#directory-layout}

```ascii
/var/lib/pgsql/17/data/
├── base/                    # Database files
├── global/                  # Cluster-wide tables
├── pg_wal/                  # Write-Ahead Log files
├── pg_xact/                 # Transaction status data
├── pg_log/                  # Server log files
├── postgresql.conf          # Main configuration file
├── pg_hba.conf              # Host-based authentication
├── pg_ident.conf            # User name mapping
└── postmaster.pid           # Process ID file
```

## Initial Configuration for Performance {#initial-configuration-for-performance}

### Understanding postgresql.conf Tuning Strategy {#postgresql-conf-tuning}

PostgreSQL's performance heavily depends on proper configuration tuning. Our tuning strategy for your Rocky Linux 9.6 environment considers:

1. **Hardware Constraints**: 4 GiB RAM, XFS file system, VM environment
2. **Disk Layout**: 20 GiB `/var` partition for database files
3. **Workload Assumptions**: Mixed OLTP workload with moderate concurrency
4. **Resource Allocation**: Conservative approach to prevent memory exhaustion

### Complete postgresql.conf Configuration {#complete-postgresql-conf}

Here's a production-ready postgresql.conf optimized for your specific environment:

```bash
# =============================================================================
# POSTGRESQL.CONF - OPTIMIZED FOR ROCKY LINUX 9.6 (4GB RAM, 20GB /var)
# =============================================================================
sudo mkdir /var/log/postgresql/ /var/lib/pgsql/17/data/postgresql.conf.d
chown postgres:dbadmin /var/log/postgresql

tee /var/lib/pgsql/17/data/postgresql.conf.d/00_connections_and_authentication.conf 1>/dev/null <<BODY
# -----------------------------------------------------------------------------
# CONNECTIONS AND AUTHENTICATION
# -----------------------------------------------------------------------------
listen_addresses = '*'                  # Security: only local connections initially
port = 5432                             # Standard PostgreSQL port
max_connections = 50                    # Conservative: each connection uses ~4MB RAM
superuser_reserved_connections = 3      # Reserve connections for superuser
BODY

tee /var/lib/pgsql/17/data/postgresql.conf.d/01_memory.conf 1>/dev/null <<BODY
# -----------------------------------------------------------------------------
# MEMORY SETTINGS (Critical for 4GB RAM)
# -----------------------------------------------------------------------------
shared_buffers = 1GB                    # 25% of RAM - conservative for VM
huge_pages = try                        # Use huge pages if available
temp_buffers = 32MB                     # Temporary tables buffer
work_mem = 16MB                         # Per-operation memory (50 conn * 16MB = 800MB max)
hash_mem_multiplier = 1.0               # Default hash memory factor
maintenance_work_mem = 256MB            # For VACUUM, CREATE INDEX operations
autovacuum_work_mem = 128MB             # Separate memory for autovacuum
max_stack_depth = 2MB                   # Stack depth limit
dynamic_shared_memory_type = posix      # Shared memory implementation

# Memory usage calculation check:
# shared_buffers (1GB) + work_mem_total (800MB) + maintenance (256MB) + OS (1GB) = ~3GB
# This leaves 1GB buffer for OS and other processes
BODY

tee /var/lib/pgsql/17/data/postgresql.conf.d/03_disk_and_io.conf 1>/dev/null <<BODY
# -----------------------------------------------------------------------------
# DISK AND I/O SETTINGS (Optimized for XFS on /var)
# -----------------------------------------------------------------------------
# XFS is excellent for PostgreSQL, these settings optimize for it
wal_buffers = 32MB                      # Conservative WAL buffer for 4GB RAM
effective_cache_size = 2GB              # Available memory for disk caching
effective_io_concurrency = 100          # VM environment - moderate concurrency
random_page_cost = 1.1                  # XFS on modern storage
seq_page_cost = 1.0                     # Sequential scan cost baseline
min_parallel_table_scan_size = 64MB     # Parallel scan threshold
min_parallel_index_scan_size = 32MB     # Parallel index scan threshold
BODY

tee /var/lib/pgsql/17/data/postgresql.conf.d/04_writed_ahead_logging.conf 1>/dev/null <<BODY
# -----------------------------------------------------------------------------
# WRITE-AHEAD LOGGING (WAL) - Optimized for 20GB /var partition
# -----------------------------------------------------------------------------
wal_level = replica                     # Enable replication and backup
fsync = on                              # Ensure data durability
synchronous_commit = on                 # Wait for WAL write completion
wal_sync_method = fdatasync             # Fastest sync method on Linux
full_page_writes = on                   # Protection against torn pages
wal_compression = on                    # Compress WAL files to save space
wal_log_hints = off                     # Save space if no replication planned

# Checkpoint settings - balanced for limited disk space
checkpoint_timeout = 15min              # Maximum time between checkpoints
checkpoint_completion_target = 0.9      # Spread I/O over 90% of interval
max_wal_size = 1GB                      # Maximum WAL size before checkpoint
min_wal_size = 256MB                    # Minimum WAL files to keep
checkpoint_warning = 30s                # Warn if checkpoints happen too frequently
BODY

tee /var/lib/pgsql/17/data/postgresql.conf.d/05_query_planner.conf 1>/dev/null <<BODY
# -----------------------------------------------------------------------------
# QUERY PLANNER SETTINGS
# -----------------------------------------------------------------------------
default_statistics_target = 100         # Statistics detail level
constraint_exclusion = partition        # Enable for partitioned tables
cursor_tuple_fraction = 0.1             # Optimize for cursor fetches
from_collapse_limit = 8                 # FROM item collapse limit
join_collapse_limit = 8                 # JOIN collapse limit
BODY

tee /var/lib/pgsql/17/data/postgresql.conf.d/06_error_reporting_and_logging.conf 1>/dev/null <<BODY
# -----------------------------------------------------------------------------
# ERROR REPORTING AND LOGGING (Space-conscious)
# -----------------------------------------------------------------------------
log_destination = 'jsonlog'             # Send logs to stderr
logging_collector = on                  # Enable log file collector
log_directory = '/var/log/postgresql/'   # Log directory in /var partition
log_filename = 'postgresql-%a.log'      # Weekly rotation (7 files max)
log_file_mode = 0640                    # Log file permissions
log_rotation_age = 1d                   # Rotate logs daily
log_rotation_size = 100MB               # Rotate when file reaches 100MB
log_truncate_on_rotation = on           # Overwrite old log files

# What to log (performance-focused, space-conscious)
log_min_duration_statement = 2000       # Log queries taking 2+ seconds
log_checkpoints = on                    # Log checkpoint activity
log_connections = off                   # Disabled to save space
log_disconnections = off                # Disabled to save space
log_lock_waits = on                     # Important for debugging deadlocks
log_temp_files = 10MB                   # Log temp files larger than 10MB
log_autovacuum_min_duration = 1000      # Log slow autovacuum operations

# Log format for analysis
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
log_statement = 'none'                  # Don't log all statements (space concern)
log_timezone = 'UTC'                    # Use UTC for consistency
BODY

tee /var/lib/pgsql/17/data/postgresql.conf.d/07_autovacumm.conf 1>/dev/null <<BODY
# -----------------------------------------------------------------------------
# AUTOVACUUM SETTINGS (Critical for maintenance)
# -----------------------------------------------------------------------------
autovacuum = on                         # Enable automatic vacuuming
autovacuum_max_workers = 2              # Conservative for 4GB RAM
autovacuum_naptime = 1min               # Check for work every minute
autovacuum_vacuum_threshold = 50        # Minimum updates before vacuum
autovacuum_vacuum_scale_factor = 0.1    # Fraction of table size for vacuum trigger
autovacuum_vacuum_insert_threshold = 1000   # Inserts before vacuum
autovacuum_analyze_threshold = 50       # Minimum updates before analyze
autovacuum_analyze_scale_factor = 0.05  # Fraction for analyze trigger
BODY

tee /var/lib/pgsql/17/data/postgresql.conf.d/08_client_connection.conf 1>/dev/null <<BODY
# -----------------------------------------------------------------------------
# CLIENT CONNECTION DEFAULTS
# -----------------------------------------------------------------------------
default_text_search_config = 'pg_catalog.english'  # Default search config
timezone = 'UTC'                        # Use UTC for consistency
lc_messages = 'C.UTF-8'                # Message locale
lc_monetary = 'C.UTF-8'                # Monetary locale
lc_numeric = 'C.UTF-8'                 # Numeric locale
lc_time = 'C.UTF-8'                    # Time locale
default_transaction_isolation = 'read committed'  # Default isolation level
BODY

tee /var/lib/pgsql/17/data/postgresql.conf.d/09_resource_usage.conf 1>/dev/null <<BODY
# -----------------------------------------------------------------------------
# RESOURCE USAGE (Additional settings for VM environment)
# -----------------------------------------------------------------------------
max_files_per_process = 1000           # Conservative file limit
max_locks_per_transaction = 64         # Default lock allocation
max_wal_senders = 3                    # For backup and replication
max_replication_slots = 3              # Replication slot limit
BODY

tee /var/lib/pgsql/17/data/postgresql.conf.d/10_performance_monitoring.conf 1>/dev/null <<BODY
# -----------------------------------------------------------------------------
# PERFORMANCE MONITORING
# -----------------------------------------------------------------------------
track_activities = on                   # Enable activity tracking
track_counts = on                      # Enable statistics collection
track_io_timing = on                   # Track I/O timing (useful for analysis)
track_functions = all                  # Track function call statistics
track_wal_io_timing = on               # Track WAL I/O timing

# Extensions for monitoring (add these to shared_preload_libraries)
shared_preload_libraries = 'pg_stat_statements'

# pg_stat_statements configuration
pg_stat_statements.max = 1000          # Maximum statements tracked
pg_stat_statements.track = all         # Track all statements
pg_stat_statements.track_utility = on  # Track utility commands
pg_stat_statements.save = on           # Save statistics across restarts
BODY

tee --append /var/lib/pgsql/17/data/postgresql.conf 1>/dev/null <<BODY
include_dir = '/var/lib/pgsql/17/data/postgresql.conf.d'
BODY
```


```bash
# Enable and start the service
sudo systemctl enable --now postgresql-17.service

# Verify installation
systemctl status postgresql-17.service
```
### Setting Correct Permissions {#setting-permissions}

**Critical security setup for Rocky Linux with dbadmin user:**
```bash
# PostgreSQL user already created by package installation
# Ensure correct ownership (dbadmin can manage through sudo)
sudo chown -R postgres:dbadmin /var/lib/pgsql/17/
sudo chmod 700 /var/lib/pgsql/15/data/

# Grant dbadmin user necessary sudo permissions
sudo usermod -aG wheel dbadmin
echo 'dbadmin ALL=(postgres) NOPASSWD: ALL' | sudo tee /etc/sudoers.d/dbadmin-postgres

# Secure configuration files
sudo chmod 640 /var/lib/pgsql/17/data/postgresql.conf
sudo chmod 640 /var/lib/pgsql/17/data/pg_hba.conf

# Create directories for scripts and backups
sudo mkdir -p /home/dbadmin/scripts
sudo mkdir -p /tmp/backup/postgresql
sudo chown postgres:dbadmin /home/dbadmin/scripts
sudo chown postgres:dbadmin /tmp/backup/postgresql
```

### Configuration Tuning Methodology {#configuration-tuning-methodology}

**Step 1: Calculate Memory Allocation**
```bash
# Our 4GB RAM breakdown:
# - OS and processes: ~1GB
# - PostgreSQL shared_buffers: 1GB  
# - PostgreSQL work_mem pool: ~800MB (50 connections × 16MB)
# - PostgreSQL maintenance: 256MB
# - Safety buffer: ~200MB
```

**Step 2: Monitor and Adjust**
```sql
-- Check current memory usage
SELECT 
    setting AS shared_buffers_mb,
    unit 
FROM pg_settings 
WHERE name = 'shared_buffers';

-- Monitor connection memory usage
SELECT 
    count(*) as active_connections,
    sum(
        CASE 
            WHEN state = 'active' THEN 1 
            ELSE 0 
        END
    ) as active_queries
FROM pg_stat_activity;
```

**Step 3: Validate Settings**
```bash
# Check if PostgreSQL can start with new settings
sudo -u postgres /usr/pgsql-17/bin/postgres --config-file=/var/lib/pgsql/17/data/postgresql.conf --check

# Monitor system resources after restart
watch -n 2 'free -m && echo "---" && df -h /var'
```

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