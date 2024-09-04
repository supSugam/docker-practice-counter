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
