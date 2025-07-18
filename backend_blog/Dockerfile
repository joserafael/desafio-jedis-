# Use a recent official Elixir image on Alpine for a small footprint.
FROM elixir:1.15-alpine

# 1. Install build dependencies required by Bcrypt (build-base for C compiler)
#    and other common tools like git (for deps) and inotify-tools (for live-reloading).
RUN apk add --no-cache build-base git inotify-tools

# 2. Set the working directory in the container.
WORKDIR /app

# 3. Set the Mix environment.
ENV MIX_ENV=dev

# 4. Install Hex and Rebar package managers.
RUN mix local.hex --force && mix local.rebar --force

# 5. Copy dependency definition files.
#    This leverages Docker's layer caching. If these files don't change,
#    Docker won't re-run the dependency installation steps.
COPY mix.exs mix.lock ./

# 6. Fetch and compile dependencies inside the container.
#    This is the crucial step that compiles bcrypt_elixir correctly.
RUN mix deps.get && mix deps.compile

# The rest of the application code will be mounted as a volume from the host
# via docker-compose.yml, which allows for live code reloading.
# The default command will start the Phoenix server.
CMD ["mix", "phx.server"]