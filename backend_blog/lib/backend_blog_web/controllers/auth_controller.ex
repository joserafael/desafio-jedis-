defmodule BackendBlogWeb.AuthController do
  use BackendBlogWeb, :controller

  alias BackendBlog.{Accounts, Guardian}

  action_fallback BackendBlogWeb.FallbackController

  def register(conn, %{"user" => user_params}) do
    with {:ok, user} <- Accounts.create_user(user_params),
         {:ok, token, _claims} <- Guardian.encode_and_sign(user) do
      conn
      |> put_status(:created)
      |> render(:token, token: token, user: user)
    end
  end

  # Handle direct parameters for register as well
  def register(conn, %{"email" => email, "password" => password}) do
    user_params = %{"email" => email, "password" => password}
    with {:ok, user} <- Accounts.create_user(user_params),
         {:ok, token, _claims} <- Guardian.encode_and_sign(user) do
      conn
      |> put_status(:created)
      |> render(:token, token: token, user: user)
    end
  end

  def login(conn, %{"email" => email, "password" => password}) do
    with {:ok, user} <- Accounts.authenticate_user(email, password),
         {:ok, token, _claims} <- Guardian.encode_and_sign(user) do
      render(conn, :token, token: token, user: user)
    end
  end
end
