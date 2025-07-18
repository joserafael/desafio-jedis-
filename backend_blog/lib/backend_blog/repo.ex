defmodule BackendBlog.Repo do
  use Ecto.Repo,
    otp_app: :backend_blog,
    adapter: Ecto.Adapters.MyXQL

  use Scrivener, page_size: 10
end
