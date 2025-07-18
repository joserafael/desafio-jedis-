defmodule BackendBlog.BlogFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `BackendBlog.Blog` context.
  """

  @doc """
  Generate a post.
  """
  def post_fixture(attrs \\ %{}) do
    {:ok, post} =
      attrs
      |> Enum.into(%{
        body: "some body",
        draft: true,
        title: "some title"
      })
      |> BackendBlog.Blog.create_post()

    post
  end
end
