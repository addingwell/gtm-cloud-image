FROM node:16 AS build-env
COPY . /app/
WORKDIR /app/
RUN npm --unsafe-perm install
RUN mkdir /third_party
RUN curl http://ftp.gnu.org/gnu/glibc/glibc-2.31.tar.gz \
  | tar -C /third_party -xz
FROM gcr.io/distroless/nodejs:16
COPY --from=build-env /app/ /app/
COPY --from=build-env /third_party/ /third_party/
HEALTHCHECK CMD ["/nodejs/bin/node", "/app/health_checker_bin.js"]
WORKDIR /app/
CMD ["server_bin.js"]
