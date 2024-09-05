Containers:

- nginx -> used as a web server, root location is mapped to index.html file, and /api is mapped to the backend
- db -> used as a database server, has volume mounted to /var/lib/mysql to persist data
- backend -> used as a backend server, port 3000 is exposed to the host

Images:

- docker-practice-counter-backend -> custom image for this counter app
- nginx and mysql -> pulled images from docker hub to use web server and database server

Volumes:

- db-data -> volume for the db container to persist data

Issues faced:

- 502 Bad Gateway error on attempt to access webpage, fixed by correctly mapping the ports
- 502 Bad Gateway on http request even after ports mapped correctly, fixed by updating nginx conf:

```
location /api {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    to

       location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
```

It works now, but still trying to figure out what actually fixed the issue.

Logs:

<!--
# docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' docker-practice-counter-nginx-1

sh: 10: docker: not found

# ping docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' docker-practice-counter-nginx-1

sh: 11: ping: not found

# ping 172.18.0.3

sh: 12: ping: not found

# cd

# pwd

/root

# apt-get update -y

Get:1 http://deb.debian.org/debian bookworm InRelease [151 kB]
Get:2 http://deb.debian.org/debian bookworm-updates InRelease [55.4 kB]
Get:3 http://deb.debian.org/debian-security bookworm-security InRelease [48.0 kB]
Get:4 http://deb.debian.org/debian bookworm/main amd64 Packages [8787 kB]
Get:5 http://deb.debian.org/debian bookworm-updates/main amd64 Packages [13.8 kB]
Get:6 http://deb.debian.org/debian-security bookworm-security/main amd64 Packages [179 kB]
Fetched 9234 kB in 3s (3374 kB/s)
Reading package lists... Done

# apt-get install -y iputils-ping

Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
The following additional packages will be installed:
libcap2-bin libpam-cap
The following NEW packages will be installed:
iputils-ping libcap2-bin libpam-cap
0 upgraded, 3 newly installed, 0 to remove and 10 not upgraded.
Need to get 96.2 kB of archives.
After this operation, 311 kB of additional disk space will be used.
Get:1 http://deb.debian.org/debian bookworm/main amd64 libcap2-bin amd64 1:2.66-4 [34.7 kB]
Get:2 http://deb.debian.org/debian bookworm/main amd64 iputils-ping amd64 3:20221126-1 [47.1 kB]
Get:3 http://deb.debian.org/debian bookworm/main amd64 libpam-cap amd64 1:2.66-4 [14.5 kB]
Fetched 96.2 kB in 1s (182 kB/s)
debconf: delaying package configuration, since apt-utils is not installed
Selecting previously unselected package libcap2-bin.
(Reading database ... 7581 files and directories currently installed.)
Preparing to unpack .../libcap2-bin_1%3a2.66-4_amd64.deb ...
Unpacking libcap2-bin (1:2.66-4) ...
Selecting previously unselected package iputils-ping.
Preparing to unpack .../iputils-ping_3%3a20221126-1_amd64.deb ...
Unpacking iputils-ping (3:20221126-1) ...
Selecting previously unselected package libpam-cap:amd64.
Preparing to unpack .../libpam-cap_1%3a2.66-4_amd64.deb ...
Unpacking libpam-cap:amd64 (1:2.66-4) ...
Setting up libcap2-bin (1:2.66-4) ...
Setting up libpam-cap:amd64 (1:2.66-4) ...
debconf: unable to initialize frontend: Dialog
debconf: (No usable dialog-like program is installed, so the dialog based frontend cannot be used. at /usr/share/perl5/Debconf/FrontEnd/Dialog.pm line 78.)
debconf: falling back to frontend: Readline
debconf: unable to initialize frontend: Readline
debconf: (Can't locate Term/ReadLine.pm in @INC (you may need to install the Term::ReadLine module) (@INC contains: /etc/perl /usr/local/lib/x86_64-linux-gnu/perl/5.36.0 /usr/local/share/perl/5.36.0 /usr/lib/x86_64-linux-gnu/perl5/5.36 /usr/share/perl5 /usr/lib/x86_64-linux-gnu/perl-base /usr/lib/x86_64-linux-gnu/perl/5.36 /usr/share/perl/5.36 /usr/local/lib/site_perl) at /usr/share/perl5/Debconf/FrontEnd/Readline.pm line 7.)
debconf: falling back to frontend: Teletype
Setting up iputils-ping (3:20221126-1) ...

# ping 172.18.0.3

PING 172.18.0.3 (172.18.0.3) 56(84) bytes of data.
64 bytes from 172.18.0.3: icmp_seq=1 ttl=64 time=0.143 ms
64 bytes from 172.18.0.3: icmp_seq=2 ttl=64 time=0.100 ms
64 bytes from 172.18.0.3: icmp_seq=3 ttl=64 time=0.099 ms
64 bytes from 172.18.0.3: icmp_seq=4 ttl=64 time=0.093 ms
64 bytes from 172.18.0.3: icmp_seq=5 ttl=64 time=0.098 ms
64 bytes from 172.18.0.3: icmp_seq=6 ttl=64 time=0.093 ms
^C
--- 172.18.0.3 ping statistics ---
6 packets transmitted, 6 received, 0% packet loss, time 5117ms
rtt min/avg/max/mdev = 0.093/0.104/0.143/0.017 ms

# ping 172.18.0.3:3000/api/count

ping: 172.18.0.3:3000/api/count: Name or service not known

# curl

curl: try 'curl --help' or 'curl --manual' for more information

# cur 72.18.0.3:3000/api/count

sh: 20: cur: not found

# curl 172.18.0.3:3000/api/count

{"count":6}# -->
