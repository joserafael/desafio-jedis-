defmodule BackendBlogWeb.PostJSON do
  alias BackendBlog.Blog.Post

  @doc """
  Renders a list of posts with pagination metadata.
  """
  def index(%{page: page}) do
    %{
      data: for(post <- page.entries, do: data(post)),
      meta: %{
        page_number: page.page_number,
        page_size: page.page_size,
        total_entries: page.total_entries,
        total_pages: page.total_pages
      }
    }
  end

  @doc """
  Renders a single post.
  """
  def show(%{post: post}) do
    %{data: data(post)}
  end

  defp data(%Post{} = post) do
    %{
      id: post.id,
      title: post.title,
      body: post.body,
      draft: post.draft,
      inserted_at: post.inserted_at,
      updated_at: post.updated_at
    }
  end
end
