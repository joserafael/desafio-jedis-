defmodule BackendBlog.Blog do
  @moduledoc """
  The Blog context.
  """

  import Ecto.Query, warn: false
  alias BackendBlog.Repo
  alias BackendBlog.Blog.Post

  @doc """
  Returns an `Ecto.Query` for listing posts.
  """
  def list_posts(opts \\ []) do
    Post
    |> apply_filters(opts)
    |> apply_sorting(opts)
  end

  def list_published_posts(opts \\ []) do
    Post
    |> where([p], p.draft == false)
    |> apply_filters(opts)
    |> apply_sorting(opts)
  end

  defp apply_filters(query, opts) do
    Enum.reduce(opts, query, fn
      {:title, title}, query when is_binary(title) and title != "" ->
        title_filter = "%#{title}%"
        where(query, [p], like(p.title, ^title_filter))

      {:draft, draft}, query when is_boolean(draft) ->
        where(query, [p], p.draft == ^draft)

      {:user_id, user_id}, query when is_integer(user_id) ->
        where(query, [p], p.user_id == ^user_id)

      _, query -> query
    end)
  end

  defp apply_sorting(query, opts) do
    case Keyword.get(opts, :sort_by) do
      "title" -> order_by(query, [p], asc: p.title)
      "title_desc" -> order_by(query, [p], desc: p.title)
      "draft" -> order_by(query, [p], [asc: p.draft, desc: p.inserted_at])
      "draft_desc" -> order_by(query, [p], [desc: p.draft, desc: p.inserted_at])
      "created_at" -> order_by(query, [p], asc: p.inserted_at)
      "created_at_desc" -> order_by(query, [p], desc: p.inserted_at)
      "updated_at" -> order_by(query, [p], asc: p.updated_at)
      "updated_at_desc" -> order_by(query, [p], desc: p.updated_at)
      _ -> order_by(query, [p], [desc: p.inserted_at, desc: p.id])
    end
  end

  @doc """
  Gets a single post, returns a tuple.

  Returns `{:ok, post}` if the post is found, otherwise `{:error, :not_found}`.
  """
  def get_post(id) do
    case Repo.get(Post, id) do
      nil -> {:error, :not_found}
      post -> {:ok, post}
    end
  end

  def get_post_published(id) do
    case Repo.get_by(Post, id: id, draft: false) do
      nil -> {:error, :not_found}
      post -> {:ok, post}
    end
  end
  @doc """
  Creates a post.
  """
  def create_post(attrs \\ %{}) do
    %Post{}
    |> Post.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a post.
  """
  def update_post(%Post{} = post, attrs) do
    post
    |> Post.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a post.
  """
  def delete_post(%Post{} = post) do
    Repo.delete(post)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking post changes.
  """
  def change_post(%Post{} = post, attrs \\ %{}) do
    Post.changeset(post, attrs)
  end
end
