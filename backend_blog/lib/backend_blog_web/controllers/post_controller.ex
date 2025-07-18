defmodule BackendBlogWeb.PostController do
  use BackendBlogWeb, :controller

  alias BackendBlog.Blog
  alias BackendBlog.Repo
  alias BackendBlog.Blog.Post

  action_fallback BackendBlogWeb.FallbackController

  def index(conn, params) do
    filter_opts = build_filter_opts(params)
    page = Blog.list_posts(filter_opts) |> Repo.paginate(params)
    render(conn, :index, page: page)
  end

  def index_published(conn, params) do
    filter_opts = build_filter_opts(params)
    page = Blog.list_published_posts(filter_opts) |> Repo.paginate(params)
    render(conn, :index, page: page)
  end

  defp build_filter_opts(params) do
    opts = []
    
    opts = if params["title"] && params["title"] != "" do
      [{:title, params["title"]} | opts]
    else
      opts
    end
    
    opts = if params["draft"] do
      draft_value = case params["draft"] do
        "true" -> true
        "false" -> false
        true -> true
        false -> false
        _ -> nil
      end
      
      if draft_value != nil do
        [{:draft, draft_value} | opts]
      else
        opts
      end
    else
      opts
    end
    
    opts = if params["user_id"] do
      case Integer.parse(params["user_id"]) do
        {user_id, _} -> [{:user_id, user_id} | opts]
        _ -> opts
      end
    else
      opts
    end
    
    opts = if params["sort_by"] && params["sort_by"] != "" do
      [{:sort_by, params["sort_by"]} | opts]
    else
      opts
    end
    
    opts
  end

  def create(conn, %{"post" => post_params}) do
    current_user = Guardian.Plug.current_resource(conn)
    post_params = Map.put(post_params, "user_id", current_user.id)

    with {:ok, %Post{} = post} <- Blog.create_post(post_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", ~p"/api/posts/#{post}")
      |> render(:show, post: post)
    end
  end

  def show(conn, %{"id" => id}) do
    case Integer.parse(id) do
      {parsed_id, ""} ->
        with {:ok, post} <- Blog.get_post(parsed_id) do
          render(conn, :show, post: post)
        end
      _ ->
        conn
        |> put_status(:bad_request)
        |> json(%{error: "Invalid post ID format"})
    end
  end

  def my_posts(conn, params) do
    current_user = Guardian.Plug.current_resource(conn)
    filter_opts = build_filter_opts(params)
    # Add user_id filter for current user
    filter_opts = [{:user_id, current_user.id} | filter_opts]
    
    page = Blog.list_posts(filter_opts) |> Repo.paginate(params)
    render(conn, :index, page: page)
  end

  def show_published(conn, %{"id" => id}) do
    case Integer.parse(id) do
      {parsed_id, ""} ->
        with {:ok, post} <- Blog.get_post_published(parsed_id) do
          render(conn, :show, post: post)
        end
      _ ->
        conn
        |> put_status(:bad_request)
        |> json(%{error: "Invalid post ID format"})
    end
  end

  def update(conn, %{"id" => id, "post" => post_params}) do
    current_user = Guardian.Plug.current_resource(conn)

    case Integer.parse(id) do
      {parsed_id, ""} ->
        with {:ok, post} <- Blog.get_post(parsed_id),
             true <- post.user_id == current_user.id,
             {:ok, %Post{} = post} <- Blog.update_post(post, post_params) do
          render(conn, :show, post: post)
        else
          false -> conn |> put_status(:forbidden) |> json(%{error: "You can only update your own posts"})
          error -> error
        end
      _ ->
        conn
        |> put_status(:bad_request)
        |> json(%{error: "Invalid post ID format"})
    end
  end

  def delete(conn, %{"id" => id}) do
    current_user = Guardian.Plug.current_resource(conn)

    case Integer.parse(id) do
      {parsed_id, ""} ->
        with {:ok, post} <- Blog.get_post(parsed_id),
             true <- post.user_id == current_user.id,
             {:ok, %Post{}} <- Blog.delete_post(post) do
          send_resp(conn, :no_content, "")
        else
          false -> conn |> put_status(:forbidden) |> json(%{error: "You can only delete your own posts"})
          error -> error
        end
      _ ->
        conn
        |> put_status(:bad_request)
        |> json(%{error: "Invalid post ID format"})
    end
  end
end
