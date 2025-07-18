# This file is responsible for configuring your application
# and its dependencies with the aid of the Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
import Config

config :backend_blog,
  ecto_repos: [BackendBlog.Repo],
  generators: [timestamp_type: :utc_datetime]

# Configures the endpoint
config :backend_blog, BackendBlogWeb.Endpoint,
  url: [host: "localhost"],
  adapter: Bandit.PhoenixAdapter,
  render_errors: [
    formats: [json: BackendBlogWeb.ErrorJSON],
    layout: false
  ],
  pubsub_server: BackendBlog.PubSub,
  live_view: [signing_salt: "hRWRy8Yx"]

# Configures the mailer
#
# By default it uses the "Local" adapter which stores the emails
# locally. You can see the emails in your browser, at "/dev/mailbox".
#
# For production it's recommended to configure a different adapter
# at the `config/runtime.exs`.
config :backend_blog, BackendBlog.Mailer, adapter: Swoosh.Adapters.Local

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Guardian configuration
config :backend_blog, BackendBlog.Guardian,
  issuer: "backend_blog",
  secret_key: "your-secret-key-here" # This should be changed to a secure secret in production

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{config_env()}.exs"
