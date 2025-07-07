ARG BUN_VERSION
FROM oven/bun:${BUN_VERSION} as base
WORKDIR /usr/src/app

FROM base AS install

RUN mkdir -p /temp/prod
COPY . /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production --filter "@devicemonster/server"

FROM base AS release
COPY ./server/ ./
COPY --from=install /temp/prod/node_modules node_modules

USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "start" ]
