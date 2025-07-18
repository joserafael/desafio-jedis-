defmodule BackendBlogWeb.AuthJSON do
  alias BackendBlog.Accounts.User

  @doc """
  Renders a token with user information.
  """
  def token(%{token: token, user: user}) do
    %{
      token: token,
      user: user_data(user)
    }
  end

  defp user_data(%User{} = user) do
    %{
      id: user.id,
      email: user.email
    }
  end
end
