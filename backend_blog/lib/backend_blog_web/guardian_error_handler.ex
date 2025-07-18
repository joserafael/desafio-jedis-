defmodule BackendBlogWeb.GuardianErrorHandler do
  import Plug.Conn

  @behaviour Guardian.Plug.ErrorHandler

  @impl Guardian.Plug.ErrorHandler
  def auth_error(conn, {type, _reason}, _opts) do
    body = Jason.encode!(%{error: message_for(type)})
    
    conn
    |> put_resp_content_type("application/json")
    |> resp(401, body)
    |> halt()
  end

  defp message_for(:unauthenticated), do: "Authentication required"
  defp message_for(:invalid_token), do: "Invalid token"
  defp message_for(:token_expired), do: "Token expired"
  defp message_for(_), do: "Authentication failed"
end
