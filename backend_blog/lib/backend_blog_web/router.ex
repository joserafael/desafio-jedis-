defmodule BackendBlogWeb.Router do
  use BackendBlogWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :auth do
    plug Guardian.Plug.VerifyHeader, module: BackendBlog.Guardian, error_handler: BackendBlogWeb.GuardianErrorHandler
    plug Guardian.Plug.EnsureAuthenticated, module: BackendBlog.Guardian, error_handler: BackendBlogWeb.GuardianErrorHandler
    plug Guardian.Plug.LoadResource, module: BackendBlog.Guardian, error_handler: BackendBlogWeb.GuardianErrorHandler
  end

  scope "/api", BackendBlogWeb, as: :api do
    pipe_through :api

    # Authentication routes
    post "/auth/register", AuthController, :register
    post "/auth/login", AuthController, :login

    # Public routes
    get "/posts_published", PostController, :index_published
    get "/posts_published/:id", PostController, :show_published
  end

  scope "/api", BackendBlogWeb, as: :api do
    pipe_through [:api, :auth]

    # Protected routes
    get "/posts", PostController, :index
    get "/posts/my-posts", PostController, :my_posts
    get "/posts/:id", PostController, :show
    post "/posts", PostController, :create
    put "/posts/:id", PostController, :update
    patch "/posts/:id", PostController, :update
    delete "/posts/:id", PostController, :delete
  end

  # Enable LiveDashboard and Swoosh mailbox preview in development
  if Application.compile_env(:backend_blog, :dev_routes) do
    # If you want to use the LiveDashboard in production, you should put
    # it behind authentication and allow only admins to access it.
    # If your application does not have an admins-only section yet,
    # you can use Plug.BasicAuth to set up some basic authentication
    # as long as you are also using SSL (which you should anyway).
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through [:fetch_session, :protect_from_forgery]

      live_dashboard "/dashboard", metrics: BackendBlogWeb.Telemetry
      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end
end
