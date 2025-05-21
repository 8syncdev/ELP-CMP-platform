# Base image
ADD file:9b38b383dd93169a663eed88edf3f2285b837257ead69dc40ab5ed1fb3f52c35 in / # 80.66 MB

# Default command
CMD ["bash"]

# Create postgres user and group, set up directories
RUN set -eux; \
    groupadd -r postgres --gid=999; \
    useradd -r -g postgres --uid=999 --home-dir=/var/lib/postgresql --shell=/bin/bash postgres; \
    mkdir -p /var/lib/postgresql; \
    chown -R postgres:postgres /var/lib/postgresql # 327.17 KB

# Install gnupg and less
RUN set -ex; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
        gnupg \
        less; \
    rm -rf /var/lib/apt/lists/* # 9.41 MB

# Set GOSU_VERSION
ENV GOSU_VERSION=1.17

# Install gosu
RUN set -eux; \
    savedAptMark="$(apt-mark showmanual)"; \
    apt-get update; \
    apt-get install -y --no-install-recommends ca-certificates wget; \
    rm -rf /var/lib/apt/lists/*; \
    dpkgArch="$(dpkg --print-architecture | awk -F- '{ print $NF }')"; \
    wget -O /usr/local/bin/gosu "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$dpkgArch"; \
    wget -O /usr/local/bin/gosu.asc "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$dpkgArch.asc"; \
    export GNUPGHOME="$(mktemp -d)"; \
    gpg --batch --keyserver hkps://keys.openpgp.org --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4; \
    gpg --batch --verify /usr/local/bin/gosu.asc /usr/local/bin/gosu; \
    gpgconf --kill all; \
    rm -rf "$GNUPGHOME" /usr/local/bin/gosu.asc; \
    apt-mark auto '.*' > /dev/null; \
    [ -z "$savedAptMark" ] || apt-mark manual $savedAptMark > /dev/null; \
    apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false; \
    chmod +x /usr/local/bin/gosu; \
    gosu --version; \
    gosu nobody true # 4.23 MB

# Configure locales
RUN set -eux; \
    if [ -f /etc/dpkg/dpkg.cfg.d/docker ]; then \
        grep -q '/usr/share/locale' /etc/dpkg/dpkg.cfg.d/docker; \
        sed -ri '/\/usr\/share\/locale/d' /etc/dpkg/dpkg.cfg.d/docker; \
        ! grep -q '/usr/share/locale' /etc/dpkg/dpkg.cfg.d/docker; \
    fi; \
    apt-get update; \
    apt-get install -y --no-install-recommends locales; \
    rm -rf /var/lib/apt/lists/*; \
    echo 'en_US.UTF-8 UTF-8' >> /etc/locale.gen; \
    locale-gen; \
    locale -a | grep 'en_US.utf8' # 25.11 MB

# Set locale environment
ENV LANG=en_US.utf8

# Install additional utilities
RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
        libnss-wrapper \
        xz-utils \
        zstd; \
    rm -rf /var/lib/apt/lists/* # 2.64 MB

# Create directory for database initialization scripts
RUN mkdir /docker-entrypoint-initdb.d # 0 B

# Import PostgreSQL GPG key
RUN set -ex; \
    key='B97B0AFCAA1A47F044F244A07FCC7D46ACCC4CF8'; \
    export GNUPGHOME="$(mktemp -d)"; \
    mkdir -p /usr/local/share/keyrings/; \
    gpg --batch --keyserver keyserver.ubuntu.com --recv-keys "$key"; \
    gpg --batch --export --armor "$key" > /usr/local/share/keyrings/postgres.gpg.asc; \
    gpgconf --kill all; \
    rm -rf "$GNUPGHOME" # 3.98 KB

# Set PostgreSQL version environment variables
ENV PG_MAJOR=15
ENV PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/lib/postgresql/15/bin
ENV PG_VERSION=15.7-1.pgdg110+1

# Install PostgreSQL
RUN set -ex; \
    export PYTHONDONTWRITEBYTECODE=1; \
    dpkgArch="$(dpkg --print-architecture)"; \
    aptRepo="[ signed-by=/usr/local/share/keyrings/postgres.gpg.asc ] http://apt.postgresql.org/pub/repos/apt/ bullseye-pgdg main $PG_MAJOR"; \
    case "$dpkgArch" in \
        amd64 | arm64 | ppc64el | s390x) \
            echo "deb $aptRepo" > /etc/apt/sources.list.d/pgdg.list; \
            apt-get update; \
            ;; \
        *) \
            echo "deb-src $aptRepo" > /etc/apt/sources.list.d/pgdg.list; \
            savedAptMark="$(apt-mark showmanual)"; \
            tempDir="$(mktemp -d)"; \
            cd "$tempDir"; \
            apt-get update; \
            apt-get install -y --no-install-recommends dpkg-dev; \
            echo "deb [ trusted=yes ] file://$tempDir ./" > /etc/apt/sources.list.d/temp.list; \
            _update_repo() { \
                dpkg-scanpackages . > Packages; \
                apt-get -o Acquire::GzipIndexes=false update; \
            }; \
            _update_repo; \
            nproc="$(nproc)"; \
            export DEB_BUILD_OPTIONS="nocheck parallel=$nproc"; \
            apt-get build-dep -y postgresql-common pgdg-keyring; \
            apt-get source --compile postgresql-common pgdg-keyring; \
            _update_repo; \
            apt-get build-dep -y "postgresql-$PG_MAJOR=$PG_VERSION"; \
            apt-get source --compile "postgresql-$PG_MAJOR=$PG_VERSION"; \
            apt-mark showmanual | xargs apt-mark auto > /dev/null; \
            apt-mark manual $savedAptMark; \
            ls -lAFh; \
            _update_repo; \
            grep '^Package: ' Packages; \
            cd /; \
            ;; \
    esac; \
    apt-get install -y --no-install-recommends postgresql-common; \
    sed -ri 's/#(create_main_cluster) .*$/\1 = false/' /etc/postgresql-common/createcluster.conf; \
    apt-get install -y --no-install-recommends \
        "postgresql-$PG_MAJOR=$PG_VERSION"; \
    rm -rf /var/lib/apt/lists/*; \
    if [ -n "$tempDir" ]; then \
        apt-get purge -y --auto-remove; \
        rm -rf "$tempDir" /etc/apt/sources.list.d/temp.list; \
    fi; \
    find /usr -name '*.pyc' -type f -exec bash -c 'for pyc; do dpkg -S "$pyc" &> /dev/null || rm -vf "$pyc"; done' -- '{}' +; \
    postgres --version # 271.24 MB

# Configure PostgreSQL
RUN set -eux; \
    dpkg-divert --add --rename --divert "/usr/share/postgresql/postgresql.conf.sample.dpkg" "/usr/share/postgresql/$PG_MAJOR/postgresql.conf.sample"; \
    cp -v /usr/share/postgresql/postgresql.conf.sample.dpkg /usr/share/postgresql/postgresql.conf.sample; \
    ln -sv ../postgresql.conf.sample "/usr/share/postgresql/$PG_MAJOR/"; \
    sed -ri "s!^#?(listen_addresses)\s*=\s*\S+.*!\1 = '*'!" /usr/share/postgresql/postgresql.conf.sample; \
    grep -F "listen_addresses = '*'" /usr/share/postgresql/postgresql.conf.sample # 59.42 KB

# Create and configure PostgreSQL runtime directory
RUN mkdir -p /var/run/postgresql && chown -R postgres:postgres /var/run/postgresql && chmod 3777 /var/run/postgresql # 0 B

# Set PGDATA environment variable
ENV PGDATA=/var/lib/postgresql/data

# Create and configure PGDATA directory
RUN mkdir -p "$PGDATA" && chown -R postgres:postgres "$PGDATA" && chmod 1777 "$PGDATA" # 0 B

# Declare volume for PostgreSQL data
VOLUME /var/lib/postgresql/data

# Copy entrypoint scripts
COPY docker-entrypoint.sh docker-ensure-initdb.sh /usr/local/bin/ # 14.96 KB

# Create symlink for docker-ensure-initdb.sh
RUN ln -sT docker-ensure-initdb.sh /usr/local/bin/docker-enforce-initdb.sh # 23 B

# Set entrypoint
ENTRYPOINT ["docker-entrypoint.sh"]

# Set stop signal
STOPSIGNAL SIGINT

# Expose PostgreSQL port
EXPOSE 5432/tcp

# Default command
CMD ["postgres"]

# Add maintainer label
LABEL maintainer="Encore - https://encore.dev"

# Define arguments
ARG EXTENSION_DIR
ARG LIB_DIR

# Set PostGIS version
ENV POSTGIS_MAJOR=3

# Install PostGIS
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        postgresql-$PG_MAJOR-postgis-$POSTGIS_MAJOR \
        postgresql-$PG_MAJOR-postgis-$POSTGIS_MAJOR-scripts # 227.34 MB

# Copy custom libraries and extensions
COPY /out/lib/ /usr/lib/postgresql/15/lib/ # 1.32 MB
COPY /out/share/extension/ /usr/share/postgresql/15/extension/ # 60.27 KB

# Configure trusted extensions
RUN for ext in address_standardizer address_standardizer-3 address_standardizer_data_us \
    address_standardizer_data_us-3 autoinc amcheck bloom btree_gin btree_gist citext \
    cube dblink dict_int dict_xsyn earthdistance fuzzystrmatch hstore insert_username \
    intagg intarray isn lo ltree moddatetime pageinspect pg_buffercache pgcrypto \
    pg_freespacemap pg_prewarm pgrowlocks pg_stat_statements pgstattuple pg_trgm \
    pg_visibility plpgsql postgis postgis-3 postgis_raster postgis_raster-3 postgis_sfcgal \
    postgis_sfcgal-3 postgis_tiger_geocoder postgis_tiger_geocoder-3 postgis_topology \
    postgis_topology-3 postgres_fdw refint seg sslinfo tablefunc tsm_system_rows \
    tsm_system_time unaccent uuid-ossp vector; do \
        if grep -q "trusted" "$EXTENSION_DIR/$ext.control"; then \
            echo "INFO: $ext is already trusted"; \
        else \
            echo "INFO: $ext is not trusted, adding trusted = true同学们到 $ext.control"; \
            echo "trusted = true" >> "$EXTENSION_DIR/$ext.control"; \
        fi; \
    done # 4.88 KB